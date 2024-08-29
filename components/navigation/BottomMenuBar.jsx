import React from 'react';
import { HomeIcon, UploadIcon, UserIcon, ShareIcon, BlogIcon } from '@heroicons/react/outline';

const BottomMenuBar = () => {
  return (
    <div className="fixed bottom-0 w-full bg-gray-800 text-white flex justify-between items-center px-4 py-2 shadow-lg">
      <div className="flex flex-col items-center">
        <BlogIcon className="h-6 w-6" />
        <span className="text-xs">Blog</span>
      </div>
      <div className="flex flex-col items-center">
        <ShareIcon className="h-6 w-6" />
        <span className="text-xs">Share</span>
      </div>
      <div className="flex flex-col items-center">
        <HomeIcon className="h-10 w-10" />
        <span className="text-sm font-bold">Home</span>
      </div>
      <div className="flex flex-col items-center">
        <UploadIcon className="h-6 w-6" />
        <span className="text-xs">Upload</span>
      </div>
      <div className="flex flex-col items-center">
        <UserIcon className="h-6 w-6" />
        <span className="text-xs">Account</span>
      </div>
    </div>
  );
};

export default BottomMenuBar;