"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

const Navbar = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const user: User = session?.user as User
   
    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <Link href="#" className='text-lg font-bold mb-4 md:mb-0' >Samaya Message</Link>
                {
                    session ? (
                        <>
                            <span className='mr-4'>Welcome {user?.username || user?.email}</span>
                            <Link href={"#"}>
                                <Button className='w-full m-auto' variant={"default"} onClick={()=>{signOut({redirect:false}).then(()=>{router.replace("/")})}} >Signout</Button>
                            </Link>
                        </>
                    ) : (
                        <Link href={"/sign-in"}>
                            <Button variant={"default"} className='w-full m-auto'>Signin</Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar