'use client'
import React from 'react'
import Link from 'next/link'
import { AiFillBug } from 'react-icons/ai'
import { usePathname } from 'next/navigation'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import { Avatar, Box, Container, DropdownMenu, Text, Flex } from '@radix-ui/themes'
import  { Skeleton } from '@/app/components'

const NavBar = () => {

  return (
    <nav className='border-b mb-5 px-5 py-3'>
        <Container>
            <Flex justify="between">
                <Flex align="center" gap="2">
                <Link href="/">
                    <AiFillBug />
                </Link>
                    <NavLinks />
                </Flex>
                <AuthStatus />
            </Flex>
        </Container>
    </nav>
  )
}

const NavLinks = () => {
    const currentPath = usePathname();
    const  { status, data: session } = useSession();

    const links = [
       { label: "Dashboard", href: "/"},
       { label: "Issues", href: "/issues/list"}
    ]
    return (
        <ul className="flex space-x-6">
        {links.map(link =>
        <li key={link.href}>
            <Link
                className={classNames({
                    'nav-link': true,
                    '!text-zinc-900': link.href === currentPath,
                })}
                href={link.href}>{link.label}
            </Link>
        </li>
        )}
    </ul>
    )
}
const AuthStatus = () => {
    const { status, data: session } = useSession();
    if (status === 'loading') {
        return <Skeleton width="3rem"/>
    }

    if (status === 'unauthenticated') {
        return <Link className='nav-link' href="/api/auth/signin">Log in</Link>
    }
    return (
    <Box>
        { status === 'authenticated' && (
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Avatar
                        src={session?.user?.image!}
                        fallback='?'
                        size='2'
                        radius='full'
                        className='cursor-pointer'
                        referrerPolicy='no-referrer'
                    />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Label>
                        <Text>
                            <a href={`mailto:${session?.user?.email!}`}>{session?.user?.email!}</a>
                        </Text>
                    </DropdownMenu.Label>
                    <DropdownMenu.Item>
                        <Link href="/api/auth/signout">Log out</Link>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        ) }
    </Box>
    )

}

export default NavBar