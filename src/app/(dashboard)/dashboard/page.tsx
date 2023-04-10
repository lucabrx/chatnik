import { getFriendByUserId } from "@/helpers/get-friends-by-user-id"
import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/utils/auth"
import { chatHrefConstructor } from "@/utils/chatHrefConstructor"
import { ChevronRight } from "lucide-react"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"



const Dashboard= async ({}) => { 

  const session = await getServerSession(authOptions)
  if(!session) return notFound()

  const friends = await getFriendByUserId(session.user.id)

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        'zrange',
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[]

      const lastMessage = JSON.parse(lastMessageRaw) as Message

      return {
        ...friend,
        lastMessage,
      }
    })
  )



  
  return (
<div className="container py-12 px-[20px] md:px-0"> 
<h1 className="font-bold text-5xl mb-8">Last Talks</h1>
{friendsWithLastMessage.length === 0 ? (
  <p className="text-sm text-text-sec">Nothing to show here...</p>
) : 
friendsWithLastMessage.map((friend) => ( 
  <div key={friend.id} className="relative bg-input/30  p-3 rounded-md max-w-[350px]">
    <div className="absolute right-4 inset-y-0 flex items-center">
    <ChevronRight className="h-7 w-7 text-zinc-400"/>  
    </div>

    <Link 
    href={`/dashboard/chat/${chatHrefConstructor(session.user.id, friend.id)}`}
    className="relative sm:flex"
    >
      <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
        <div className="relative h-6 w-6">
          <Image referrerPolicy="no-referrer" fill className="rounded-full" alt={`${friend.name} profile pic`} src={friend.image} />
        </div>
      </div>
      <div>
        <h4 className="text-lg  font-semibold">{friend.name}</h4>
        <p className="mt-1 max-w-[260px] ">
          <span className="text-text-sec truncate">
            {friend.lastMessage?.senderId === session.user.id ? 'You: ' : ''}
          </span>
          {friend.lastMessage?.text}
        </p>
      </div>
    </Link>
  </div>
))
}
</div>
)
}

export default Dashboard