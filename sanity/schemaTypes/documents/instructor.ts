import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import { slugValidation } from '../shared/slug'

export const instructor = defineType({
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'name', maxLength: 96 },
      validation: slugValidation,
    }),
    defineField({
      name: 'photo',
      type: 'image',
      title: 'Photo',
      options: { hotspot: true },
    }),
    defineField({
      name: 'expertise',
      type: 'string',
      title: 'Expertise',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'bio',
      type: 'text',
      title: 'Bio',
      rows: 6,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'expertise',
      media: 'photo',
    },
  },
})