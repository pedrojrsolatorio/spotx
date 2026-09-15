import { BookIcon, PlayIcon, TagIcon, UserIcon } from '@sanity/icons'
import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('SpotX content')
    .items([
      S.listItem()
        .title('Courses')
        .icon(BookIcon)
        .child(S.documentTypeList('course').title('Courses')),
      S.listItem()
        .title('Lessons')
        .icon(PlayIcon)
        .child(S.documentTypeList('lesson').title('Lessons')),
      S.divider(),
      S.listItem()
        .title('Taxonomy')
        .icon(TagIcon)
        .child(
          S.list()
            .title('Taxonomy')
            .items([
              S.listItem()
                .title('Instructors')
                .icon(UserIcon)
                .child(S.documentTypeList('instructor').title('Instructors')),
              S.listItem()
                .title('Categories')
                .icon(TagIcon)
                .child(S.documentTypeList('category').title('Categories')),
            ]),
        ),
    ])