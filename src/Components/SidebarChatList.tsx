'use client'
import { chatHrefConstructor } from '@/utils/chatHrefConstructor';
import { pusherClient } from '@/utils/pusher';
import { toPusherKey } from '@/utils/toPusherKey';
import { type NextPage } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import UnseenChatToast from './UnseenChatToast';

interface SidebarChatListProps {
    friends: User[];
    sessionId: string;
}

interface ExtendedMessage extends Message {
    senderImage: string;
    senderName: string;
}

const SidebarChatList: NextPage<SidebarChatListProps> = ({ friends, sessionId }) => {
    const router = useRouter()
    const pathname = usePathname()
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
    const [activeChats, setActiveChats] = useState<User[]>(friends)

    useEffect(() => {
        if (pathname?.includes('chat')) {
            setUnseenMessages((prev) => {
                return prev.filter((msg) => !pathname.includes(msg.senderId))
            })
        }
    }, [pathname])

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

        const newFriendHandler = (newFriend: User) => {
            setActiveChats((prev) => [...prev, newFriend])
        }

        const chatHandler = (message: ExtendedMessage) => {
            const shouldNotify =
              pathname !==
              `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`
      
            if (!shouldNotify) return
            console.log(message.senderImage)
            toast.custom((t) => (
              <UnseenChatToast
                t={t}
                sessionId={sessionId}
                senderId={message.senderId}
                senderMessage={message.text}
                senderName={message.senderName}
              />
            ))
      
            setUnseenMessages((prev) => [...prev, message])
          }

        pusherClient.bind(`new_message`, chatHandler)
        pusherClient.bind(`new_friend`, newFriendHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

            
        pusherClient.unbind(`new_message`, chatHandler)
        pusherClient.unbind(`new_friend`, newFriendHandler)
        }
    }, [pathname, sessionId, router ])


    return (
        <ul role='list' className='max-h-[25rem] overflow-y-auto space-y-1'>
            {friends.sort().map((friend) => {
                const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
                    return unseenMsg.senderId === friend.id
                }).length

                return (<li key={friend.id}>
                    <a
                        className=' text-text hover:text-cta hover:bg-input/30 group flex gap-3 rounded-md py-2 px-2 text-sm leading-6 tracking-wide font-semibold items-center justify-start'
                        href={`/dashboard/chat/${chatHrefConstructor(
                            sessionId,
                            friend.id
                        )}`}>{friend.name}
                        {unseenMessagesCount > 0 ?
                            (<div className='bg-cta font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                                {unseenMessagesCount}
                            </div>) : null}
                    </a>

                </li>)
            })}
        </ul>
    )
}

export default SidebarChatList