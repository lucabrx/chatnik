import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/utils/auth"
import { db } from "@/utils/db"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req:Request) {
    try {
        const body = await req.json()

        const {id: idToAdd} = z.object({id: z.string()}).parse(body)

        const session = await getServerSession(authOptions)

        if(!session) {
            return new Response('Unauthorized', {status: 401})
        }
        // verify if user already friends 
        const isAlreadyFriends = await fetchRedis('sismember', 
        `user:${session.user.id}:friends`, idToAdd)

        if(isAlreadyFriends) { 
            return new Response('Already on your friend list', {status: 400})
        }

        const hasFriendRequest = await fetchRedis('sismember', 
        `user:${session.user.id}:incoming_friend_requests`, idToAdd)

        if(!hasFriendRequest) {
            return new Response('No friend request', {status: 400})
        }
        // so that both people are on there friend list
        await db.sadd(`user:${session.user.id}:friends`, idToAdd)
        await db.sadd(`user:${idToAdd}:friend`, session.user.id)
        // clean request 

        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd)
        return new Response ('OK')
    } catch(error) {
        if(error instanceof z.ZodError) {
            return new Response('Invalid request payload', {status: 422})
        }
        return new Response('Invalid request', {status: 400})
    }
}