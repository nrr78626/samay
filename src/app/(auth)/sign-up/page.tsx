"use client"
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { signupSchema } from '@/schemas/signupSchema'
import axios, { AxiosError } from "axios"
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const page = () => {
    const { toast } = useToast()
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [userNameMessage, setUserNameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername,500)

    //Zod implementation 
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    useEffect(() => {
        const checkUsernameAvail = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUserNameMessage('')
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)
                    let message = response.data.message
                    setUserNameMessage(message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUserNameMessage(
                        axiosError.response?.data.message ?? "Error checking username"
                    )
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameAvail()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace(`/verify/${username}`)
        } catch (error) {
            console.error("Error in signup of user", error)
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Sign-up failed",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-xl font-extrabold tracking-tight lg:text-xl mb-6'>
                        Join Samayas Message
                    </h1>
                    <p className='mb-4 text-sm'>Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6' >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingUsername && <Loader2 className='animate-spin' />}
                                    <p className={`text-sm ${userNameMessage === "Available" ?"text-green-500":"text-red-500"}`}>{userNameMessage}</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email"
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
                        Already a member ? {''}
                        <Link href={"/sign-in"} className='text-blue-600 hover:text-blue-800'>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page