import ManageCoursePage from '@/components/configuration/manage-course-configurations'
import React from 'react'

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <ManageCoursePage courseId={id} />
  )
}
