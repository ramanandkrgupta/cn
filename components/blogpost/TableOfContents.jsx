'use client';

import { useEffect, useState } from 'react';

export default function TableOfContents({ html }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const extractedHeadings = Array.from(doc.querySelectorAll('h2, h3')).map((element) => ({
        id: element.id,
        text: element.textContent,
        depth: parseInt(element.tagName.substring(1))
      }));
      setHeadings(extractedHeadings);

      // Add intersection observer for active state
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: '0px 0px -50% 0px' }
      );

      doc.querySelectorAll('h2, h3').forEach(element => observer.observe(element));
      return () => observer.disconnect();
    }
  }, [html]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="on-this-page fixed top-15 right-10 hidden lg:block w-64 z-50">
      <div className="  p-4 shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-md font-bold my-2">
          Table of Contents
        </h3>
        <ul className="space-y-2">
          {headings.map((heading, index) => (
            <li 
              key={index}
              className={`relative ${
                heading.depth === 3 ? 'ml-4' : 'ml-2'
              } ${
                activeId === heading.id 
                  ? 'text-blue-600 dark:text-blue-400 font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <a 
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={`text-sm block transition-colors duration-200 ${
                  activeId === heading.id ? 'pl-2' : 'pl-0'
                }`}
              >
                {activeId === heading.id && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}