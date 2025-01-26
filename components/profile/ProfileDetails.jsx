import React from 'react'
import {
  Building2,
  Calendar,
  GraduationCap,
  Linkedin,
  ScrollText,
  BookOpen,
  School,
  Glasses,
  GraduationCap as Education,
  BookOpen as Stream,
} from 'lucide-react'
import {
  FaGithub,
  FaFacebook,
  FaTwitter,
  FaReddit,
  FaDiscord,
  FaTelegram,
  FaSnapchat,
  FaInstagram,
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
            <School className="w-4 h-4 text-primary" />
            <p className="text-sm">Level: {details.level}</p>
          </div>
          <div className="flex items-center gap-3">
            <Stream className="w-4 h-4 text-primary" />
            <p className="text-sm">Stream: {details.stream}</p>
          </div>
          <div className="flex items-center gap-3">
            <Education className="w-4 h-4 text-primary" />
            <p className="text-sm">Degree: {details.degree}</p>
          </div>
          <div className="flex items-center gap-3">
            <Glasses className="w-4 h-4 text-primary" />
            <p className="text-sm">Specialization: {details.specialization}</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-primary" />
            <p className="text-sm">Year: {details.year}</p>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="w-4 h-4 text-primary" />
            <p className="text-sm">Semester: {details.semester}</p>
          </div>
        </div>

        {/* Social Links - Only show if they exist */}
        <div className="space-y-3">
          {details.github && (
            <div className="flex items-center gap-3">
              <FaGithub className="w-4 h-4 text-primary" />
              <a
                href={details.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                GitHub Profile
              </a>
            </div>
          )}
          {Object.entries({
            linkedin: [Linkedin, 'LinkedIn'],
            facebook: [FaFacebook, 'Facebook'],
            twitter: [FaTwitter, 'Twitter'],
            reddit: [FaReddit, 'Reddit'],
            discord: [FaDiscord, 'Discord'],
            telegram: [FaTelegram, 'Telegram'],
            snapchat: [FaSnapchat, 'Snapchat'],
            instagram: [FaInstagram, 'Instagram'],
            website: [ScrollText, 'Website'],
          }).map(
            ([key, [Icon, label]]) =>
              details[key] && (
                <div key={key} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-primary" />
                  <p className="text-sm">
                    {label}: {details[key]}
                  </p>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileDetails
