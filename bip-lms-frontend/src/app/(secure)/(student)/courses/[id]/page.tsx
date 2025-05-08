import CourseDetailInfo from "@/components/courses/courses-info";

export default async function CourseDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;  

  return (
    <CourseDetailInfo courseId={id}/>
  )
}

