import { defineQuery } from 'next-sanity'

import { categoryFragment, imageFragment, instructorFragment } from './fragments'

export const COURSE_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    "coverImage": coverImage { ${imageFragment} },
    level,
    price,
    popular,
    studentCount,
    "category": category->{ ${categoryFragment} },
    "instructor": instructor->{ ${instructorFragment} },
    learningOutcomes[] {
      _key,
      icon,
      title,
      description
    },
    modules[] {
      _key,
      title,
      summary,
      "lessons": lessons[]->{
        _id,
        title,
        "slug": slug.current,
        "poster": poster { ${imageFragment} },
        duration,
        freePreview,
        studentCount
      }
    }
  }
`)

export const COURSE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && defined(slug.current)] {
    "slug": slug.current
  }
`)