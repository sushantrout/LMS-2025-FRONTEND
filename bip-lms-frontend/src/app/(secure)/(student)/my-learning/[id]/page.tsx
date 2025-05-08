import StudentCourseView from '@/components/courses/student-course-view'
import React from 'react'

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <StudentCourseView courseId={id} />
  )
}


