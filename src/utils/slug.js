export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // handles multiple spaces
    .replace(/[^\w-]+/g, '') // remove special chars
}
