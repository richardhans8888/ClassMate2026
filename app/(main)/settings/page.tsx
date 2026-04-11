'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type ProfileData = {
  name: string | null
  displayName: string | null
  bio: string | null
  university: string | null
  major: string | null
}

export default function SettingsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [university, setUniversity] = useState('')
  const [major, setMajor] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/user/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((me) => {
        if (!me) return
        setUserId(me.id as string)
        return fetch(`/api/user/profile?userId=${me.id as string}`)
      })
      .then((r) => (r && r.ok ? r.json() : null))
      .then((data) => {
        if (data?.profile) {
          const p = data.profile as ProfileData
          setDisplayName(p.displayName ?? p.name ?? '')
          setBio(p.bio ?? '')
          setUniversity(p.university ?? '')
          setMajor(p.major ?? '')
        }
      })
      .catch(console.error)
  }, [])

  async function handleSaveProfile() {
    if (!userId) return
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
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

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-12 py-6 md:px-16">
      <h1 className="text-2xl font-bold">Settings</h1>

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
    </div>
  )
}
