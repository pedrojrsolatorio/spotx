import { defineQuery } from 'next-sanity'

import { courseCardFragment, imageFragment } from './fragments'

export const INSTRUCTOR_QUERY = defineQuery(/* groq */ `
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    expertise,
    bio,
    "photo": photo { ${imageFragment} },
    "courses": *[_type == "course" && instructor._ref == ^._id]
      | order(popular desc, _createdAt desc) {
        ${courseCardFragment}
      }
  }
`)

export const INSTRUCTOR_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "instructor" && defined(slug.current)] {
    "slug": slug.current
  }
`)