'use client'
import cn from '@/utils/className';
import { Message } from '@/utils/validations/message';
import { format } from 'date-fns';
import { type NextPage } from 'next';
import { useRef, useState } from 'react';
interface MessagesProps {
    initialMessages: Message[]
    sessionId: string;
}

const Messages: NextPage<MessagesProps> = ({initialMessages,sessionId}) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const scrollDownRef = useRef<HTMLDivElement | null>(null)
    const formatTimestamp = (timestamp: number) => {
        return format(timestamp, 'HH:mm')
     }
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
                     'roudned-br-none': !hasNextMessageFromSameUser && isCurrentUser,
                     'rounded-bl-none': !hasNextMessageFromSameUser && !isCurrentUser,},
                )} >{message.text}{' '}
                <span className='text-xs text-gray-300'>{formatTimestamp(message.timestamp)}</span>
                </span>
            </div>
        </div>
    </div>
) 

})}
</div>
)
}

export default Messages