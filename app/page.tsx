"use client";

import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { AllCourses, Course } from "@/components/all-courses";
import { Footer } from "@/components/footer";

const courses: Course[] = [
  {
    id: "nextjs-production",
    title: "Next.js for Production",
    description:
      "Build scalable, high-performance web applications with Next.js.",
    level: "Intermediate",
    duration: "18h 24m",
    modules: 12,
    icon: "N",
    color: "bg-neutral-800",
  },
  {
    id: "docker-essentials",
    title: "Docker Essentials",
    description:
      "Containerize applications and streamline your development workflow.",
    level: "Beginner",
    duration: "10h 12m",
    modules: 8,
    icon: "🐳",
    color: "bg-blue-500",
  },
  {
    id: "typescript-deep-dive",
    title: "TypeScript Deep Dive",
    description: "Go beyond the basics and write safer, more expressive code.",
    level: "Intermediate",
    duration: "14h 36m",
    modules: 10,
    icon: "TS",
    color: "bg-blue-600",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-primary-100">
      <Navigation activeRoute="courses" />
      <main>
        <Hero />
        <AllCourses courses={courses} />
      </main>
      <Footer />
    </div>
  );
}
