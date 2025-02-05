import { getPostData, getSortedPostsData } from "@/libs/blogposts";
import BlogContent from "./client";
export async function generateStaticParams() {
  const posts = await getSortedPostsData();
  return posts.map((post) => ({ slug: post.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  return {
    title: postData.title,
    description: postData.excerpt,
    openGraph: {
      images: [postData.coverImage],
    },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  return <BlogContent postData={postData} />;
}
