"use client"
import React from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import * as z from 'zod'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const page = ({ params }: { params: { username: any } }) => {
    const { username } = params
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: username,
                code: data.code
            })

            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace('/sign-in')
        } catch (error) {
            console.error("Error in sign-in ", error)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Sign-in failed",
                description: errorMessage,
                variant: "destructive"
            })
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-xl font-extrabold tracking-tight lg:text-xl mb-6'>
                        Verify your account
                    </h1>
                    <p className='mb-4 text-sm'>Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6' >
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Code"
                                            {...field}

                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit'>
                            Submit
                        </Button>
                    </form>
                </Form>
                <div className='text-center mt-4'>
                    <p>
                        You have password ? {''}
                        <Link href={"/sign-in"} className='text-blue-600 hover:text-blue-800'>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page