'use client'

import { Transition, Dialog } from '@headlessui/react'
import { Menu, UserPlus, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import { Icons } from './Logo'
import SignoutButton from './SignoutButton'
import Button from './ui/Button'
import FriendRequestSidebarOption from './FriendRequestSidebarOption'
import SidebarChatList from './SidebarChatList'
import { Session } from 'next-auth'
import { SidebarOption } from '../types/typings'
import { usePathname } from 'next/navigation'
import { NextPage } from 'next'

interface MobileChatLayoutProps {
    friends: User[]
    session: Session
    sidebarOptions: SidebarOption[]
    unseenRequestCount: number
  }

const  MobileChatLayout: NextPage<MobileChatLayoutProps> = ({friends,session,sidebarOptions,unseenRequestCount}) => {
  const [open, setOpen] = useState<boolean>(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])
  return (
    <div className='fixed bg-bg border-b border-input top-0 inset-x-0 py-2 px-4'>
      <div className='w-full bg-bg flex justify-between items-center'>
        <Link
          href='/dashboard'>
          <Icons.Logo className='h-7 w-auto ' />
        </Link>
        <Button onClick={() => setOpen(true)} className='gap-4'>
          Menu <Menu className='h-6 w-6' />
        </Button>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setOpen}>
          <div className='fixed inset-0 ' />

          <div className='fixed inset-0 overflow-hidden  t'>
            <div className='absolute inset-0 overflow-hidden bg-bg'>
              <div className='pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10 bg-bg'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500 sm:duration-1000'
                  enterFrom='-translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500 sm:duration-1000'
                  leaveFrom='translate-x-0'
                  leaveTo='-translate-x-full'>
                  <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                    <div className='flex h-full flex-col overflow-hidden bg-input/10 py-6 shadow-xl'>
                      <div className='px-4 sm:px-6'>
                        <div className='flex items-start justify-between'>
                          <Dialog.Title className='text-base font-semibold leading-6 text-text'>
                            Dashboard
                          </Dialog.Title>
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className='rounded-md bg-text text-cta hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2'
                              onClick={() => setOpen(false)}>
                              <span className='sr-only'>Close panel</span>
                              <X className='h-7 w-7' aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                        {/* Content */}

                        {friends.length > 0 ? (
                          <div className='text-xs font-semibold leading-6 text-text-sec'>
                            Your chats
                          </div>
                        ) : null}

                        <nav className='flex flex-1 flex-col'>
                          <ul
                            role='list'
                            className='flex flex-1 flex-col gap-y-7'>
                            <li>
                              <SidebarChatList
                                friends={friends}
                                sessionId={session.user.id}
                              />
                            </li>

                            <li>
                              <div className='text-xs font-semibold leading-6 text-text-sec'>
                                Overview
                              </div>
                              <ul role='list' className='-mx-2 mt-2 space-y-1'>
                                {sidebarOptions.map((option) => {
                                  return (
                                    <li key={option.name}>
                                      <Link
                                        href={option.href}
                                        className='text-text hover:text-cta hover:bg-input/30 group flex gap-3 rounded-md p-2 text-sm leading-6 tracking-wide font-semibold items-center justify-start '>
                                        <span className='text-cta bg-white group-hover:text-cta flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[1rem] font-medium'>
                                          <UserPlus className='h-6 w-6' />
                                        </span>
                                        <span className='truncate'>
                                          {option.name}
                                        </span>
                                      </Link>
                                    </li>
                                  )
                                })}

                                <li>
                                  <FriendRequestSidebarOption
                                    initialUnseenRequestCount={
                                      unseenRequestCount
                                    }
                                    sessionId={session.user.id}
                                  />
                                </li>
                              </ul>
                            </li>

                            <li className='-ml-6 mt-auto flex items-center'>
                              <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-text'>
                                <div className='relative h-8 w-8 '>
                                  <Image
                                    fill
                                    referrerPolicy='no-referrer'
                                    className='rounded-full'
                                    src={session.user.image || ''}
                                    alt='Your profile picture'
                                  />
                                </div>

                                <span className='sr-only'>Your profile</span>
                                <div className='flex flex-col'>
                                  <span aria-hidden='true'>
                                    {session.user.name}
                                  </span>
                                  <span
                                    className='text-xs text-zinc-400'
                                    aria-hidden='true'>
                                    {session.user.email}
                                  </span>
                                </div>
                              </div>

                              <SignoutButton className='h-full aspect-square' />
                            </li>
                          </ul>
                        </nav>

                        {/* content end */}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default MobileChatLayout