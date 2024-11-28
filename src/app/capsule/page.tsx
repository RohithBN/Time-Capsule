"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { User } from "next-auth"

// Capsule schema definition
const CapsuleSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(8, {
    message: "Description must be at least 8 characters.",
  }),
  openOn: z.date(),
  picture: z.any(), // We'll handle validation separately
})

export default function Page() {
    const [isSubmitting,setIsSubmitting]=React.useState(false)
    const {data:session}=useSession();
    const user=session?.user as User
  const {toast}=useToast();
  const router=useRouter();
  const form = useForm<z.infer<typeof CapsuleSchema>>({
    resolver: zodResolver(CapsuleSchema),
    defaultValues: {
      title: "",
      description: "",
      openOn: new Date(), // Default to today
    },
  })

  // Submit handler
  async function onSubmit(values: z.infer<typeof CapsuleSchema>) {
    const formData = new FormData()
    formData.append("title", values.title)
    formData.append("description", values.description)
    formData.append("openOn", values.openOn.toISOString())
    formData.append("username",user?.username|| "")
    if (values.picture && values.picture[0]) {
      formData.append("picture", values.picture[0]) // Add file to FormData
    }

    try {
        setIsSubmitting(true)
      const response = await fetch("/api/addCapsule", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      toast({
        title:"Capsule added",
        description:"Capsule created and added"
      })
      router.push('/dashboard')
      
      console.log(result)
    } catch (error) {
      console.error("Failed to submit form:", error)
    }
    finally{
        setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6">
      <div className="w-full max-w-2xl bg-gray-850 shadow-2xl rounded-lg p-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-100 mb-8">Create a Capsule</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-gray-300 font-semibold">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a title"
                      {...field}
                      className="bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-gray-300 font-semibold">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your description here."
                      {...field}
                      className="bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Open Date Field */}
            <FormField
              control={form.control}
              name="openOn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-gray-300 font-semibold">Open Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full text-left font-normal bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, "PPP")
                            : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Picture Field */}
            <FormField
              control={form.control}
              name="picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-gray-300 font-semibold">Picture</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e) => {
                        field.onChange(e.target.files)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white w-full py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
