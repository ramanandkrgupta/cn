"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import banner from "@/public/assets/banner.png"; // Import the local image correctly

const bannerData = [
  {
    src: banner,
    link: "/courses/web-development",
  },
  {
    src: banner,
    link: "/courses/data-science",
  },
  {
    src: banner,
    link: "/courses/design",
  },
];

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === bannerData.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Banner Section */}
      <div className="relative w-full overflow-hidden flex justify-center">
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {bannerData.map((banner, index) => (
           

           <Link href={banner.link} key={index} className="min-w-full flex justify-center">
           <Image
             src={banner.src}
             alt={`Banner ${index + 1}`}
             width={1024}
             height={576}
             className="rounded-lg object-contain"
             priority
             quality={100}
           />
         </Link>
         
            
          ))}
        </div>
      </div>

      {/* Dots Section */}
      <div className="flex mt-3 space-x-2">
        {bannerData.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full transition-colors duration-300 cursor-pointer ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}