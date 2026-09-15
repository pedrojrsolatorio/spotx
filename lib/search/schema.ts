import { z } from "zod";

export const lessonResultSchema = z.object({
  type: z.literal("lesson"),
  courseTitle: z.string(),
  courseSlug: z.string().min(1),
  moduleTitle: z.string().describe('The module title, e.g. "Data Fetching and Caching"'),
  moduleLabel: z.string().describe('e.g. "Module 5"'),
  lessonLabel: z.string().describe('e.g. "Lesson 5.1"'),
  lessonTitle: z.string(),
  lessonSlug: z.string().min(1),
  thumbnailUrl: z.string().url().optional(),
  keyPoints: z.array(z.string()),
  description: z.string(),
});

export const videoResultSchema = z.object({
  type: z.literal("video"),
  courseTitle: z.string(),
  courseSlug: z.string().min(1),
  moduleTitle: z.string().describe('The module title, e.g. "Data Fetching and Caching"'),
  moduleLabel: z.string().describe('e.g. "Module 5"'),
  lessonLabel: z.string().describe('e.g. "Lesson 5.1"'),
  lessonTitle: z.string(),
  lessonSlug: z.string().min(1),
  thumbnailUrl: z.string().url().optional(),
  clipLength: z.string().describe('Human readable, e.g. "2 min"'),
  description: z.string(),
  chapter: z.string().optional().describe("The matched chapter label, when a chapter matched"),
  seconds: z
    .number()
    .int()
    .nonnegative()
    .describe("Exact startSeconds from a real chapter or chunk"),
});

export const searchResultSchema = z.discriminatedUnion("type", [
  lessonResultSchema,
  videoResultSchema,
]);

export const searchResponseSchema = z.object({
  query: z.string(),
  count: z.number().int().nonnegative(),
  courseCount: z.number().int().nonnegative(),
  results: z.array(searchResultSchema).max(40),
});

export type LessonResult = z.infer<typeof lessonResultSchema>;
export type VideoResult = z.infer<typeof videoResultSchema>;
export type SearchResult = z.infer<typeof searchResultSchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;