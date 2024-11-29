"use client";
import { useSession } from "next-auth/react";
import Feed from "@/components/Feed";
import Banner from "@/components/Banner";
import Notification from "@/components/Notification";
import Greeting from "@/components/Greeting";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center sm:mb-5">
      {session?.user?.name && (
        <div className="w-full">
          <Greeting name={session.user.name} />
        </div>
      )}

      <div className="w-full">
        <Banner />
      </div>

      <div className="w-full my-4">
        <Notification />
      </div>

      <div className="w-full md:px-8">
        <Feed
          label="RGPV Courses"
          styleHead="mt-3"
          style="md:grid-cols-5 mt-4 gap-1.5 justify-between md:justify-start"
        />
      </div>
    </div>
  );
}
