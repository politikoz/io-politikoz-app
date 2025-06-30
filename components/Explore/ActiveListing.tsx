"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useTranslations } from "next-intl";
import "swiper/css";
import "swiper/css/navigation";

interface Listing {
  market: string;
  name: string;
  price: number;
}

interface ActiveListingProps {
  listings: Listing[];
}

const formatPrice = (price: number) => `${price} ADA`;

const ActiveListing: React.FC<ActiveListingProps> = ({ listings }) => {
  const t = useTranslations("Explore.ActiveListing");

  return (
    <section
      className="w-full py-8 px-6 sm:px-10 lg:px-16 text-white relative"
      style={{
        backgroundColor: "#1c1c1c",
        boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.2)",
      }}
    >
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
        {listings.map((listing, index) => {
          const imageUrl = `/images/assets/${listing.name}.png`; // Gerar URL da imagem com base no nome
          return (
            <SwiperSlide
              key={index}
              className="bg-[#2C2C2C] w-[160px] p-4 rounded-md shadow-lg flex-shrink-0"
            >
              <div className="relative w-full h-full mb-2 bg-[#555555] flex items-center justify-center text-[14px] text-gray-300">
                <Image
                src={imageUrl}
                alt={`Politikoz#${listing.name}`}
                width={160}
                height={160}
                className="w-full h-full object-cover rounded-md"
                style={{ imageRendering: "pixelated" }}
              />
              </div>
              <h3 className="text-[14px] font-bold text-[#FFD700] mb-1">
                {`Politikoz#${listing.name}`}
              </h3>
              <p className="text-[14px] text-[#FFD700] font-bold mb-2">
                {t("price", { price: formatPrice(listing.price) })}
              </p>
              <p className="text-[14px] font-bold">{listing.market}</p>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default ActiveListing;
