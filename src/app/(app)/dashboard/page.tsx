"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Message } from '@/models/User'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import Link from 'next/link'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Loader2, RefreshCcw } from 'lucide-react'
import MessageCard from '@/components/MessageCard'
import { useRouter } from 'next/navigation'

const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((msg) => msg._id !== messageId))
  }

  const { data: session } = useSession()

  console.log(session)

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message")
      setValue('acceptMessages', response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Showing latest messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      })
    } finally {
      setIsSwitchLoading(false)
      setIsLoading(false)
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: response.data.message,
        variant: "default"
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      })
    }
  }

  const { username } = session?.user as User


  const baseUrl = `${window.location.protocol}//${window.location.host}`

  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "URL copied",
      description: "Profile url has been copied to clipboard"
    })
  }

  if (!session || !session.user) {
    return <div>
      <Link href={"/sign-in"}>Please Login</Link>
    </div>
  }
  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white h-screen rounded w-full max-w-full'>
      <h1 className='text-lg font-bold mb-4'>User Dashboard</h1>
      <div className='mb-4'>
        <h2 className='text-sm font-semibold m-2'>Copy your unique link</h2>{''}
        <div className='flex items-center'>
          <input type="text" value={profileUrl} disabled className='input input-bordered p-2 mr-2 w-full' />
          <Button onClick={copyToClipBoard} variant={"default"} >Copy</Button>
        </div>
        <div className='mb-4'>
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className='ml-2 '> Accept Messages : {acceptMessages ? "On" : "Off"} </span>
        </div>
        <Separator />
        <Button className='mt-4' variant={"outline"} onClick={(e) => { e.preventDefault(); fetchMessages(true) }}>
          {isLoading ? (<Loader2 className='h-4 w-4 animate-spin' />) : (<RefreshCcw className='h-4 w-4' />)}
        </Button>
        <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
          {messages.length > 0 ? (
            messages.map((message, index) => {
              return <MessageCard message={message} onMessageDelete={handleDeleteMessage} >

              </MessageCard>
            })
          ) : (
            <p>No message to display.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default page