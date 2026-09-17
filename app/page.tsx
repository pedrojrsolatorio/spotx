import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { AllCourses } from "@/components/all-courses"
import { Footer } from "@/components/footer"
import { getFeaturedCourses } from "@/sanity/lib/data"

export default async function Home() {
  const courses = await getFeaturedCourses()

  return (
    <div className="flex min-h-screen flex-col bg-primary-100">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <AllCourses courses={courses} />
      </main>
      <Footer />
    </div>
  )
}
