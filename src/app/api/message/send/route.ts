import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/utils/auth";
import { db } from "@/utils/db";
import { pusherServer } from "@/utils/pusher";
import { toPusherKey } from "@/utils/toPusherKey";
import { Message,  messageValidator } from "@/utils/validations/message";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
    try {
      const { text, chatId }: { text: string; chatId: string } = await req.json()
      const session = await getServerSession(authOptions)
  
      if (!session) return new Response('Unauthorized', { status: 401 })
  
      const [userId1, userId2] = chatId.split('--')
  
      if (session.user.id !== userId1 && session.user.id !== userId2) {
        return new Response('Unauthorized', { status: 401 })
      }
  
      const friendId = session.user.id === userId1 ? userId2 : userId1
  
      const friendList = (await fetchRedis(
        'smembers',
        `user:${session.user.id}:friends`
      )) as string[]
      const isFriend = friendList.includes(friendId)
  
      if (!isFriend) {
        return new Response('Unauthorized', { status: 401 })
      }
  
      const rawSender = (await fetchRedis(
        'get',
        `user:${session.user.id}`
      )) as string
      const sender = JSON.parse(rawSender) as User
  
      const timestamp = Date.now()
  
      const messageData: Message = {
        id: nanoid(),
        senderId: session.user.id,
        text,
        timestamp,
      }
  
      const message = messageValidator.parse(messageData)
  
      pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming-message', message)
  
      // all valid, send the message
      await db.zadd(`chat:${chatId}:messages`, {
        score: timestamp,
        member: JSON.stringify(message),
      })
  
      return new Response('OK')
    } catch (error) {
      if (error instanceof Error) {
        return new Response(error.message, { status: 500 })
      }
  
      return new Response('Internal Server Error', { status: 500 })
    }
  }