import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Busboy, { FileInfo } from "busboy";

export const config = {
  api: {
    bodyParser: false, // Desativa o body-parser padrão
  },
};

export async function POST(req: Request): Promise<Response> {
    const fields: Record<string, string> = {};
  const attachments: { filename: string; content: Buffer }[] = [];

  try {
    const busboy = Busboy({
      headers: Object.fromEntries(req.headers.entries()),
    });

    return await new Promise((resolve, reject) => {
      busboy.on("field", (name, value) => {
        fields[name] = value;
      });

      busboy.on("file", (name, file, info: FileInfo) => {
        const chunks: Buffer[] = [];

        file.on("data", (data) => {
          chunks.push(data);
        });

        file.on("end", () => {
          attachments.push({ filename: info.filename, content: Buffer.concat(chunks) });
        });
      });

      busboy.on("finish", async () => {

        const { name, email, message } = fields;

        if (!name || !email || !message) {
          resolve(
            NextResponse.json({ error: "All fields are required" }, { status: 400 })
          );
          return;
        }

        try {
          const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SMTP_HOST,
            port: Number(process.env.EMAIL_SMTP_PORT),
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });
          await transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: process.env.EMAIL_SUBJECT,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            attachments,
          });

          resolve(NextResponse.json({ success: "Email sent successfully!" }));
        } catch (error) {
          resolve(
            NextResponse.json(
              { error: "Failed to send email. Please try again later." },
              { status: 500 }
            )
          );
        }
      });

      const reader = req.body?.getReader();
      if (!reader) {
        reject(NextResponse.json({ error: "No request body found" }, { status: 400 }));
        return;
      }

      const stream = new ReadableStream({
        async start(controller) {
          let done = false;
          while (!done) {
            const { value, done: readerDone } = await reader.read();
            if (value) controller.enqueue(value);
            done = readerDone;
          }
          controller.close();
        },
      });

      stream
        .pipeTo(
          new WritableStream({
            write(chunk) {
              busboy.write(chunk);
            },
            close() {
              busboy.end();
            },
          })
        )
        .catch((error) => {
          reject(
            NextResponse.json(
              { error: "Failed to process the request" },
              { status: 500 }
            )
          );
        });
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}
