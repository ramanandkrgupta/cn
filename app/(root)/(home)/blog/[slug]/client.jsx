'use client';

import Link from 'next/link';
import Image from 'next/image';
// import TableOfContents from '@/components/blogpost/TableOfContents';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const TableOfContents = dynamic(
  () => import('@/components/blogpost/TableOfContents'),
  {
    ssr: false,
    loading: () => <div className="text-sm text-gray-500">Loading table of contents...</div>
  }
);

export default function BlogContent({ postData }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <article className="prose dark:prose-invert max-w-none grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
        <div className="prose lg:prose-xl max-w-none">
          {/* Meta Section */}
          <div className="mb-12 text-center border-b pb-8">
            <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
            <div className="flex items-center justify-center space-x-4 text-gray-600">
              <span>{postData.formattedDate}</span>
              <span>•</span>
              <span>{postData.readTime.text}</span>
              
            </div>
            {postData.tags && (
                <>
                  <span>•</span>
                  <div className="flex space-x-2">
                    {postData.tags.map((tag) => (
                      <span 
                        key={tag}
                        className=" bg-primary/10  py-1 px-1.5 rounded-sm text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
          </div>

          {/* Featured Image */}
          {postData.coverImage && (
    <div className="relative w-full aspect-[16/9] mb-8">
      <img
        src={postData.coverImage}
        alt={postData.title}
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
      />
    </div>
  )}

          {/* Content */}
          <div dangerouslySetInnerHTML={{ 
    __html: postData.contentHtml.replace(
      /<img(.*?)>/g,
      (match, attributes) => `
        <div class="relative w-full aspect-video my-8">
          <img
            ${attributes}
            class="w-full h-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      `
    )
  }} />

          
        </div>


       <Suspense fallback={<div>Loading...</div>}>
          <TableOfContents html={postData.contentHtml} />
        </Suspense>
      </article>

      {/* Back Button */}
      <div className="mt-12 text-center">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Blog
        </Link>
      </div>
    </div>
  );
}