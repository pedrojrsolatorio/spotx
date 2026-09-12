# Implementation Prompt: SpotX Design System

## Goal
Implement the complete SpotX design system based on the design reference at `design/designsystem.png`. This establishes the visual foundation for the entire learning platform.

## Current State
- Fresh Next.js 16.3.3 scaffold with React 19.2.8
- Tailwind CSS v4 (configured via CSS, no tailwind.config.*)
- Default Geist fonts (need to replace with Poppins + Inter)
- No custom components, no utility functions
- Package.json has minimal dependencies

## What to Build

### 1. Install Required Packages
```bash
npm install clsx tailwind-merge class-variance-authority lucide-react
```

### 2. Create Utility Function
**File: `lib/utils.ts`**
- Export `cn()` function using clsx + tailwind-merge
- Pattern from reference: `import {type ClassValue, clsx} from 'clsx'` + `import {twMerge} from 'tailwind-merge'`

### 3. Update Google Fonts in layout.tsx
**File: `app/layout.tsx`**
- Replace Geist fonts with Poppins and Inter
- Poppins: weights 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- Inter: weights 400 (Regular), 500 (Medium)
- Set CSS variables: `--font-poppins` and `--font-inter`
- Update metadata title to "SpotX" and description

### 4. Configure Tailwind v4 Theme
**File: `app/globals.css`**
- Use `@theme inline` directive for all design tokens

#### Colors (from design system):
```
Primary 500: #172A39 (dark navy/charcoal)
Primary 500 (accent): #FC563C (orange)
Primary 200: #E9E4E0
Primary 300: #6E7575
Primary 100: #F8F8F7
Neutral 900: #0F1F2A
Neutral 700: #4B5563
Neutral 500: #6E7575
Neutral 300: #B7B7B7
Neutral 200: #E5E7EB
Neutral 100: #F2F4F6
White: #FFFFFF
```

#### Typography Scale:
```
Display 1: Poppins, 48px/56px, Bold (700)
Display 2: Poppins, 36px/44px, Semibold (600)
Heading 1: Poppins, 28px/36px, Semibold (600)
Heading 2: Poppins, 22px/30px, Semibold (600)
Heading 3: Poppins, 18px/26px, Medium (500)
Body Large: Inter, 16px/24px, Regular (400)
Body: Inter, 14px/20px, Regular (400)
Small: Inter, 12px/16px, Regular (400)
```

#### Spacing (base unit 4px):
```
spacing-4: 4px (0.25rem)
spacing-8: 8px (0.5rem)
spacing-12: 12px (0.75rem)
spacing-16: 16px (1rem)
spacing-24: 24px (1.5rem)
spacing-32: 32px (2rem)
spacing-40: 40px (2.5rem)
spacing-48: 48px (3rem)
spacing-64: 64px (4rem)
```

#### Border Radius:
```
radius-xs: 4px
radius-sm: 8px
radius-md: 12px
radius-lg: 16px
radius-xl: 24px
radius-full: 9999px (circle)
```

#### Shadows:
```
shadow-sm: 0 1px 2px 0 rgba(15, 23, 42, 0.05)
shadow-md: 0 4px 12px -2px rgba(15, 23, 42, 0.08)
shadow-lg: 0 12px 24px -4px rgba(15, 23, 42, 0.12)
shadow-xl: 0 20px 40px -8px rgba(15, 23, 42, 0.12)
```

### 5. Create UI Components

#### Button Component
**File: `components/ui/button.tsx`**
- Use class-variance-authority for variants
- Variants: `primary`, `secondary`, `tertiary`, `text`
- States: `default`, `hover`, `disabled`
- Specs: Height 44px, radius 12px, Inter Medium 14-16px
- Padding: 16px (lg), 12px (md)
- Primary: Orange background (#FC563C), white text
- Secondary: White background, orange border, orange text
- Tertiary: White background, gray border, dark text
- Text: No background/border, orange text

#### Input Component
**File: `components/ui/input.tsx`**
- Search/Text Input with search icon
- Select dropdown
- Height: 44px, radius: 12px
- Border: 1px solid #E5E7EB
- Padding: 0 16px
- Focus: Border color #FC563C

#### Badge Component
**File: `components/ui/badge.tsx`**
- Variants: `video`, `lesson`, `popular`
- Video: Orange text (#FC563C), light orange bg
- Lesson: Gray text (#6E7575), light gray bg
- Popular: White text, orange bg (#FC563C)

#### Status Indicator Component
**File: `components/ui/status-indicator.tsx`**
- Variants: `in-progress`, `completed`, `now-playing`, `locked`
- In Progress: Orange icon + text
- Completed: Green icon + text
- Now Playing: Orange icon + text
- Locked: Gray icon + text

#### Progress Bar Component
**File: `components/ui/progress-bar.tsx`**
- Orange fill (#FC563C)
- Gray background (#E5E7EB)
- Height: 8px, radius: full
- Shows percentage text

#### Card Components
**File: `components/ui/card.tsx`**
- Base card with white bg, border, radius-md, shadow-sm
- Course Card: Title, description, level, duration, modules count
- Video Card: "VIDEO" badge, title, description, lesson position, timestamp
- Lesson Card: "LESSON" badge, title, description, module number, external link
- Study Card: Icon, title, description, file type, size, download icon

#### Navigation Component
**File: `components/navigation.tsx`**
- SpotX logo (graduation cap icon + text)
- Nav links: Courses, My Learning
- Search bar with magnifying glass
- Breadcrumbs: All Courses > Next.js for Beginners > Data Fetching & Caching

#### Pagination Component
**File: `components/ui/pagination.tsx`**
- Previous/Next arrows
- Numbered pages (1, 2, 3, ... 8)
- Active page: Orange background, white text
- Inactive: White background, gray border

### 6. Create Demo Page
**File: `app/page.tsx`**
- Replace default Next.js page with design system showcase
- Display all components with their variants
- Use proper typography scale
- Show color palette
- Demonstrate spacing system

## Design Principles to Follow
1. **Clarity First**: Every element communicates clearly
2. **Consistency**: Use components and patterns consistently
3. **Focus & Calm**: Remove noise, help learners focus
4. **Accessible**: Design with accessibility in mind

## Files to Create/Modify
1. `lib/utils.ts` - Utility function
2. `app/layout.tsx` - Update fonts and metadata
3. `app/globals.css` - Complete Tailwind v4 theme
4. `components/ui/button.tsx` - Button component
5. `components/ui/input.tsx` - Input components
6. `components/ui/badge.tsx` - Badge/tag component
7. `components/ui/status-indicator.tsx` - Status indicators
8. `components/ui/progress-bar.tsx` - Progress bar
9. `components/ui/card.tsx` - Card variants
10. `components/navigation.tsx` - Navigation bar
11. `components/ui/pagination.tsx` - Pagination
12. `app/page.tsx` - Demo page

## Security Considerations
- No secrets or API keys in this implementation
- All components are pure UI with no data fetching
- No external services required

## Acceptance Criteria
1. All colors match the design system exactly
2. Typography uses Poppins for headings, Inter for body
3. Spacing follows the 4px base unit
4. All button variants render correctly
5. Input fields have proper focus states
6. Badges display with correct colors
7. Status indicators show appropriate icons/colors
8. Progress bar renders with orange fill
9. Cards display all four variants
10. Navigation includes logo, links, search, breadcrumbs
11. Pagination works with active state
12. Demo page showcases all components
13. No TypeScript errors
14. No lint errors

## Checks to Run
```bash
# From project root
npm run typecheck
npm run lint
npm run build
```

## Manual Test Steps
1. Run `npm run dev` to start development server
2. Open http://localhost:3000
3. Verify all components render on the demo page
4. Check that colors match the design system
5. Test button hover and disabled states
6. Test input focus states
7. Verify responsive layout on mobile/desktop
8. Check typography scale renders correctly
