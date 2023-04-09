import Button from '@/Components/ui/Button'
import { db } from '@/utils/db'


export default async function Home() {

  await db.set('hello', 'hello')
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button variant='ghost'>hello</Button>
    </div>
  )
}
