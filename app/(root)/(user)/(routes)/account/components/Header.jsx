import React from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

const Header = () => {
  const { data: session } = useSession()

  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 shadow-md">
      <h1 className="text-2xl font-bold">Account</h1>
      <div className="flex items-center space-x-4">
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <span>{session?.user?.name}</span>
      </div>
    </div>
  )
}

export default Header
