import { authOptions } from "@/utils/auth"
import { getServerSession } from "next-auth"



const Dashboard= async ({}) => { 

  const session = getServerSession(authOptions)
  return (
<div> 
Dashboard
</div>
)
}

export default Dashboard