"use client";

import useUserStore from '@/store/useUserStore';
import Greeting from "@/components/Greeting";
import Banner from "@/components/Banner";
import Notification from "@/components/Notification";
import Feed from "@/components/Feed";
import Footer from "./(routes)/about/components/Footer";

export default function Home() {
  const { userData } = useUserStore();

  return (
    <>
      <section className="flex flex-col items-center sm:mb-5">
        {/* Greeting Section */}
        {userData?.name && (
          <div className="w-full">
            <Greeting name={userData.name} />
          </div>
        )}

        {/* Banner Section */}
        <div className="w-full">
          <Banner />
        </div>

        {/* Notification Section */}
        <div className="w-full">
          <Notification />
        </div>

        {/* Feed Section */}
        <div className="w-full md:px-8 sm:mb-16">
          <Feed
            label="RGPV Courses"
            styleHead="mt-3"
            style="md:grid-cols-5 mt-4 gap-1.5 justify-between md:justify-start"
          />
        </div>
      </section>
      <Footer />
    </>
  );
}
