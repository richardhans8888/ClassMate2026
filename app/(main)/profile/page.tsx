'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Share2, MapPin, GraduationCap, History, BookOpen, PenTool, Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type ProfileData = {
  id: string
  name: string | null
  email: string
  displayName: string | null
  bio: string | null
  university: string | null
  major: string | null
  avatarUrl: string | null
}

export default function ProfilePage() {
  const { data: session } = authClient.useSession()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editUniversity, setEditUniversity] = useState('')
  const [editMajor, setEditMajor] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const userId = session?.user?.id
    if (!userId) {
      setLoading(false)
      return
    }
    fetch(`/api/user/profile?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) setProfile(data.profile as ProfileData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [session?.user?.id])

  function openEdit() {
    if (!profile) return
    setEditName(profile.displayName ?? profile.name ?? '')
    setEditBio(profile.bio ?? '')
    setEditUniversity(profile.university ?? '')
    setEditMajor(profile.major ?? '')
    setEditOpen(true)
  }

  async function handleSave() {
    const userId = session?.user?.id
    if (!userId) return
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          displayName: editName || undefined,
          bio: editBio || undefined,
          university: editUniversity || undefined,
          major: editMajor || undefined,
        }),
      })
      const data = await res.json()
      if (data.profile) {
        setProfile((prev) => (prev ? { ...prev, ...(data.profile as ProfileData) } : prev))
      }
      setEditOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const displayName = profile?.displayName ?? profile?.name ?? session?.user?.name ?? 'Unknown'
  const university = profile?.university ?? null
  const major = profile?.major ?? null
  const avatarSeed = encodeURIComponent(displayName)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#05050A]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-900 transition-colors duration-300 md:p-8 dark:bg-[#05050A] dark:text-gray-200">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Profile Header Card */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-gray-800/50 dark:bg-[#0F1117]">
          <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20">
            <GraduationCap className="h-32 w-32 text-gray-400 dark:text-gray-500" />
          </div>

          <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row md:items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                <div className="h-full w-full rounded-full bg-white p-1 dark:bg-[#15171E]">
                  <Image
                    src={
                      profile?.avatarUrl ??
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`
                    }
                    alt={displayName}
                    width={128}
                    height={128}
                    className="h-full w-full rounded-full bg-[#FFD6A5]"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {displayName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {major && (
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4" />
                      {major}
                    </div>
                  )}
                  {university && (
                    <>
                      <div className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-600" />
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {university}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {profile?.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  className="rounded-full bg-blue-600 px-6 text-white hover:bg-blue-500"
                  onClick={openEdit}
                >
                  <PenTool className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-[#1E2028] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column (2/3) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Enrolled Courses */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                Enrolled Courses
              </h2>
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-[#0F1117]">
                <p className="text-sm text-gray-500">No courses enrolled yet.</p>
              </div>
            </div>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <History className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                Recent Activity
              </h2>
              <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-[#0F1117]">
                <p className="text-sm text-gray-500">No recent activity.</p>
              </div>
            </div>

            {/* Active Study Groups */}
            <div>
              <h2 className="mb-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                Active Study Groups
              </h2>
              <div className="rounded-3xl border border-dashed border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[#0F1117]">
                <div className="p-5 text-center">
                  <p className="text-sm text-gray-500">Not in any groups yet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="border border-gray-200 bg-white sm:max-w-[480px] dark:border-gray-800 dark:bg-[#0F1117]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Edit Profile</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Update your public profile information.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Display Name</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your display name"
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 dark:border-white/10 dark:bg-[#0E141E] dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">University</label>
              <input
                value={editUniversity}
                onChange={(e) => setEditUniversity(e.target.value)}
                placeholder="e.g., BINUS University"
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 dark:border-white/10 dark:bg-[#0E141E] dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Major</label>
              <input
                value={editMajor}
                onChange={(e) => setEditMajor(e.target.value)}
                placeholder="e.g., Computer Science"
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 dark:border-white/10 dark:bg-[#0E141E] dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="A short bio about yourself"
                className="min-h-[80px] w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-[#0E141E] dark:text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                className="rounded-lg border-gray-200 dark:border-white/10"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-lg bg-blue-600 text-white hover:bg-blue-500"
                onClick={handleSave}
                disabled={saving}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
