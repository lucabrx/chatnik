import AddFriendButton from '@/Components/AddFriendButton';
import { type NextPage } from 'next';



const Add: NextPage = ({}) => {
  return (
<main className='pt-8'> 
<h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
<AddFriendButton />
</main>
)
}

export default Add