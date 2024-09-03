import React from 'react';

const ProfileCard = () => {
  return (
    <div className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <img
            src="img/profile.jpg"
            alt="Profile Picture"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Neelesh Chaudhary</h2>
            <p className="text-gray-400">UI / UX Designer</p>
          </div>
        </div>
        <div className="flex space-x-6 md:space-x-4">
          <div className="text-center">
            <p className="text-white font-medium">Post</p>
            <p className="text-lg font-bold text-white">23</p>
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Followers</p>
            <p className="text-lg font-bold text-white">326</p>
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Following</p>
            <p className="text-lg font-bold text-white">120</p>
          </div>
        </div>
      </div>
      <div>
        <p className="text-white font-medium mb-2">About</p>
        <p className="text-gray-400 text-sm md:text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare
          pretium placerat ut platea. Purus blandit integer sagittis massa vel
          est hac.
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;