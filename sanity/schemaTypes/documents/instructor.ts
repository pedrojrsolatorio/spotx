import { UserIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

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
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Describes the photo for screen readers.',
          validation: (rule) => rule.max(160),
        }),
      ],
    }),
    defineField({
      name: 'expertise',
      type: 'array',
      title: 'Expertise',
      description: 'Areas the instructor teaches.',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.min(1).error('Add at least one area of expertise'),
    }),
    defineField({
      name: 'bio',
      type: 'array',
      title: 'Bio',
      description: 'Rich text biography.',
      of: [defineArrayMember({ type: 'block' })],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      expertise: 'expertise',
      media: 'photo',
    },
    prepare({ title, expertise, media }) {
      return {
        title: title || 'Untitled instructor',
        subtitle: expertise?.[0],
        media,
      }
    },
  },
})