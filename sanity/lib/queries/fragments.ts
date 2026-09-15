// Reusable GROQ fragments for consistent field selection.

export const imageFragment = /* groq */ `
  asset->{
    _id,
    url,
    metadata { lqip, dimensions }
  },
  alt
`

export const categoryFragment = /* groq */ `
  _id,
  title,
  "slug": slug.current
`

export const instructorFragment = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  expertise,
  "photo": photo { ${imageFragment} }
`

export const courseCardFragment = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  summary,
  level,
  price,
  popular,
  studentCount,
  "coverImage": coverImage { ${imageFragment} },
  "category": category->{ ${categoryFragment} },
  "instructor": instructor->{ ${instructorFragment} },
  "moduleCount": count(modules),
  "lessonCount": count(modules[].lessons[]._ref)
`