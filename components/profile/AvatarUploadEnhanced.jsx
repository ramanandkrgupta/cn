'use client';

import { useCallback, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/useUserStore';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';

export default function AvatarUploadEnhanced() {
  const { update } = useSession();
  const router = useRouter();
  const { userData, updateUser } = useUserStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarUpdate = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/v1/members/users/avatar', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload');
      
      const { avatarUrl } = await response.json();

      // Update both store and session
      updateUser({ avatar: avatarUrl });
      await update({ user: { avatar: avatarUrl } });

      toast.success('Avatar updated!');
    } catch (error) {
      toast.error('Failed to update avatar');
    } finally {
      setIsUploading(false);
    }
  }, [update, updateUser]);

  return (
    <div className="relative group">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
        <img
          src={userData?.avatar || '/images/default-avatar.png'}
          alt="Profile"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <Camera className="w-6 h-6 text-white" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpdate}
            disabled={isUploading}
          />
        </label>
      </div>
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}