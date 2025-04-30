import {
  RectangleStackIcon,
  LinkIcon,
  ChartPieIcon,
  TrophyIcon,
  ArrowRightStartOnRectangleIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

interface NewsButtonsProps {
  onNavigate: (section: string) => void;
}

const NewsButtons: React.FC<NewsButtonsProps> = ({ onNavigate }) => {
  const t = useTranslations("NewsView");

  const NewsOptions = [
    {
      label: t("joinDiscord"),
      icon: <LinkIcon />,
      section: "discord-link",
      external: true,
      link: "https://discord.com/invite/BBFkgV4PYS",
    },
    {
      label: t("followX"),
      icon: <LinkIcon />,
      section: "x-link",
      external: true,
      link: "https://x.com/intent/follow?screen_name=PolitikozNft",
    },
    {
      label: t("socialTasks"),
      icon: <RectangleStackIcon />,
      section: "social-tasks",
      disabled: true,
    },
    {
      label: t("discordRank"),
      icon: <TrophyIcon />,
      section: "discord-rank",
      disabled: true,
    },
    {
      label: t("distributionPolicy"),
      icon: <ChartPieIcon />,
      section: "distribution-koz",
      disabled: true,
    },
    {
      label: t("claimKoz"),
      icon: <BanknotesIcon />,
      section: "claim-koz",
      disabled: true,
    },
    {
      label: t("exit"),
      icon: <ArrowRightStartOnRectangleIcon />,
      section: "exit",
      disabled: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
      {NewsOptions.map((option, index) => {
        const isDisabled = option.disabled && option.section !== "exit";
        const isExternal = option.external;

        const buttonStyle =
          "w-44 h-20 flex flex-col items-center justify-center p-2 bg-gray-900 shadow-[6px_6px_0px_black] hover:bg-gray-700 transition font-['Press_Start_2P']";

        return isExternal ? (
          <a
            key={index}
            href={option.link}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyle}
          >
            <div className="w-8 h-8 flex items-center justify-center text-white">
              {option.icon}
            </div>
            <span className="text-[10px] text-yellow-300 text-center leading-tight min-h-[32px] mt-1">
              {option.label}
            </span>
          </a>
        ) : (
          <button
            key={index}
            onClick={() => !isDisabled && onNavigate(option.section)}
            disabled={isDisabled}
            className={`${buttonStyle} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="w-8 h-8 flex items-center justify-center text-white">
              {option.icon}
            </div>
            <div className="flex flex-col items-center mt-1 min-h-[32px] justify-center">
              <span className="text-[10px] text-yellow-300 text-center leading-tight">
                {option.label}
              </span>
              {isDisabled && (
                <span className="text-[8px] text-red-400 text-center leading-tight mt-1">
                  {t("comingSoon")}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default NewsButtons;
