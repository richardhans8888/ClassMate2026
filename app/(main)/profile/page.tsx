'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import {
  Share2,
  MapPin,
  GraduationCap,
  History,
  BookOpen,
  PenTool,
  Loader2,
  Users,
} from 'lucide-react'
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
  const [connectionCount, setConnectionCount] = useState(0)
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
    Promise.all([
      fetch(`/api/user/profile?userId=${userId}`).then((r) => r.json()),
      fetch(`/api/connections/count`).then((r) => r.json()),
    ])
      .then(([profileData, countData]) => {
        if (profileData.profile) setProfile(profileData.profile as ProfileData)
        if (typeof countData.count === 'number') setConnectionCount(countData.count)
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
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground min-h-screen px-6 py-4 transition-colors duration-300 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Profile Header Card */}
        <div className="border-border bg-card relative overflow-hidden rounded-3xl border p-6 shadow-sm md:p-8">
          <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20">
            <GraduationCap className="text-muted-foreground h-32 w-32" />
          </div>

          <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row md:items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="bg-primary h-32 w-32 rounded-full p-1">
                <div className="bg-card h-full w-full rounded-full p-1">
                  <Image
                    src={
                      profile?.avatarUrl ??
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`
                    }
                    alt={displayName}
                    width={128}
                    height={128}
                    className="bg-muted h-full w-full rounded-full"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-foreground mb-2 text-3xl font-bold">{displayName}</h1>
                <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                  {major && (
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4" />
                      {major}
                    </div>
                  )}
                  {university && (
                    <>
                      <div className="bg-muted-foreground h-1 w-1 rounded-full" />
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {university}
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>
                      {connectionCount} connection{connectionCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {profile?.bio && <p className="text-muted-foreground text-sm">{profile.bio}</p>}

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
                  onClick={openEdit}
                >
                  <PenTool className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="border-border bg-card text-foreground hover:bg-muted rounded-full"
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
              <h2 className="text-foreground mb-4 flex items-center gap-2 text-lg font-bold">
                <BookOpen className="text-primary h-5 w-5" />
                Enrolled Courses
              </h2>
              <div className="border-border bg-card rounded-2xl border border-dashed p-8 text-center shadow-sm">
                <p className="text-muted-foreground text-sm">No courses enrolled yet.</p>
              </div>
            </div>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div>
              <h2 className="text-foreground mb-4 flex items-center gap-2 text-lg font-bold">
                <History className="text-primary h-5 w-5" />
                Recent Activity
              </h2>
              <div className="border-border bg-card rounded-3xl border border-dashed p-5 text-center shadow-sm">
                <p className="text-muted-foreground text-sm">No recent activity.</p>
              </div>
            </div>

            {/* Active Study Groups */}
            <div>
              <h2 className="text-muted-foreground mb-4 text-xs font-bold tracking-wider uppercase">
                Active Study Groups
              </h2>
              <div className="border-border bg-card rounded-3xl border border-dashed shadow-sm">
                <div className="p-5 text-center">
                  <p className="text-muted-foreground text-sm">Not in any groups yet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="border-border bg-card border sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Profile</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update your public profile information.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">Display Name</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your display name"
                className="border-border bg-muted text-foreground h-10 w-full rounded-lg border px-3 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">University</label>
              <input
                value={editUniversity}
                onChange={(e) => setEditUniversity(e.target.value)}
                placeholder="e.g., BINUS University"
                className="border-border bg-muted text-foreground h-10 w-full rounded-lg border px-3 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">Major</label>
              <input
                value={editMajor}
                onChange={(e) => setEditMajor(e.target.value)}
                placeholder="e.g., Computer Science"
                className="border-border bg-muted text-foreground h-10 w-full rounded-lg border px-3 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs">Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="A short bio about yourself"
                className="border-border bg-muted text-foreground min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                className="border-border rounded-lg"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
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
