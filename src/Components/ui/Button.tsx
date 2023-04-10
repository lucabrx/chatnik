import { type VariantProps, cva } from 'class-variance-authority'
import { ButtonHTMLAttributes, forwardRef } from 'react';
import {Loader2} from 'lucide-react'
import { NextPage } from 'next';
import cn from '@/utils/className';
const buttonVariants = cva(
    'active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none disabled:opacity-50 disabled:pointer-events-none  duration-500',
    {
        variants:{
            variant: {
                    default: 'bg-[#f7449a] text-text hover:bg-pink-700',
                    ghost: 'bg-transparent hover:text-bg text-text hover:bg-text',
                    exit: 'bg-transparent hover:bg-input/30',
                },
                size: {
                    default: 'h-10 py-2 px-4',
                    sm: "h-9 px-2",
                    lg: 'h-11 px-8'
                }
            },
        defaultVariants: {
            variant: "default",
            size: 'default'
        }
        },
)



export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants>  {
  isLoading?: boolean
}

const Button: NextPage<ButtonProps> = ({className, children,size, variant, isLoading, ...props}) => {
  return (
<button {...props} className={cn(buttonVariants({variant,size,className}))} disabled={isLoading}> 
    {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
    {children}
</button>
)
}

export default Button