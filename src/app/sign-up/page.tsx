"use client"
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

const page = () => {
    const toast=useToast()
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [userNameMessage, setUserNameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const deBounsedUsername = useDebounceValue(username,300)

    //Zod implementation 
    const form = useForm({
        // resolver:zodResolver()
    })
    return (
        <div>page</div>
    )
}

export default page