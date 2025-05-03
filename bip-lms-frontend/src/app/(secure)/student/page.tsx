"use client";

import { ProfileForm } from "@/components/student/student-form";
import { httpClient } from "@/http/http-service";
import { useEffect } from "react";

export default function CreateStudentPage() {


    useEffect(() => {
        httpClient.get('http://localhost:8089/lms/api/v1/user')
        .then(data => console.log(data));
    }, [])

    

    return <>
        <ProfileForm studentId={""} />
    </>
}
