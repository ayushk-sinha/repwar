import { supabase } from './utils/supabase'

export async function getDynamicRoutes() {
  /* ------------------------------------------ */
  /* Fetch Blogs */
  /* ------------------------------------------ */

  const { data: blogs, error: blogsError } = await supabase.from('blogs').select('slug')

  /* ------------------------------------------ */
  /* Fetch Side Blogs */
  /* ------------------------------------------ */

  const { data: sideBlogs, error: sideBlogsError } = await supabase.from('sideblogs').select('slug')

  /* ------------------------------------------ */
  /* Error Handling */
  /* ------------------------------------------ */

  if (blogsError) {
    console.error('Blogs Fetch Error:', blogsError)
  }

  if (sideBlogsError) {
    console.error('SideBlogs Fetch Error:', sideBlogsError)
  }

  /* ------------------------------------------ */
  /* Main Blog Routes */
  /* ------------------------------------------ */

  const blogRoutes = (blogs || []).filter((blog) => blog.slug).map((blog) => `/blog/${blog.slug}`)

  /* ------------------------------------------ */
  /* Side Blog Routes */
  /* ------------------------------------------ */

  const sideBlogRoutes = (sideBlogs || [])
    .filter((blog) => blog.slug)
    .map((blog) => `/blogs-page/${blog.slug}`)

  /* ------------------------------------------ */
  /* Merge All Routes */
  /* ------------------------------------------ */

  return [...blogRoutes, ...sideBlogRoutes]
}
