'use client'

import { useState, useEffect } from 'react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type ProfileData = {
  email: string
  name: string | null
  displayName: string | null
  bio: string | null
  university: string | null
  major: string | null
}

export default function SettingsPage() {
  const { data: session } = authClient.useSession()
  const [profile, setProfile] = useState<ProfileData | null>(null)

  // Profile form
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [university, setUniversity] = useState('')
  const [major, setMajor] = useState('')
  const [saving, setSaving] = useState(false)

  // Notification toggles
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [replyNotifications, setReplyNotifications] = useState(true)

  // Danger zone dialog
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    const userId = session?.user?.id
    if (!userId) return
    fetch(`/api/user/profile?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          const p = data.profile as ProfileData
          setProfile(p)
          setDisplayName(p.displayName ?? p.name ?? '')
          setBio(p.bio ?? '')
          setUniversity(p.university ?? '')
          setMajor(p.major ?? '')
        }
      })
      .catch(console.error)
  }, [session?.user?.id])

  async function handleSaveProfile() {
    const userId = session?.user?.id
    if (!userId) return
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          displayName: displayName || undefined,
          bio: bio || undefined,
          university: university || undefined,
          major: major || undefined,
        }),
      })
      if (res.ok) {
        toast.success('Profile saved')
      } else {
        toast.error('Failed to save profile')
      }
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  function handleSaveNotifications() {
    toast.success('Notification preferences saved')
  }

  function handleChangePassword() {
    toast.info('Password change coming soon')
  }

  async function handleSignOut() {
    await authClient.signOut()
    window.location.href = '/login'
  }

  function handleDeleteAccount() {
    setDeleteOpen(false)
    toast.info('Account deletion coming soon')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile */}
      <section className="space-y-4">
        <h2 className="border-b pb-2 text-lg font-semibold">Profile</h2>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="displayName">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="Your display name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="border-input bg-background focus:ring-ring w-full resize-none rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="Tell us about yourself"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="university">
              University
            </label>
            <input
              id="university"
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="Your university"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="major">
              Major
            </label>
            <input
              id="major"
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="Your major"
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? 'Saving…' : 'Save Profile'}
          </Button>
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-4">
        <h2 className="border-b pb-2 text-lg font-semibold">Notifications</h2>
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm">Email notifications</span>
            <button
              role="switch"
              aria-checked={emailNotifications}
              onClick={() => setEmailNotifications((v) => !v)}
              className={`focus:ring-ring relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                emailNotifications ? 'bg-primary' : 'bg-input'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm">Forum reply notifications</span>
            <button
              role="switch"
              aria-checked={replyNotifications}
              onClick={() => setReplyNotifications((v) => !v)}
              className={`focus:ring-ring relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                replyNotifications ? 'bg-primary' : 'bg-input'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  replyNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
          <Button variant="outline" onClick={handleSaveNotifications}>
            Save Preferences
          </Button>
        </div>
      </section>

      {/* Account */}
      <section className="space-y-4">
        <h2 className="border-b pb-2 text-lg font-semibold">Account</h2>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={profile?.email ?? session?.user?.email ?? ''}
              disabled
              className="border-input bg-muted text-muted-foreground w-full cursor-not-allowed rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleChangePassword}>
              Change Password
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4">
        <h2 className="text-destructive border-b pb-2 text-lg font-semibold">Danger Zone</h2>
        <div className="border-destructive/30 space-y-2 rounded-md border p-4">
          <p className="text-muted-foreground text-sm">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            Delete Account
          </Button>
        </div>
      </section>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action is permanent and cannot be
              undone. All your data will be removed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Yes, Delete My Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
