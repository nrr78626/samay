"use client"
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'

const page = () => {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    //Zod implementation 
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if (result?.error) {
            if (result.error == "CredentialsSignin") {
                toast({
                    title: "Login failed",
                    description: "Incorrect username or password",
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive"
                })
            }
            setIsSubmitting(false)
        }

        if (result?.url) {
            setIsSubmitting(false)
            setTimeout(() => {
                router.replace("/dashboard")
            }, 3000)
        }

    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-xl font-extrabold tracking-tight lg:text-xl mb-6'>
                        Join Samayas Message
                    </h1>
                    <p className='mb-4 text-sm'>Sign in to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6' >
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Or Username </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email or Username"
                                            {...field}
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Password"
                                            type='password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={isSubmitting} variant={"default"} >
                            {
                                isSubmitting ? (<><Loader2 className='mr-4 h-4 w-4 animate-spin' />Please wait </>) : ('Submit')
                            }
                        </Button>
                    </form>
                </Form>
                <div className='text-center mt-4'>
                    <p>
                        Don't have an account{''}
                        <Link href={"/sign-up"} className='text-blue-600 hover:text-blue-800'>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page