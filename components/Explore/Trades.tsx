"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useTranslations } from "next-intl";
import "swiper/css";
import "swiper/css/navigation";

interface Trade {
  buyerAddress: string;
  sellerAddress: string;
  market: string;
  name: string;
  price: number;
}

interface TradesProps {
  trades: Trade[];
}

const formatAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-6)}`;

const formatPrice = (price: number) => `${price} ADA`;

const Trades: React.FC<TradesProps> = ({ trades }) => {
  const t = useTranslations("Explore.Trades");

  return (
    <section className="w-full py-8 px-6 sm:px-10 lg:px-16 bg-[#4EA9E8] text-white">
      <div className="mb-6 text-center">
        <h2 className="text-xl sm:text-2xl font-pixel font-bold text-[#FFD700]">
          {t("title")}
        </h2>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        speed={5000}
        modules={[Navigation, Autoplay]}
        breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 5 } }}
        className="py-4"
      >
        {trades.map((trade, index) => {
          const imageUrl = `/images/assets/${trade.name}.png`;
          return (
            <SwiperSlide
              key={index}
              className="bg-[#2C2C2C] w-[160px] p-4 rounded-md shadow-lg flex-shrink-0"
            >
              <div className="relative w-full h-full mb-2 bg-[#555555] flex items-center justify-center text-[14px] text-gray-300">
                <img
                  src={imageUrl}
                  alt={`Politikoz#${trade.name}`}
                  className="w-full h-full object-cover rounded-md"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <h3 className="text-[14px] font-bold text-[#FFD700] mb-1">
                {`Politikoz#${trade.name}`}
              </h3>
              <p className="text-[14px] text-[#FFD700] font-bold mb-2">
                {t("price", { price: formatPrice(trade.price) })}
              </p>
              <p className="text-[14px] text-[#E6F7FF]">
                <span className="font-bold">{t("buyer")}:</span> {formatAddress(trade.buyerAddress)}
              </p>
              <p className="text-[14px] text-[#E6F7FF] mb-2">
                <span className="font-bold">{t("seller")}:</span> {formatAddress(trade.sellerAddress)}
              </p>
              <p className="text-[14px] text-[#FFD700] font-bold">{trade.market}</p>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default Trades;
