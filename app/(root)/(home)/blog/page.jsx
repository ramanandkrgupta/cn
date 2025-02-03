import Link from "next/link";

const blogs = [
  {
    id: 1,
    title: "How to Get AdSense Approval for Your Educational Blog",
    description: "A step-by-step guide on how to optimize your website for AdSense approval.",
    slug: "adsense-approval-guide"
  },
  {
    id: 2,
    title: "Top 10 Study Techniques for Engineering Students",
    description: "Learn the best study techniques to ace your engineering exams.",
    slug: "study-techniques-engineering"
  }
];

export default function Blog() {
  return (
    <section className="max-w-4xl mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-center mb-8">Latest Blog Posts</h2>
      <div className="space-y-6">
        {blogs.map((post) => (
          <div key={post.id} className="p-5 border rounded-lg bg-gray-50 shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-gray-600 mt-2">{post.description}</p>
            <Link href={`/blog/${post.slug}`} className="text-blue-500 mt-3 inline-block">
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
