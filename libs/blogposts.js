import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';



import { sanitize } from './sanitize';
import readingTime from 'reading-time';
import { format } from 'date-fns';


import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolink from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import rehypeDocument from 'rehype-document';
import rehypeFormat from 'rehype-format';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import { transformerCopyButton } from '@rehype-pretty/transformers';


const postsDirectory = path.join(process.cwd(), 'posts');

export async function getSortedPostsData() {
  const fileNames = (fs.readdirSync(postsDirectory, { withFileTypes: true }))
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name);


  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      const formattedDate = format(new Date(matterResult.data.date), 'MMMM dd, yyyy');

      return {
        id: matterResult.data.slug || id, // Use explicit slug

        
        ...matterResult.data,
        formattedDate,
      };
    })
  );

  return allPostsData.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getPostData(id) {
  const decodedId = decodeURIComponent(id);
  const fullPath = `posts/${decodedId}.md`;
  // const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8")
  // const fileContents = await fs.readFile(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  

  
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolink, {
      behavior: 'prepend',
      properties: { className: ['anchor-link'], ariaHidden: true }
    })
   
    .use(rehypeStringify)

   
    
    .use(rehypeDocument, {title: '👋🌍'})
    .use(rehypeFormat)
    .use(rehypeStringify) 
   
    .use(rehypeAutolinkHeadings)
    .use(rehypePrettyCode, {
        theme: "github-dark",
        transformers: [
            transformerCopyButton({
              visibility: 'always',
              feedbackDuration: 3_000,
            }),
          ],

      })
    .process(matterResult.content)

  const contentHtml = sanitize(processedContent.toString());
  const readTime = readingTime(matterResult.content);
  const postDate = new Date(matterResult.data.date);

  return {
    id,
    formattedDate: format(postDate, 'MMMM dd, yyyy'),
    contentHtml,
    readTime,
    ...matterResult.data
  };
}