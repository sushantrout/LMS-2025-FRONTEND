import ManageCoursePage from '@/components/configuration/manage-course-configurations'
import React from 'react'

export default function page({ params }: { params: { id: string } }) {
  return (
    <ManageCoursePage params={params} />
  )
}
