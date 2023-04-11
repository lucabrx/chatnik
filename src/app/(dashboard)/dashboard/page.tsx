import { getFriendByUserId } from "@/helpers/get-friends-by-user-id"
import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/utils/auth"
import { chatHrefConstructor } from "@/utils/chatHrefConstructor"
import { ChevronRight } from "lucide-react"
import { getServerSession } from "next-auth"

import { notFound } from "next/navigation"



const Dashboard= async ({}) => { 

  const session = await getServerSession(authOptions)
  if (!session) notFound()

  

  return (
<div className="container py-12 px-[20px] md:px-0"> 
<h1 className="font-bold text-5xl mb-8">In build</h1>

  <p className="text-sm text-text-sec">Nothing to show here...</p>

</div>
)
}

export default Dashboard