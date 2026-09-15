import 'server-only'

import {
  CATEGORIES_QUERY,
} from './queries/category'
import { CATALOG_QUERY, FEATURED_COURSES_QUERY } from './queries/catalog'
import { COURSE_QUERY, COURSE_SLUGS_QUERY } from './queries/course'
import type { CATALOG_QUERY_RESULT, FEATURED_COURSES_QUERY_RESULT, COURSE_QUERY_RESULT } from '@/sanity.types'
import {
  INSTRUCTOR_QUERY,
  INSTRUCTOR_SLUGS_QUERY,
} from './queries/instructor'
import { LESSON_QUERY, LESSON_SLUGS_QUERY } from './queries/lesson'
import { sanityFetch } from './live'

export async function getCatalog(): Promise<CATALOG_QUERY_RESULT> {
  const { data } = await sanityFetch({ query: CATALOG_QUERY })
  return data as CATALOG_QUERY_RESULT
}

export async function getFeaturedCourses(): Promise<FEATURED_COURSES_QUERY_RESULT> {
  const { data } = await sanityFetch({ query: FEATURED_COURSES_QUERY })
  return data as FEATURED_COURSES_QUERY_RESULT
}

export async function getCourseBySlug(slug: string): Promise<COURSE_QUERY_RESULT> {
  const { data } = await sanityFetch({ query: COURSE_QUERY, params: { slug } })
  return data as COURSE_QUERY_RESULT
}

export async function getCourseSlugs() {
  const { data } = await sanityFetch({
    query: COURSE_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  })
  return data
}

export async function getLessonBySlug(slug: string) {
  const { data } = await sanityFetch({ query: LESSON_QUERY, params: { slug } })
  return data
}

export async function getLessonSlugs() {
  const { data } = await sanityFetch({
    query: LESSON_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  })
  return data
}

export async function getInstructorBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: INSTRUCTOR_QUERY,
    params: { slug },
  })
  return data
}

export async function getInstructorSlugs() {
  const { data } = await sanityFetch({
    query: INSTRUCTOR_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  })
  return data
}

export async function getCategories() {
  const { data } = await sanityFetch({ query: CATEGORIES_QUERY })
  return data
}