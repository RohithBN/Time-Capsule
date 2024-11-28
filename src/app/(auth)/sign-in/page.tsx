'use client'

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
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const SignInformSchema = z.object({
  email: z.string().email({
    message: "Invalid email.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export default function Page() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof SignInformSchema>>({
        resolver: zodResolver(SignInformSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    
    const onSubmit = async (data: z.infer<typeof SignInformSchema>,e:any) => {
      // Prevent default form submission
      e.preventDefault();
    
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });
    
      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Login Failed',
            description: 'Incorrect username or password',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        }
      }
    
      if (result?.url) {
        console.log("Redirecting to dashboard...");
        router.push('/dashboard'); // Redirect to the desired page
      }
    };
    
        
  

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-center text-3xl font-bold text-gray-900">Sign In</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} method="POST" className="space-y-6">
                        <p className="text-gray-500 ml-20">Don't have an account? <Link href={"/sign-up"}> <u className="text-black hover:text-gray-500">SignUp</u></Link> </p> 
                        
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter email"
                                            {...field}
                                            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter Password"
                                            {...field}
                                            className="block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isSubmitting}  // Disable button while submitting
                        >
                            {isSubmitting ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
