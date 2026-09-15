import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Server only read token for the private dataset. Never prefixed with
// NEXT_PUBLIC_, so it never reaches the browser bundle.
const readToken = process.env.SANITY_API_READ_TOKEN

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Token-authenticated reads of a private dataset are not served via the CDN.
  useCdn: !readToken,
  ...(readToken ? { token: readToken } : {}),
})
