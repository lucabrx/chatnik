'use client'

import { type NextPage } from 'next';
import { Toaster} from 'react-hot-toast'
interface ProvidersProps {
  children: React.ReactNode; 
}

const Providers: NextPage<ProvidersProps> = ({children}) => {
  return (
<> 
<Toaster position='top-center' reverseOrder={false} />
{children}
</>
)
}

export default Providers