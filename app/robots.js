import { getSiteUrl } from "@/libs/seohelper"

export default function robots() {
  const baseUrl = getSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/',
        '/admin/',
        '/account/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}