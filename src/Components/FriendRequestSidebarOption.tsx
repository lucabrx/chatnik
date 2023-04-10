'use client'


import { pusherClient } from '@/utils/pusher';
import { toPusherKey } from '@/utils/toPusherKey';
import {  User } from 'lucide-react';
import { type NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface FriendRequestSidebarOptionProps {
  sessionId: string
  initialUnseenRequestCount: number
}

const FriendRequestSidebarOption: NextPage<FriendRequestSidebarOptionProps> = ({  sessionId,
initialUnseenRequestCount
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  )

  useEffect(() => { 
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))

    const friendRequestHandler = () => {
      setUnseenRequestCount((prev) => prev + 1)
    }

    pusherClient.bind('incoming_friend_requests', friendRequestHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
      pusherClient.unbind('incoming_friend_requests', friendRequestHandler)

    }
  }, [])

  return (
<Link
      href='/dashboard/requests'
      className=' text-text hover:text-cta hover:bg-input/30 group flex gap-3 rounded-md p-2 text-sm leading-6 tracking-wide font-semibold items-center justify-start '>

      <span className='text-cta bg-white group-hover:text-cta flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[1rem] font-medium'><User className='w-6 h-6'  />
      </span>  
   
      <p className='truncate'>Friend requests</p>
      {unseenRequestCount > 0 ? (
        <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-cta'>
          {unseenRequestCount}
        </div>
      ) : null}

    </Link>
)
}

export default FriendRequestSidebarOption