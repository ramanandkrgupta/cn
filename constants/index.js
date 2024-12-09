import { Home, Upload, Info, MessageCircle, Sun, Moon, Menu, X, LogOut, LogIn,Search ,Brain } from "lucide-react";
import { about, addUser, dashboard, upload , whatsapp, wa, click } from "@/public/assets";
import {
  Psychology,
  bba,

  bsw,
  ca,
  coop,
  economics,
  english,
  finance,
  five,
  four,
  history,
  maEnglish,
  maths,
  mcomfinance,
  msw,
  one,
  play,
  polictics,
  qp,
  six,
  study,
  syllabus,
  three,
  two,

} from "@/public/icons";

import seven from "@/public/icons/seven.PNG";
import eight from "@/public/icons/eight.PNG";
import { aiml, bca, btech, ce, ec, ex, me } from "@/public/course/icons";
import { LayoutGrid } from "lucide-react";



export const navlinks = [
  {
    name: "Home",
    icon: Home,
    link: "/",
  },
  {
    name: "Upload",
    icon: Upload,
    link: "/upload",
  },
  {
    name: "About Us",
    icon: Info,
    link: "/about",
  },
  {
    name: "Join Us",
    icon: MessageCircle,
    link: "https://chat.whatsapp.com/JotgzAmp62YLOwQScP29iD"
  },
  {
    name: "Search",
    icon: Search,
    link: "/search"
  },
  {
    name: "Quiz",
    icon: Brain,
    link: "/quiz"
  },

];

//category-items
export const category = [
  {
    id: 1,
    name: "Study Materials",
    imgUrl: study,
    link: "notes",
    description: "Study Materials",
  },
  {
    id: 2,
    name: "Syllabus",
    imgUrl: syllabus,
    link: "syllabus",
    description: "Syllabus",
  },
  {
    id: 3,
    name: "Question Papers",
    imgUrl: qp,
    link: "pyq",
    description: "Previous Year Question Papers",
  },
  {
    id: 4,
    name: "Videos",
    imgUrl: play,
    link: "videos",
    description: "videos lesson",
  },
];

//courses-items
export const courses = [
  {
    id: 1,
    name: "Computer Science & Engineering (CSE)",
    imgUrl: btech,
    link: "cse",
    description:
      "Computer Science & Engineering (CSE) is an academic program that provides in-depth knowledge of computer science and its applications.",
  },
  {
    id: 2,
    name: "Computer Science & Information Technology (CS & IT)",
    imgUrl: bca,
    link: "csit",
    description:
      "Computer Science & Information Technology (CS & IT) is an academic program that provides in-depth knowledge of computer science and its applications.",
  },
  {
    id: 3,
    name: "Artificial Intelligence & Machine Learning (AIML)",
    imgUrl: aiml,
    link: "aiml",
    description:
      "Artificial Intelligence & Machine Learning (AIML) is an academic program that provides in-depth knowledge of artificial intelligence and machine learning.",
  },
  {
    id: 4,
    name: "Electronics & Communication (EC)",
    imgUrl: ec,
    link: "ec",
    description:
      "Electronics & Communication (EC) is an academic program that provides in-depth knowledge of electronics and communication.",
  },
  {
    id: 5,
    name: "Electrical & Electronics (EX)",
    imgUrl: ex,
    link: "ex",
    description:
      "Electrical & Electronics (EX) is an academic program that provides in-depth knowledge of electrical and electronics.",
  },
  {
    id: 6,
    name: "Civil Engineering (CE)",
    imgUrl: ce,
    link: "ce",
    description:
      "Civil Engineering (CE) is an academic program that provides in-depth knowledge of civil engineering.",
  },
  {
    id: 7,
    name: "Mechanical Engineering (ME)",
    imgUrl: me,
    link: "me",
    description:
      "Mechanical Engineering (ME) is an academic program that provides in-depth knowledge of mechanical engineering.",
  },

];

export const semester = [
  {
    id: 1,
    name: "First",
    link: "one",
    imgUrl: one,
  },
  {
    id: 2,
    name: "Second",
    link: "two",
    imgUrl: two,
  },
  {
    id: 3,
    name: "Third",
    link: "three",
    imgUrl: three,
  },
  {
    id: 4,
    name: "Fourth",
    link: "four",
    imgUrl: four,
  },
  {
    id: 5,
    name: "Fifth",
    link: "five",
    imgUrl: five,
  },
  {
    id: 6,
    name: "Sixth",
    link: "six",
    imgUrl: six,
  },
  {
    id: 7,
    name: "Seventh",
    link: "seven",
    imgUrl: seven,
  },
  {
    id: 8,
    name: "Eighth",
    link: "eight",
    imgUrl: eight,
  },
];
