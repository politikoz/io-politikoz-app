import { useTranslations } from "next-intl";

interface HistoryProps {
  history: string[];
}

export default function History({ history }: HistoryProps) {
  const t = useTranslations("PolitikozProfile");

  return (
    <div className="border-4 border-white bg-[#fdfdfd] shadow-[4px_4px_0px_black] relative w-full h-[180px] overflow-y-auto">
      <div className="relative w-full min-h-full px-4 py-2">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-300 to-transparent h-full w-full pointer-events-none opacity-50 bg-[length:100%_32px] bg-repeat"></div>

        <h3 className="text-[20px] font-semibold text-yellow-600 font-['Delicious_Handrawn'] pl-2">
          {t("history")}
        </h3>

        <div className="pl-2">
          {history.map((line, index) => (
            <p key={index} className="text-gray-800 text-[20px] font-['Delicious_Handrawn']">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
