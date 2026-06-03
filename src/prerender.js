import { supabase } from './utils/supabase'

/* ------------------------------------------------ */
/* Static Routes (always prerendered)               */
/* ------------------------------------------------ */

const STATIC_ROUTES = [
  '/',
  '/blog',
  '/blogs-page',
  '/About-Us',
  '/Privacy-Policy',
  '/Contact-Us',
  '/terms-and-conditions',
  '/health-disclaimer',

  /* ------------------------------------------ */
  /* Hard-coded Blog Pages                        */
  /* ------------------------------------------ */
  '/50-pushups-a-day-benefits',
]

/* ------------------------------------------------ */
/* Dynamic Routes from Supabase                     */
/* ------------------------------------------------ */

export async function getDynamicRoutes() {
  /* ------------------------------------------ */
  /* Fetch Blogs                                  */
  /* ------------------------------------------ */

  const { data: blogs, error: blogsError } = await supabase.from('blogs').select('slug')

  /* ------------------------------------------ */
  /* Fetch Side Blogs                             */
  /* ------------------------------------------ */

  const { data: sideBlogs, error: sideBlogsError } = await supabase.from('sideblogs').select('slug')

  /* ------------------------------------------ */
  /* Error Handling                               */
  /* ------------------------------------------ */

  if (blogsError) {
    console.error('Blogs Fetch Error:', blogsError)
  }

  if (sideBlogsError) {
    console.error('SideBlogs Fetch Error:', sideBlogsError)
  }

  /* ------------------------------------------ */
  /* Main Blog Routes                             */
  /* ------------------------------------------ */

  const blogRoutes = (blogs || []).filter((blog) => blog.slug).map((blog) => `/blog/${blog.slug}`)

  /* ------------------------------------------ */
  /* Side Blog Routes                             */
  /* ------------------------------------------ */

  const sideBlogRoutes = (sideBlogs || [])
    .filter((blog) => blog.slug)
    .map((blog) => `/blogs-page/${blog.slug}`)

  /* ------------------------------------------ */
  /* Merge Static + Dynamic (deduplicated)        */
  /* ------------------------------------------ */

  const allRoutes = [...new Set([...STATIC_ROUTES, ...blogRoutes, ...sideBlogRoutes])]

  return allRoutes
}
