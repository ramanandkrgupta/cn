import React from 'react';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';

const ProfileCard = ({ user }) => {
  const userRoleText = user.userRole === 'PRO' ? 'Premium Member' : 'Free Member';

  return (
    <div className="bg-[#2c2f32] p-6 md:p-8 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <img
            src="img/profile.jpg"
            alt="Profile Picture"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold text-white">{user.name}</h2>
              {user.userRole === 'premium' && <CheckBadgeIcon className="h-5 w-5 text-green-500 ml-2" />}
            </div>
            <p className="text-gray-400">{userRoleText}</p>
          </div>
        </div>
        <div className="flex space-x-6 md:space-x-4">
          <div className="text-center">
            <p className="text-white font-medium">Download</p>
            <p className="text-lg font-bold text-white">{user.downloadCount || 239}</p>
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Like</p>
            <p className="text-lg font-bold text-white">{user.likeCount || 234}</p>
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Refer</p>
            <p className="text-lg font-bold text-white">{user.referCount || 512}</p>
          </div>
        </div>
      </div>
      <div>
        <p className="text-white font-medium mb-2">About</p>
        <p className="text-gray-400 text-sm md:text-base">
          {user.about || "hello"}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;