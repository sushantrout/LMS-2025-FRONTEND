"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"

const formSchema = z.object({
  username: z.string().min(10, {
    message: "Username must be at least 10 characters.",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters.",
  }),
})

interface ProfileFormProps {
    studentId: string;
}

export function ProfileForm({ studentId }: ProfileFormProps) {

    const router = useRouter();



    

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: studentId ? studentId : "",
          password: "",
        },
      })

      function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        //save in backend
        router.push("/student/list");
      }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password Label</FormLabel>
                    <FormControl>
                        <Input placeholder=" provide label" {...field} />
                    </FormControl>
                    <FormDescription>
                        This is your label
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
        <Button type="submit">Submit Student</Button>
      </form>
    </Form>
  )
}
