import ModuleSessionDetails from '@/components/configuration/module/module-session-details'
import React from 'react'

export default async function page({
  params,
}: {
  params: Promise<{ moduleId: string }>
}) {
  const { moduleId } = await params
  return (
    <ModuleSessionDetails moduleId={moduleId} />
  )
}