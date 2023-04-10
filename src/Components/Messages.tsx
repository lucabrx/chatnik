'use client'
import cn from '@/utils/className';
import { pusherClient } from '@/utils/pusher';
import { toPusherKey } from '@/utils/toPusherKey';
import { Message } from '@/utils/validations/message';
import { format } from 'date-fns';
import { type NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
interface MessagesProps {
    initialMessages: Message[]
    sessionId: string;
    sessionImg: string | undefined | null;
    chatPartner: User;
    chatId: string;
}

const Messages: NextPage<MessagesProps> = ({initialMessages,sessionId,chatPartner,sessionImg,chatId}) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const scrollDownRef = useRef<HTMLDivElement | null>(null)
    const formatTimestamp = (timestamp: number) => {
        return format(timestamp, 'HH:mm')
     }


     useEffect(() => { 
        pusherClient.subscribe(toPusherKey(`chat:${chatId}`))
    
        const messageLiveHandler = (message: Message) => {
            setMessages((prev) => [message, ...prev])
        }
    
        pusherClient.bind('incoming-message', messageLiveHandler)
    
        return () => {
          pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
          pusherClient.unbind('incoming-message', messageLiveHandler)
    
        }
      }, [])
  return (
<div id='messages' className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue lighter scrollbar-w-2 scrolling-touch'> 
<div ref={scrollDownRef} />
{messages.map((message,i) => {

const isCurrentUser = message.senderId === sessionId 
const hasNextMessageFromSameUser = messages[i - 1]?.senderId === messages[i].senderId 

return (
    <div className='chat-message' key={`${message.id}-${message.timestamp}`}>
        <div className={cn('flex items-end', {'justify-end': isCurrentUser} )}>
            <div className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2', {
                'order-1 items-end': isCurrentUser,
                'order-2 items-start': !isCurrentUser
            })}>
                <span className={cn('px-4 py-2 rounded-lg inline-block ', { 
                    'bg-cta text-white': isCurrentUser,
                    'bg-gray-200 text-gray-900': !isCurrentUser,
                     'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUser,
                     'rounded-bl-none': !hasNextMessageFromSameUser && !isCurrentUser,},
                )} >{message.text}{' '}
                <span className={cn('text-xs', {
                    ' text-gray-300': isCurrentUser,
                    'text-gray-700': !isCurrentUser,
                })}>{formatTimestamp(message.timestamp)}</span>
                </span>
            </div>
            <div className={cn('relative w-8 h-8 rounded-full', {
                'order-2' : isCurrentUser,
                'order-1' : !isCurrentUser,
                'invisible': hasNextMessageFromSameUser
            })}><Image src={isCurrentUser ? (sessionImg as string) : chatPartner.image } fill alt='avatar' className='rounded-full' referrerPolicy='no-referrer'  /></div>
        </div>
    </div>
) 

})}
</div>
)
}

export default Messages