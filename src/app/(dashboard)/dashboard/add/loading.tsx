import { type NextPage } from 'next';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

interface loadingProps {
  
}

const loading: NextPage<loadingProps> = ({}) => {
  return (
<div className='w-full flex flex-col gap-3 bg-white/30'> 
<Skeleton className='mb-4' height={60} width={500} />
<Skeleton className="bg-white/30"   height={20} width={150} />
<Skeleton  className="bg-white/30"  height={50} width={400} />

</div>
)
}

export default loading