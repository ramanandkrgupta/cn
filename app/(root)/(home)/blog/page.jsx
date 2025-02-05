import { getSortedPostsData } from '@/libs/blogposts';
import BlogListClient from './BlogListClient';

export default async function BlogPage() {
  const allPostsData = await getSortedPostsData();
  
  return <BlogListClient allPostsData={allPostsData} />;
}