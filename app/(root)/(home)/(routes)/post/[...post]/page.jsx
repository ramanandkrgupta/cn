"use client";
import { useState } from "react";
import Feed from "@/components/Feed";
import { filterUrl } from "@/libs/hooks/usefilter";
import { usePostStore } from "@/libs/state/useStore";
import PostViewDialogBox from "@/components/models/PostViewDialogBox";
import Head from "next/head"; // Import the Head component for adding SEO

const MyPost = ({ params }) => {
  const [isPostOpen, setIsPostOpen] = useState(true);
  const fetchedData = usePostStore((state) => state.posts);

  const post = filterUrl(params, fetchedData);
  const [data] = post.map((items) => items);

  // SEO variables for dynamic title and description
  const title = data ? `${data.title} - Engineering Study Resources | Notes Mates` : 'Discover B.Tech Courses & Study Materials | Notes Mates';
  const description = data
    ? `${data.description.slice(0, 160)}... Explore important B.Tech study resources, PYQ solutions, and exam tips.`
    : 'Explore a wide range of B.Tech courses, PYQs, important questions, and study resources for engineering students. Improve your exam performance with Notes Mates.';

  return (
    <>
      {/* Dynamic SEO Meta Tags */}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content="b.tech, rgpv, engineering, study, exam, important questions, pyq solution, notesmates, student, learn, education, pyqs, engineering exams, study resources"
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://notesmates.in/posts/${params}`} />
        <meta property="og:image" content={data ? data.image : 'https://notesmates.in/default-image.jpg'} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={data ? data.image : 'https://notesmates.in/default-image.jpg'} />
      </Head>

      <div className="md:flex">
        <div>
          <Feed
            label="Discover Courses"
            styleHead="mt-3"
            style="md:grid-cols-5  mt-4 gap-1.5 justify-between md:justify-start"
          />
        </div>
        {isPostOpen && data && (
          <PostViewDialogBox
            isOpen={isPostOpen}
            setIsOpen={setIsPostOpen}
            data={data}
          />
        )}
      </div>
    </>
  );
};

export default MyPost;
