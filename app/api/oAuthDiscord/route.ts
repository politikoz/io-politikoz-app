import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import axios from "axios";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";
import dayjs from "dayjs";

// Cache de códigos processados
const usedCodes = new Map<string, number>();

// URLs da API do Discord
const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
const DISCORD_USER_URL = "https://discord.com/api/users/@me";

// Variáveis de ambiente
const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const JWT_SECRET = process.env.JWT_SECRET!;

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  email?: string;
}

/**
 * Troca o código de autorização pelo token de acesso.
 */
async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  }).toString();

  try {
    const { data } = await axios.post<TokenResponse>(DISCORD_TOKEN_URL, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error_description || "Falha ao obter token"
    );
  }
}

/**
 * Obtém informações do usuário a partir do token de acesso.
 */
async function getUserInfo(accessToken: string): Promise<DiscordUser> {
  try {
    const { data } = await axios.get<DiscordUser>(DISCORD_USER_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error_description || "Falha ao obter informações do usuário"
    );
  }
}

/**
 * Lida com a requisição de autenticação.
 */
export async function POST(request: Request) {
  try {
    const { code, redirectUri } = await request.json();

    if (!code || !redirectUri) {
      return NextResponse.json(
        { error: "Authorization code and redirect URI are required" },
        { status: 400 }
      );
    }

    if (usedCodes.has(code)) {
      return NextResponse.json({ message: "Code already processed" });
    }

    const tokenData = await exchangeCodeForToken(code, redirectUri);
    const userData = await getUserInfo(tokenData.access_token);

    usedCodes.set(code, Date.now());
    setTimeout(() => usedCodes.delete(code), 10 * 60 * 1000);

    const token = sign(userData, JWT_SECRET, { expiresIn: "365d" });

    const cookie = serialize("discord_user", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
      expires: dayjs().add(1, "year").toDate(),
      path: "/",
    });

    const response = NextResponse.json(userData);
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Falha na autenticação com Discord" },
      { status: 500 }
    );
  }
}

/**
 * Lida com a requisição de consultar user no cookie.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("discord_user")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // Decodifica e ajusta o avatar, caso necessário
    const userData: any = verify(token, JWT_SECRET);
    const userWithAvatarUrl = {
      ...userData,
      avatar: userData.avatar?.startsWith("http")
        ? userData.avatar
        : `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
    };

    return NextResponse.json(userWithAvatarUrl);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao validar o token do usuário" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ message: "Logout successful" });
  response.headers.set(
    "Set-Cookie",
    serialize("discord_user", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
      expires: new Date(0), // Expira o cookie
      path: "/",
    })
  );
  return response;
}


