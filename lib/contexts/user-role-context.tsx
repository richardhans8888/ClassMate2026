'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { UserRole } from '@/lib/navigation'

interface UserRoleContextValue {
  role: UserRole | null
  isLoaded: boolean
  isAdmin: boolean
  isModerator: boolean
  userId: string | null
  userName: string | null
  userEmail: string | null
  userImage: string | null
}

const UserRoleContext = createContext<UserRoleContextValue>({
  role: null,
  isLoaded: false,
  isAdmin: false,
  isModerator: false,
  userId: null,
  userName: null,
  userEmail: null,
  userImage: null,
})

export function useUserRole(): UserRoleContextValue {
  return useContext(UserRoleContext)
}

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userImage, setUserImage] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/user/me')
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (
          data: {
            role?: string
            id?: string
            avatarUrl?: string
            image?: string
            name?: string
            email?: string
          } | null
        ) => {
          if (!data) return
          if (data.role) setRole(data.role as UserRole)
          setUserId(data.id ?? null)
          setUserImage(data.avatarUrl ?? data.image ?? null)
          setUserName(data.name ?? null)
          setUserEmail(data.email ?? null)
        }
      )
      .catch((err: unknown) => {
        console.error('[UserRoleProvider] Failed to fetch user:', err)
      })
      .finally(() => {
        setIsLoaded(true)
      })
  }, [])

  return (
    <UserRoleContext.Provider
      value={{
        role,
        isLoaded,
        isAdmin: role === 'ADMIN',
        isModerator: role === 'MODERATOR' || role === 'ADMIN',
        userId,
        userName,
        userEmail,
        userImage,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  )
}
