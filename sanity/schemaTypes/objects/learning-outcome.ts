import { BulbOutlineIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

const iconOptions = [
  { title: 'Zap', value: 'zap' },
  { title: 'Rocket', value: 'rocket' },
  { title: 'Code', value: 'code' },
  { title: 'Book', value: 'book' },
  { title: 'Target', value: 'target' },
  { title: 'Layers', value: 'layers' },
  { title: 'Trophy', value: 'trophy' },
  { title: 'Shield', value: 'shield' },
  { title: 'Puzzle', value: 'puzzle' },
  { title: 'Star', value: 'star' },
]

export const learningOutcome = defineType({
  name: 'learningOutcome',
  title: 'Learning outcome',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'icon',
      type: 'string',
      title: 'Icon',
      description: 'Icon name rendered by the frontend.',
      options: { list: iconOptions, layout: 'dropdown' },
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
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
    },
    prepare({ title, description }) {
      return {
        title: title || 'Untitled outcome',
        subtitle: description,
      }
    },
  },
})