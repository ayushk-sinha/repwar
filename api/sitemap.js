import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
)

const SITE_URL = 'https://repwar.live'

const staticRoutes = [
  '/',
  '/blog',
  '/About-Us',
  '/Privacy-Policy',
  '/Contact-Us',
  '/terms-and-conditions',
  '/health-disclaimer',
  '/blogs-page',
]

export default async function handler(req, res) {
  try {
    // Fetch blogs table
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('slug, updated_at')

    // Fetch sideblogs table
    const { data: sideblogs, error: sideblogsError } = await supabase
      .from('sideblogs')
      .select('slug, updated_at')

    if (blogsError || sideblogsError) {
      console.error(blogsError || sideblogsError)

      return res.status(500).send('Supabase Error')
    }

    // Static pages
    const staticLinks = staticRoutes.map((route) => ({
      url: route,
      changefreq: 'weekly',
      priority: route === '/' ? 1.0 : 0.7,
      lastmod: new Date(),
    }))

    // Dynamic blog links
    const blogLinks = blogs
      .filter((blog) => blog.slug)
      .map((blog) => ({
        url: `/blog/${blog.slug}`,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: blog.updated_at || new Date(),
      }))

    // Dynamic sideblog links
    const sideBlogLinks = sideblogs
      .filter((blog) => blog.slug)
      .map((blog) => ({
        url: `/blog/${blog.slug}`,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: blog.updated_at || new Date(),
      }))

    const links = [...staticLinks, ...blogLinks, ...sideBlogLinks]

    const stream = new SitemapStream({
      hostname: SITE_URL,
    })

    const xml = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
      data.toString(),
    )

    res.setHeader('Content-Type', 'application/xml')

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')

    res.status(200).send(xml)
  } catch (err) {
    console.error(err)

    res.status(500).send('Internal Server Error')
  }
}
