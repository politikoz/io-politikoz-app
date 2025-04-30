import React, { FormEvent, ChangeEvent } from "react";
import { useTranslations } from "next-intl";

interface SupportFormFieldsProps {
  formData: { name: string; email: string; message: string };
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const SupportFormFields: React.FC<SupportFormFieldsProps> = ({
  formData,
  onInputChange,
  onFileChange,
  isSubmitting,
  onSubmit,
}) => {
  const t = useTranslations("Support");

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t("nameLabel")}</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder={t("namePlaceholder")}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t("emailLabel")}</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder={t("emailPlaceholder")}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t("messageLabel")}</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={onInputChange}
          className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          rows={3}
          placeholder={t("messagePlaceholder")}
          required
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t("attachmentsLabel")}</label>
        <input
          type="file"
          multiple
          onChange={onFileChange}
          className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm text-gray-900"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {isSubmitting ? t("sending") : t("send")}
      </button>
    </form>
  );
};

export default SupportFormFields;
