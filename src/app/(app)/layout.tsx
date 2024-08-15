import Navbar from '@/components/Navbar'
import React from 'react'

const DashboardLayout = ({children}:Readonly<{children:React.ReactNode}>) => {
  return (
    <div>
      <Navbar/>
    </div>
  )
}

export default DashboardLayout