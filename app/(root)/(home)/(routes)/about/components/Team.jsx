import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Image from "next/image";

const SocialLinks = ({
  githubUsername,
  xUsername,
  linkedinUsername,
  instagramUsername,
}) => {
  return (
    <div className="flex justify-start space-x-1">
      {githubUsername && (
        <SocialLink
          icon={<IconBrandGithub className="social-icon" />}
          tooltip="Github"
          url={`https://github.com/${githubUsername}`}
        />
      )}
      {xUsername && (
        <SocialLink
          icon={<IconBrandX className="social-icon" />}
          tooltip="twitter"
          url={`https://twitter.com/${xUsername}`}
        />
      )}
      {linkedinUsername && (
        <SocialLink
          icon={<IconBrandLinkedin className="social-icon" />}
          tooltip="Linkedin"
          url={`https://www.linkedin.com/in/${linkedinUsername}`}
        />
      )}
      {instagramUsername && (
        <SocialLink
          icon={<IconBrandInstagram className="social-icon" />}
          tooltip="Instagram"
          url={`https://www.instagram.com/${instagramUsername}`}
        />
      )}
    </div>
  );
};

const SocialLink = ({ icon, tooltip, url }) => {
  return (
    <Link
      className="tooltip tooltip-bottom"
      data-tip={tooltip}
      href={url}
      target="_blank"
    >
      {icon}
    </Link>
  );
};

const Team = () => {
  const teamMembers = [
    {
      name: "Lokendra Patel",
      role: "Founder & CEO",
      img: "/team/member-02.jpg",
      githubUsername: "lokendra508",
      xUsername: "Lokendr52277034",
      linkedinUsername: "lokendra-patel-233719220",
      instagramUsername: "_lokendra_022"
    },
    {
      name: "Ramanand Kumar Gupta",
      role: "Full Stack Web Developer",
      img: "/team/member-1.jpeg",
      githubUsername: "ramanandkrgupta",
      xUsername: "RAMANANDKUMARSAW",
      linkedinUsername: "ramanand-kumar-saw",
      instagramUsername: "ramanand-kumar-18"
    },
    {
      name: " Ashutosh Tripathi",
      role: "Advertising Head",
      img: "/team/member-03.jpg",
      linkedinUsername: "ashutosh-tripathi-315386169",
    },
    {
      name: "Anit Bajpai",
      role: "Content Management Head & Advertising Coordinator ",
      img: "/team/member-08.jpg",
      xUsername: "AnitBajpai1",
    },
    {
      name: "Samradh Patel",
      role: " ",
      img: "/team/member-04.jpg",
      githubUsername: "    ",
      xUsername: "PatelSamradh",
      linkedinUsername: "samradhpatel",
    },

    {
      name: "Prankur Patel",
      role: "Graphic Designer ",
      img: "/team/member-05.jpg",

      xUsername: "prankur_patel17",
      linkedinUsername: "prankur-patel-b3076a30a",
    },

    // {
    //   name: "Sumit Singh Raghuwanshi",
    //   role: "Web Developer",
    //   img: "/team/member-6.jpg",
    //   githubUsername: "SumitSinghRaghuwanshi1245",
    //   xUsername: "Sumit_Singh_R",
    //   linkedinUsername: "sumit-singh-raghuwanshi",
    //   instagramUsername: "sumitt.singh_"
      
    // },
    

   
  ];

  return (
    <div className="px-4 py-1 mx-auto">
      <div className="mx-auto mb-10 lg:max-w-xl text-center">
        <p className="text-gray-500 text-lg text-center font-normal pb-3">
          Meet the team
        </p>
        <h1 className="mx-auto text-3xl text-center text-secondary  font-extrabold ">
          The Talented People Behind the Scenes of the Organization
        </h1>
      </div>
      <div className="grid gap-5 md:gap-10 mx-auto sm:grid-cols-2 md:grid-cols-3 bg-blue-gradient">
        {teamMembers.map((member, index) => {
          return (
            <div key={index} className="flex space-x-4 justify-stretch">
              <Image
                className="object-cover w-20 h-20 mb-2 rounded-full shadow"
                width={500}
                height={500}
                src={member.img}
                alt="Person"
              />
              <div className="flex flex-col items-start justify-center text-center capitalize">
                <p className="text-base font-bold tracking-tighter text-secondary">
                  {member.name}
                </p>
                <p className="text-sm text-[#808191] tracking-tighter">
                  {member.role}
                </p>
                <SocialLinks {...member} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Team;
