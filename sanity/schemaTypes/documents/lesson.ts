import { PlayIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { slugValidation } from '../shared/slug'

export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: PlayIcon,
  fieldsets: [
    {
      name: 'video',
      title: 'Video',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'details',
      title: 'Details',
      options: { collapsible: true },
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
      options: { source: 'title', maxLength: 120 },
      validation: slugValidation,
    }),
    defineField({
      name: 'videoUrl',
      type: 'url',
      title: 'Video URL',
      fieldset: 'video',
      description: 'YouTube, Vimeo, or Bunny embed URL.',
      validation: (rule) => rule.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'poster',
      type: 'image',
      title: 'Poster / thumbnail',
      fieldset: 'video',
      options: { hotspot: true },
    }),
    defineField({
      name: 'duration',
      type: 'number',
      title: 'Duration (seconds)',
      fieldset: 'details',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'freePreview',
      type: 'boolean',
      title: 'Free preview',
      fieldset: 'details',
      description: 'Label only, not access control.',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      type: 'number',
      title: 'Student count',
      fieldset: 'details',
      description: 'Display only.',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'notes',
      type: 'array',
      title: 'Notes',
      description: 'Rich text lesson notes.',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'keyPoints',
      type: 'array',
      title: 'Key points',
      description: 'In this lesson you will learn.',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.min(1).error('Add at least one key point'),
    }),
    defineField({
      name: 'proTip',
      type: 'text',
      title: 'Pro tip',
      rows: 3,
    }),
    defineField({
      name: 'resources',
      type: 'array',
      title: 'Resources',
      of: [defineArrayMember({ type: 'resource' })],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'poster',
      freePreview: 'freePreview',
    },
    prepare({ title, media, freePreview }) {
      return {
        title: title || 'Untitled lesson',
        subtitle: freePreview ? 'Free preview' : undefined,
        media,
      }
    },
  },
})