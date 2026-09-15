// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from './client'

// The read token stays on the server: it is passed only as serverToken, never
// as browserToken, so the browser never sees it.
const readToken = process.env.SANITY_API_READ_TOKEN

export const { sanityFetch, SanityLive } = defineLive({
  client,
  ...(readToken ? { serverToken: readToken } : {}),
});
