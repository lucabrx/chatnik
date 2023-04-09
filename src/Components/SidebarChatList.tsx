'use client'
import { chatHrefCunstructor } from '@/utils/chatHrefConstructor';
import { type NextPage } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SidebarChatListProps {
  friends: User[];
  sessionId: string;
}

const SidebarChatList: NextPage<SidebarChatListProps> = ({friends,sessionId}) => {
    const router = useRouter()
    const pathname = usePathname()

    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])

    useEffect(() => {
        if(pathname?.includes('chat')) {
            setUnseenMessages((prev) => {
                return prev.filter((msg) => !pathname.includes(msg.senderId))
            })
        }
    }, [pathname])


  return (
<ul role='list' className='max-h-[25rem] overflow-y-auto space-y-1'> 
{friends.sort().map((friend) => {
    const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
        return unseenMsg.senderId === friend.id
    }).length

    return (<li key={friend.id}>
        <a
        className=' text-text hover:text-cta hover:bg-input/30 group flex gap-3 rounded-md py-2 px-2 text-sm leading-6 tracking-wide font-semibold items-center justify-start'
        href={`/dashboard/chat/${chatHrefCunstructor(
            sessionId,
            friend.id
        )}`}>{friend.name}
            {unseenMessagesCount > 0 ? 
                (<div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                    {unseenMessagesCount}
                </div>)  : null}
        </a>
    </li>)
})}
</ul>
)
}

export default SidebarChatList