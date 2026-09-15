import { VideoIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  icon: VideoIcon,
  description: 'Internal lookup for a single video: table of contents and timestamped transcript. Never shown to learners as a result.',
  fields: [
    defineField({
      name: 'id',
      type: 'string',
      title: 'ID',
      description: 'Datastore-safe id derived from the video URL.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      type: 'url',
      title: 'Video URL',
      description: 'Must match the lesson.videoUrl that uses this video.',
      validation: (rule) => rule.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'chapters',
      type: 'array',
      title: 'Table of contents',
      description: 'Chapter markers from the source, used for moment matching first.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chapter',
          fields: [
            defineField({
              name: 'startSeconds',
              type: 'number',
              title: 'Start (seconds)',
              validation: (rule) => rule.required().min(0).integer(),
            }),
            defineField({
              name: 'label',
              type: 'string',
              title: 'Label',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'chunks',
      type: 'array',
      title: 'Transcript chunks',
      description: 'Transcript split into short timestamped pieces. The whole transcript is never returned as one field.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chunk',
          fields: [
            defineField({
              name: 'startSeconds',
              type: 'number',
              title: 'Start (seconds)',
              validation: (rule) => rule.required().min(0).integer(),
            }),
            defineField({
              name: 'text',
              type: 'text',
              title: 'Text',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'id',
      subtitle: 'url',
    },
    prepare({ title, subtitle }) {
      return { title: title || 'Video', subtitle }
    },
  },
})