// app/view-doc/layout.js
"use client";
import { useSearchParams } from "next/navigation";


export default function ViewDocLayout({ children }) {
  const searchParams = useSearchParams();
  const course = searchParams.get("name");
  const semester = searchParams.get("sem");
  const category = searchParams.get("category");
  const subId = searchParams.get("subId");

  const title = `${course} - ${category} - Semester ${semester}`;
  const description = `View and download ${category} materials for ${course}, Semester ${semester}, Subject ID: ${subId}.`;

  return (
    <>
      
        <title>{title}</title>
        <meta name="description" content={description} />
        {/* Other SEO-related tags */}
      

      {/* Your page content */}
      {children}
    </>
  );
}