"use client"
import { useParams } from "next/navigation";

const blogPosts = {
  "adsense-approval-guide": {
    title: "How to Get AdSense Approval for Your Educational Blog",
    content: "Detailed guide on improving content quality, SEO, and increasing engagement."
  },
  "study-techniques-engineering": {
    title: "Top 10 Study Techniques for Engineering Students",
    content: "Effective strategies for better study habits, focus, and retention."
  }
};

export default function BlogPost() {
  const params = useParams();
  const { slug } = params || {};
  const post = blogPosts[slug];

  if (!post) return <p>Loading...</p>;

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="mt-4 text-gray-700">{post.content}</p>
    </section>
  );
}
