import { LinkIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const resource = defineType({
  name: 'resource',
  title: 'Resource',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'type',
      type: 'string',
      title: 'Type',
      options: {
        list: [
          { title: 'Link', value: 'link' },
          { title: 'Document', value: 'document' },
          { title: 'Video', value: 'video' },
          { title: 'Download', value: 'download' },
        ],
        layout: 'radio',
      },
      initialValue: 'link',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      rows: 2,
    }),
    defineField({
      name: 'url',
      type: 'url',
      title: 'URL',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
    },
    prepare({ title, type }) {
      return {
        title: title || 'Untitled resource',
        subtitle: type,
      }
    },
  },
})