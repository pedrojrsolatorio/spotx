import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { AllCourses } from "@/components/all-courses"
import { Footer } from "@/components/footer"
import { getCatalog } from "@/sanity/lib/data"

export const metadata: Metadata = {
  title: "All Courses | SpotX",
  description: "Browse all available courses on SpotX.",
}

export default async function CoursesPage() {
  const courses = await getCatalog()

  return (
    <div className="flex min-h-screen flex-col bg-primary-100">
      <Navigation activeRoute="courses" />
      <main className="flex-1 pt-28">
        <AllCourses courses={courses} showViewAll={false} />
      </main>
      <Footer />
    </div>
  )
}
