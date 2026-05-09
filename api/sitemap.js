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
    /* ------------------------------------------ */
    /* Fetch Blogs */
    /* ------------------------------------------ */

    const { data: blogs, error } = await supabase.from('blogs').select('slug, updated_at')

    if (error) {
      console.error(error)

      return res.status(500).send('Supabase Error')
    }

    /* ------------------------------------------ */
    /* Static Routes */
    /* ------------------------------------------ */

    const staticLinks = staticRoutes.map((route) => ({
      url: route,
      changefreq: 'weekly',
      priority: route === '/' ? 1.0 : 0.7,
      lastmod: new Date(),
    }))

    /* ------------------------------------------ */
    /* Dynamic Blog Routes */
    /* ------------------------------------------ */

    const dynamicLinks = blogs
      .filter((blog) => blog.slug)
      .map((blog) => ({
        url: `/blog/${blog.slug}`,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: blog.updated_at || new Date(),
      }))

    const links = [...staticLinks, ...dynamicLinks]

    /* ------------------------------------------ */
    /* Create Sitemap */
    /* ------------------------------------------ */

    const stream = new SitemapStream({
      hostname: SITE_URL,
    })

    const xml = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
      data.toString(),
    )

    /* ------------------------------------------ */
    /* Headers */
    /* ------------------------------------------ */

    res.setHeader('Content-Type', 'application/xml')

    /* SEO Cache */
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')

    res.status(200).send(xml)
  } catch (err) {
    console.error(err)

    res.status(500).send('Internal Server Error')
  }
}
