import Image from "next/image";
import { useTranslations } from "next-intl";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface Props {
  kozBalance: number;
}

export default function BuyTicketHeader({ kozBalance }: Props) {
  const t = useTranslations("BuyTicket");

  return (
    <div className="mb-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Image
          src="/images/assets/frontman.png"
          alt="Frontman"
          width={80}
          height={80}
          className="rounded border-2 border-yellow-400"
        />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-yellow-300">{t("title")}</h3>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-300">
              {t("pricePerTicket")}{" "}
              <span className="text-yellow-400 font-bold">
                200 KOZ
              </span>
            </p>
            <div className="space-y-1">
              <div className="text-xs text-gray-400">
                {t("perTicketFeeInfo", { fee: "0.1" })}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>{t("minimumFeeInfo")}</span>
                <div className="group relative">
                  <InformationCircleIcon className="h-4 w-4 text-gray-500 hover:text-yellow-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-800 rounded-lg shadow-lg w-64 hidden group-hover:block">
                    <p className="text-xs text-gray-300">{t("minimumFeeTooltip")}</p>
                  </div>
                </div>
              </div>              
            </div>
            <p className="text-sm text-gray-300 mt-1">
              {t("yourBalance")}{" "}
              <span className="text-white font-bold">{kozBalance.toLocaleString()} KOZ</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}