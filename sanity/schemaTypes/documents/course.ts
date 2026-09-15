import { BookIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { slugValidation } from '../shared/slug'

export const course = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  icon: BookIcon,
  fieldsets: [
    {
      name: 'marketing',
      title: 'Marketing',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'structure',
      title: 'Course structure',
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title', maxLength: 96 },
      validation: slugValidation,
    }),
    defineField({
      name: 'summary',
      type: 'text',
      title: 'Summary',
      rows: 3,
      fieldset: 'marketing',
      validation: (rule) =>
        rule.max(400).warning('Keep summaries under 400 characters'),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      title: 'Cover image',
      fieldset: 'marketing',
      options: { hotspot: true },
    }),
    defineField({
      name: 'level',
      type: 'string',
      title: 'Level',
      fieldset: 'marketing',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
        layout: 'radio',
      },
      initialValue: 'beginner',
    }),
    defineField({
      name: 'price',
      type: 'number',
      title: 'Price (USD)',
      fieldset: 'marketing',
      validation: (rule) => rule.min(0).precision(2),
    }),
    defineField({
      name: 'popular',
      type: 'boolean',
      title: 'Popular',
      fieldset: 'marketing',
      description: 'Featured on the catalog.',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      type: 'number',
      title: 'Student count',
      fieldset: 'marketing',
      description: 'Display only.',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'instructor',
      type: 'reference',
      title: 'Instructor',
      to: [{ type: 'instructor' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      title: 'Category',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'learningOutcomes',
      type: 'array',
      title: "What you'll learn",
      description: 'Short list of learning outcomes for the what you will learn section.',
      fieldset: 'marketing',
      of: [defineArrayMember({ type: 'learningOutcome' })],
      validation: (rule) =>
        rule.max(8).warning('Keep the outcome list short'),
    }),
    defineField({
      name: 'modules',
      type: 'array',
      title: 'Modules',
      fieldset: 'structure',
      of: [defineArrayMember({ type: 'module' })],
      validation: (rule) =>
        rule.min(1).error('A course needs at least one module'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      instructor: 'instructor.name',
      media: 'coverImage',
      modules: 'modules',
    },
    prepare({ title, instructor, media, modules }) {
      return {
        title: title || 'Untitled course',
        subtitle: [
          instructor,
          modules ? `${modules.length} module${modules.length === 1 ? '' : 's'}` : undefined,
        ]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})