import React from 'react';

const ProfileCard = () => {
  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img
            src="https://i.imgur.com/J43F22c.png"
            alt="Profile Picture"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">Neelesh Chaudhary</h2>
            <p className="text-gray-400">UI / UX Designer</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <div>
            <p className="text-white font-medium">Post</p>
            <p className="text-lg font-bold text-white">23</p>
          </div>
          <div>
            <p className="text-white font-medium">Followers</p>
            <p className="text-lg font-bold text-white">326</p>
          </div>
          <div>
            <p className="text-white font-medium">Following</p>
            <p className="text-lg font-bold text-white">120</p>
          </div>
        </div>
      </div>
      <div>
        <p className="text-white font-medium mb-2">About</p>
        <p className="text-gray-400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare
          pretium placerat ut platea. Purus blandit integer sagittis massa vel
          est hac.
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
