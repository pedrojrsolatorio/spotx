import { defineQuery } from 'next-sanity'

import { courseCardFragment } from './fragments'

export const CATALOG_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && defined(slug.current)] | order(_createdAt desc) {
    ${courseCardFragment}
  }
`)

export const FEATURED_COURSES_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && defined(slug.current)]
    | order(popular desc, _createdAt desc) [0...6] {
      ${courseCardFragment}
    }
`)