import DOMPurify from 'isomorphic-dompurify';

export function sanitize(html) {
  return DOMPurify.sanitize(html);
}