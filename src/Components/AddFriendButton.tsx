'use client'

import { type NextPage } from 'next';
import Button from './ui/Button';
import { addFriendSchema } from '@/utils/validations/add-friend';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver} from '@hookform/resolvers/zod'
interface AddFriendButtonProps {
  
}

type FormData = z.infer<typeof addFriendSchema>

const {register, handleSubmit , setError, formState: {errors}} = useForm<FormData>({
    resolver: zodResolver(addFriendSchema)
})

const AddFriendButton: NextPage<AddFriendButtonProps> = ({}) => {
    const [showSuccessState,setShowSuccessState] = useState<boolean>(false)

    const addFriend = async (email:string) => {
        try{
            const validatedEmail = addFriendSchema.parse({email})

            await axios.post('/api/friends/add', {
                body: validatedEmail
            })
            setShowSuccessState(true)
        } catch(error) {
            if(error instanceof z.ZodError) {
                setError('email', {message: error.message})
                return 
            }
            if(error instanceof AxiosError) {
                setError('email', {message: error.response?.data})
                return 
            }

            setError('email', {message: 'Something went wrong'})
        }
    }

    const onSubmit = (data: FormData) => {
        addFriend(data.email)
    }
  return (
<form onSubmit={handleSubmit(onSubmit)} className='max-w-sm'> 
<label htmlFor='email' className='block text-sm font-medium leading-6 text-text-sec'>
    Add friend by E-mail
</label>
<div className='mt-2 flex gap-4'>
    <input type='text' className='block w-full rounded-md border-0 py-1.5 text-text shadow-sm bg-input placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cta sm:text-sm sm:leading-6' placeholder='yana@gmail.com' {...register('email')} />
    <Button>Add</Button>
</div>
<p className='mt-1 text-sm text-red-600'>{errors.email?.message}</p>
{showSuccessState ? (<p className='mt-1 text-sm text-greem-600'>Friend request sent!</p>
) : null}
</form>
)
}

export default AddFriendButton