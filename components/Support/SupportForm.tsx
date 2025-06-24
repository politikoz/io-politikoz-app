"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import FormHeader from "./FormHeader";
import SuccessMessage from "./SuccessMessage";
import SupportFormFields from "./SupportFormFields";

interface SupportFormProps {
  onClose: () => void;
}

const SupportForm: React.FC<SupportFormProps> = ({ onClose }) => {
  const t = useTranslations("Support");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("message", formData.message);

    files.forEach((file) => formDataToSend.append("attachment", file));

    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await res.json();
      if (res.ok) {
        setResponseMessage(t("successMessage"));
        setIsSuccess(true);
      } else {
        setResponseMessage(result.error || t("errorMessage"));
      }
    } catch (error) {    
      setResponseMessage(t("unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <FormHeader title={t("formTitle")} onClose={onClose} />
        {isSuccess ? (
          <SuccessMessage message={responseMessage} />
        ) : (
          <SupportFormFields
            formData={formData}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default SupportForm;
