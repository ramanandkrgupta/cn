'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BlogListClient({ allPostsData }) {
  const [visiblePosts, setVisiblePosts] = useState(6);

  const loadMore = () => {
    setVisiblePosts(prev => prev + 3);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPostsData.slice(0, visiblePosts).map((post) => (
            
          <div key={post.id} className="border rounded-lg overflow-hidden shadow-lg">
            <Link
            href={`/blog/${post.id}`}
            
          >
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-secondary/70 mb-2">{post.date}</p>
              <p className="text-secondary/60 mb-4">{post.excerpt}</p>
              
                Read More →
              
            </div>
            </Link>
          </div>
          
        ))}
      </div>

      {visiblePosts < allPostsData.length && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}