
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/utils/auth';
import { db } from '@/utils/db';
import { messageArrayValidator } from '@/utils/validations/message';
import { getServerSession } from 'next-auth';
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
<div> 
{params.chatId}
</div>
)
}

export default Chat