import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

import { doc, fire, newt, premiumIcon } from "@/public/icons";

import PostViewDialogBox from "../models/PostViewDialogBox";

const PostCard = ({ data }) => {
  const { data: session } = useSession(); // Get session data
  const description = data.description.slice(0, 120);
  const shouldShowDots = data.description.length > 120;

  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = () => {
    // Logic to handle file download
  };

  return (
    <div
      className="card rounded-lg cursor-pointer bg-neutral hover:bg-[#2c2f32] p-2"
      title={data.description}
      onClick={() => setIsOpen(true)}
    >
      <div className="absolute top-0 right-0 w-10 h-10">
        <Image src={newt} alt="New Tag Icon" className="w-20" />
        {/* You can add CSS classes like animate-pulse for a pulsing effect */}
      </div>
      <div className="flex flex-row items-center relative">
        {/* Added relative positioning here */}
        <div className="">
          <figure className="w-[70px] h-[70px] md:w-20 md:h-20 bg-gray-300 rounded-full overflow-hidden relative">
            <Image src={doc} alt={data.description} />
          </figure>
          <div className="absolute top-0 left-0 w-10 h-10">
            <Image
              src={fire}
              alt="Fire Icon"
              className="animate-pulse w-25 h-25"
            />
            {/* You can add CSS classes like animate-pulse for a pulsing effect */}
          </div>
        </div>
        <div className="text-start ml-5">
          <p className="text-base font-semibold font-sans md:font-mono mt-2 text-white">
            {data.title}
          </p>
          <p className="text-sm font-medium md:font-semibold font-sans md:font-mono tracking-tighter md:tracking-normal text-[#808191] normal-case break-all">
            {shouldShowDots ? `${description}...` : description}
          </p>
        </div>
      </div>
      {/* Premium Tag */}
      {data.premium && (
        <div className="absolute top-0 left-0 w-10 h-10">
          <Image src={premiumIcon} alt="Premium Tag Icon" className="w-20" />
        </div>
      )}
      {isOpen && (
        <PostViewDialogBox isOpen={isOpen} setIsOpen={setIsOpen} data={data} />
      )}

      {/* Download Button */}
      <div className="mt-2">
        {data.premium ? (
          session && session.user ? (
            session.user.userRole === "PRO" ? (
              <button
                onClick={handleDownload}
                className="bg-accent text-white px-4 py-2 rounded"
              >
                Download
              </button>
            ) : (
              <p className="text-red-500">
                Upgrade to PRO to download this file.
              </p>
            )
          ) : (
            <p
              className="text-blue-500 cursor-pointer"
              onClick={() => signIn()}
            >
              Login to download
            </p>
          )
        ) : (
          <button
            onClick={handleDownload}
            className="bg-accent text-white px-4 py-2 rounded"
          >
            Download
          </button>
        )}
      </div>
      <div className="flex justify-between text-sm text-gray-500 mt-2">
        <span>{data.downloads} downloads</span>
        <span>{data.likes} likes</span>
        <span>{data.shares} shares</span>
      </div>
    </div>
  );
};

export default PostCard;
