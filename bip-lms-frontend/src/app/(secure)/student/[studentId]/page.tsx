import { ProfileForm } from "@/components/student/student-form";
import { Suspense, use } from "react";

export default function EditStudentPage({ params }: { params: Promise<any> }) {
    const resolvedParams = use(params);
    return <>
    <Suspense fallback={<div>Loading...</div>}>
    <ProfileForm studentId={resolvedParams?.studentId} />
      </Suspense>
    </>
}
