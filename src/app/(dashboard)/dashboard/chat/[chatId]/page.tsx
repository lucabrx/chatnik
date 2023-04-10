
import Messages from '@/Components/Messages';
import ChatInput from '@/Components/ChatInput';

import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/utils/auth';
import { db } from '@/utils/db';
import { messageArrayValidator } from '@/utils/validations/message';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ChatProps {
  params: {
    chatId: string 
  }
}

async function getChatMessages(chatId: string) {
  try{
    const results: string[] = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    )

    const dbMessages = results.map((message) => JSON.parse(message) as Message)
    const reverseredDbMessages = dbMessages.reverse()

    const messages = messageArrayValidator.parse(reverseredDbMessages)

    return messages 
  } catch(error) {
    notFound()
  }
}

const Chat = async ({params}: ChatProps) => {
  
  const {chatId} = params 
  const session = await getServerSession(authOptions)
  if(!session) notFound()

  const {user} = session
// from 1user -- 2nd user 
  const [userId1,userId2] = chatId.split('--')

  if(user.id !== userId1 && user.id !== userId2) {
    return notFound()
  }

  const chatParnerId = user.id === userId1 ? userId2 : userId1 
  const chatParter = (await db.get(`user:${chatParnerId}`)) as User 
  const initialMessages = await getChatMessages(chatId)
  return (
<div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'> 
<div className='flex sm:items-center justify-between py-3 border-b-2 border-input px-[24px]'>
  <div className='flex items-center space-x-4 relative'>
    <div className='relative'>
      <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
        <Image fill src={chatParter.image} alt='chat partner image' referrerPolicy='no-referrer' className='rounded-full'/>
      </div>
    </div>
    <div className='flex flex-col leading-tight'>
     <div className='text-xl flex items-center'>
     <span className='text-text mr-3 font-semibold '>{chatParter.name}</span>
     </div>
     <span className='text-sm text-text-sec'>{chatParter.email}</span>
    </div>
  </div>
</div>
<Messages initialMessages={initialMessages} sessionId={session.user.id} />
  <ChatInput chatPartner={chatParter} chatId={chatId} />

</div>
)
}

export default Chat