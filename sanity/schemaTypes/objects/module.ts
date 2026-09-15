import { defineArrayMember, defineField, defineType } from 'sanity'

export const courseModule = defineType({
  name: 'module',
  title: 'Module',
  type: 'object',
  // Module and lesson numbers in the UI are derived from array order, never stored.
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Module title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      title: 'Summary',
      rows: 3,
      validation: (rule) =>
        rule.max(300).warning('Keep summaries under 300 characters'),
    }),
    defineField({
      name: 'lessons',
      type: 'array',
      title: 'Lessons',
      description: 'Lessons in this module, in the order they are taught.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'lesson' }],
        }),
      ],
      validation: (rule) =>
        rule.min(1).error('Each module needs at least one lesson'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      lessons: 'lessons',
    },
    prepare({ title, lessons }) {
      return {
        title: title || 'Untitled module',
        subtitle: `${lessons?.length ?? 0} ${lessons?.length === 1 ? 'lesson' : 'lessons'}`,
      }
    },
  },
})