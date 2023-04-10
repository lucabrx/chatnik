import FriendRequestSidebarOption from '@/Components/FriendRequestSidebarOption';
import { Icons } from '@/Components/Logo';
import SidebarChatList from '@/Components/SidebarChatList';
import SignoutButton from '@/Components/SignoutButton';
import { getFriendByUserId } from '@/helpers/get-friends-by-user-id';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/utils/auth';
import {  User, UserPlus } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactElement } from 'react';

interface LayoutProps {
  children: React.ReactNode
}

interface SidebarOption{
    id: number
    name: string
    href: string 
    Icon: ReactElement;
}

const sidebarOptions: SidebarOption[] = [
    {
        id: 1,
        name: 'Add  Friend',
        href: '/dashboard/add',
        Icon: <UserPlus className='w-6 h-6' />
    }
]

const Layout = async ({children}: LayoutProps) => {
    const session = await getServerSession(authOptions)
    if(!session) notFound()

    const friends = await getFriendByUserId(session.user.id) 

    const unseenRequestCount = (await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`)as User[]).length
  return (
<div className='w-full flex h-screen'> 
<div className='flex h-full w-full max-w-[350px] grow flex-col gap-y-5 overflow-y-auto border-r border-input px-[24px] py-[12px]'>
    <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
    <Icons.Logo className='w-[160px] h-auto' />
    </Link>
 {friends.length > 0 ?  (<div className='text-xs font-semibold leading-6 text-text-sec'>
    Your Friends
 </div>) : null}

 <nav className='flex flex-1 flex-col'>
    <ul role='list' className='flex flex-1 flex-col gap-y-7'>
    <li><SidebarChatList sessionId={session.user.id} friends={friends} /></li>      
   <li>
   <div className='text-xs font-semibold leading-6 text-text-sec'>
    Overview
    </div>
    <ul role='list' className='-mx-2 mt-2 space-y-2'>
    {sidebarOptions.map(item => (
        <li key={item.id}>
            <Link href={item.href}
            className='text-text hover:text-cta hover:bg-input/30 group flex gap-3 rounded-md p-2 text-sm leading-6 tracking-wide font-semibold items-center justify-start'
            >
              <span className='text-cta bg-white group-hover:text-cta flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[1rem] font-medium'>{item.Icon}</span>  
                <span className='truncate'>{item.name}</span>
            </Link>
        </li>
    ))}
      <li>
    <FriendRequestSidebarOption sessionId={session.user.id} initialUnseenRequestCount={unseenRequestCount} />
   </li>
    </ul>
   </li>
 
   <li className='-mx-6 mt-auto flex items-center'>
    <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-text'>
        <div className='relative h-8 w-8 '>
            <Image src={(session.user.image) || ''} fill  className='rounded-full' 
            alt='your profile picture'  /></div>
        <div className='flex flex-col'>
            <span>{session.user.name}</span>
            <span className='text-xs text-text-sec'>{session.user.email}</span>
        </div>
    </div>
    <SignoutButton  className='h-full mx-[24px]' />
   </li>
    </ul>
     </nav>
</div>
{children}
</div>
)
}

export default Layout