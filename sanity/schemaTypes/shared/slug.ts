import type { SlugRule } from 'sanity'

export const slugValidation = (rule: SlugRule) =>
  rule
    .required()
    .custom((slug) => {
      if (!slug?.current) return true
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.current)) {
        return 'Slug must be lowercase letters, digits, and hyphens'
      }
      return true
    })