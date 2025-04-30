"use client";

import React, { useState } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";
import SupportForm from "./SupportForm";

const SupportButton: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const t = useTranslations("Support");

  const toggleForm = () => setIsFormVisible(!isFormVisible);

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={toggleForm}
        className="bg-blue-600 text-white flex items-center text-[10px] py-2 px-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        <QuestionMarkCircleIcon className="h-4 w-4" />
        <span>{t("formTitle")}</span>
      </button>
      {isFormVisible && <SupportForm onClose={toggleForm} />}
    </div>
  );
};

export default SupportButton;
