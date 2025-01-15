// components/profile/ProfileDetails.tsx
import React from 'react'
import {
  Building2,
  Calendar,
  GraduationCap,
  Linkedin,
  ScrollText,
} from 'lucide-react'
import {
  FaFacebook,
  FaTwitter,
  FaReddit,
  FaDiscord,
  FaTelegram,
  FaSnapchat,
  FaInstagram,
  FaGithub,
} from 'react-icons/fa'

const ProfileDetails = ({ details }) => {
  return (
    <div className="bg-base-300 p-4 rounded-lg">
      <h2 className="font-semibold mb-4">Details</h2>
      <div className="space-y-3">
        {/* Education Details */}
        <div className="space-y-3 border-b pb-3">
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-primary" />
            <p className="text-sm">Location: {details.location}</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-primary" />
            <p className="text-sm">Year: {details.year}</p>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="w-4 h-4 text-primary" />
            <p className="text-sm">Semester: {details.semester}</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-primary" />
            <p className="text-sm">Course: {details.course}</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-primary" />
            <p className="text-sm">Branch: {details.branch}</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Linkedin className="w-4 h-4 text-primary" />
            <p className="text-sm">LinkedIn: {details.linkedin}</p>
          </div>
          <div className="flex items-center gap-3">
            <FaGithub className="w-4 h-4 text-primary" />
            <p className="text-sm">GitHub: {details.github}</p>
          </div>
          <div className="flex items-center gap-3">
            <FaFacebook className="w-4 h-4 text-primary" />
            <p className="text-sm">Facebook: {details.facebook}</p>
          </div>
          <div className="flex items-center gap-3">
            <FaTwitter className="w-4 h-4 text-primary" />
            <p className="text-sm">Twitter: {details.twitter}</p>
          </div>
          <div className="flex items-center gap-3">
            <FaReddit className="w-4 h-4 text-primary" />
            <p className="text-sm">Reddit: {details.reddit}</p>
          </div>
          <div className="flex items-center gap-3">
            <FaDiscord className="w-4 h-4 text-primary" />
            <p className="text-sm">Discord: {details.discord}</p>
          </div>
          <div className="flex items-center gap-3">
            <FaTelegram className="w-4 h-4 text-primary" />
            <p className="text-sm">Telegram: {details.telegram}</p>
          </div>
          <div className="flex items-center gap-3">
            <FaSnapchat className="w-4 h-4 text-primary" />
            <p className="text-sm">Snapchat: {details.snapchat}</p>
          </div>
          <div className="flex items-center gap-3">
            <FaInstagram className="w-4 h-4 text-primary" />
            <p className="text-sm">Instagram: {details.instagram}</p>
          </div>
          <div className="flex items-center gap-3">
            <ScrollText className="w-4 h-4 text-primary" />
            <p className="text-sm">Website: {details.website}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileDetails
