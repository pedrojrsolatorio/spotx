"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input, SearchInput, Select } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { ProgressBar } from "@/components/ui/progress-bar"
import {
  CourseCard,
  VideoCard,
  LessonCard,
  StudyCard,
} from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Pagination } from "@/components/ui/pagination"


export default function Home() {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navigation
        breadcrumbs={[
          { label: "All Courses", href: "/courses" },
          { label: "Next.js for Beginners", href: "/courses/nextjs-beginners" },
          { label: "Data Fetching & Caching" },
        ]}
      />

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-display-1 font-bold text-primary-500 font-poppins mb-8">
          SpotX Design System
        </h1>

        {/* Colors Section */}
        <section className="mb-12">
          <h2 className="text-heading-1 font-semibold text-primary-500 font-poppins mb-6">
            Colors
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-md p-4 bg-primary-500 text-white">
              <div className="text-small">Primary 500</div>
              <div className="text-body font-medium">#172A39</div>
            </div>
            <div className="rounded-md p-4 bg-primary-accent text-white">
              <div className="text-small">Primary Accent</div>
              <div className="text-body font-medium">#FC563C</div>
            </div>
            <div className="rounded-md p-4 bg-primary-200 text-primary-500">
              <div className="text-small">Primary 200</div>
              <div className="text-body font-medium">#E9E4E0</div>
            </div>
            <div className="rounded-md p-4 bg-primary-300 text-white">
              <div className="text-small">Primary 300</div>
              <div className="text-body font-medium">#6E7575</div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-12">
          <h2 className="text-heading-1 font-semibold text-primary-500 font-poppins mb-6">
            Typography
          </h2>
          <div className="space-y-4">
            <div>
              <div className="text-display-1 font-bold text-primary-500 font-poppins">
                Display 1
              </div>
              <div className="text-small text-neutral-500">48px / 56px · Bold · Poppins</div>
            </div>
            <div>
              <div className="text-display-2 font-semibold text-primary-500 font-poppins">
                Display 2
              </div>
              <div className="text-small text-neutral-500">36px / 44px · Semibold · Poppins</div>
            </div>
            <div>
              <div className="text-heading-1 font-semibold text-primary-500 font-poppins">
                Heading 1
              </div>
              <div className="text-small text-neutral-500">28px / 36px · Semibold · Poppins</div>
            </div>
            <div>
              <div className="text-heading-2 font-semibold text-primary-500 font-poppins">
                Heading 2
              </div>
              <div className="text-small text-neutral-500">22px / 30px · Semibold · Poppins</div>
            </div>
            <div>
              <div className="text-heading-3 font-medium text-primary-500 font-poppins">
                Heading 3
              </div>
              <div className="text-small text-neutral-500">18px / 26px · Medium · Poppins</div>
            </div>
            <div>
              <div className="text-body-large text-primary-500">
                Body Large
              </div>
              <div className="text-small text-neutral-500">16px / 24px · Regular · Inter</div>
            </div>
            <div>
              <div className="text-body text-primary-500">
                Body
              </div>
              <div className="text-small text-neutral-500">14px / 20px · Regular · Inter</div>
            </div>
            <div>
              <div className="text-small text-primary-500">
                Small
              </div>
              <div className="text-small text-neutral-500">12px / 16px · Regular · Inter</div>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="mb-12">
          <h2 className="text-heading-1 font-semibold text-primary-500 font-poppins mb-6">
            Buttons
          </h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="text">Text Button</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="mb-12">
          <h2 className="text-heading-1 font-semibold text-primary-500 font-poppins mb-6">
            Inputs
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-body font-medium text-primary-500 mb-2">
                Search Input
              </label>
              <SearchInput placeholder="Search anything..." />
            </div>
            <div>
              <label className="block text-body font-medium text-primary-500 mb-2">
                Text Input
              </label>
              <Input placeholder="Enter text..." />
            </div>
            <div>
              <label className="block text-body font-medium text-primary-500 mb-2">
                Select
              </label>
              <Select
                options={[
                  { value: "", label: "Select course" },
                  { value: "nextjs", label: "Next.js for Beginners" },
                  { value: "react", label: "React Fundamentals" },
                  { value: "typescript", label: "TypeScript Mastery" },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className="mb-12">
          <h2 className="text-heading-1 font-semibold text-primary-500 font-poppins mb-6">
            Badges / Tags
          </h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="video">Video</Badge>
            <Badge variant="lesson">Lesson</Badge>
            <Badge variant="popular">Popular</Badge>
          </div>
        </section>

        {/* Status Indicators Section */}
        <section className="mb-12">
          <h2 className="text-heading-1 font-semibold text-primary-500 font-poppins mb-6">
            Status / Indicators
          </h2>
          <div className="flex flex-wrap gap-6">
            <StatusIndicator variant="in-progress" />
            <StatusIndicator variant="completed" />
            <StatusIndicator variant="now-playing" />
            <StatusIndicator variant="locked" />
          </div>
        </section>

        {/* Progress Bar Section */}
        <section className="mb-12">
          <h2 className="text-heading-1 font-semibold text-primary-500 font-poppins mb-6">
            Progress Bar
          </h2>
          <div className="max-w-md">
            <ProgressBar value={35} />
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-12">
          <h2 className="text-heading-1 font-semibold text-primary-500 font-poppins mb-6">
            Cards
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CourseCard
              title="Introduction to Web Development"
              description="Learn the fundamentals of web development, from HTML to JavaScript."
              level="Intermediate"
              duration="18h 24m"
              modules={12}
            />
            <VideoCard
              title="Build Your First React App"
              description="Follow a hands-on project to create your first React application."
              lesson="Lesson 5.1"
              timestamp="12:45"
            />
            <LessonCard
              title="UI/UX Design Basics"
              description="Learn how to create user-friendly interfaces and better user experiences."
              module="Module 5"
            />
            <StudyCard
              title="Study Guide & Resources"
              description="Download additional materials, cheat sheets and templates."
              fileType="PDF"
              fileSize="1.2 MB"
            />
          </div>
        </section>

        {/* Pagination Section */}
        <section className="mb-12">
          <h2 className="text-heading-1 font-semibold text-primary-500 font-poppins mb-6">
            Pagination
          </h2>
          <Pagination
            currentPage={currentPage}
            totalPages={8}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>
    </div>
  )
}
