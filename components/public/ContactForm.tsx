'use client'

import { useState } from 'react'
import { CheckCircle, Send } from 'lucide-react'

type FormState = 'idle' | 'submitting' | 'success'

interface FormData {
  name: string
  email: string
  category: string
  message: string
}

const categories = [
  { value: 'general', label: 'General Enquiry' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'feedback', label: 'Feedback & Suggestions' },
  { value: 'partnership', label: 'Partnership' },
]

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    category: '',
    message: '',
  })

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.category) newErrors.category = 'Please select a category'
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setFormState('submitting')
    await new Promise((resolve) => setTimeout(resolve, 800))
    setFormState('success')
  }

  if (formState === 'success') {
    return (
      <div className="border-border bg-card flex flex-col items-center rounded-xl border p-8 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h3 className="text-foreground mb-2 text-base font-semibold">Message Sent!</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Thanks for reaching out. We&apos;ll get back to you within 1–2 business days.
        </p>
        <button
          onClick={() => {
            setFormState('idle')
            setFormData({ name: '', email: '', category: '', message: '' })
          }}
          className="text-muted-foreground hover:text-foreground mt-5 text-sm underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border-border bg-card space-y-4 rounded-xl border p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-foreground text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Your name"
            className={`border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-1 ${
              errors.name ? 'border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-foreground text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="you@example.com"
            className={`border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-1 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="category" className="text-foreground text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className={`border-border bg-background text-foreground focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-1 ${
            errors.category ? 'border-red-500 focus:ring-red-500' : ''
          }`}
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-foreground text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Tell us how we can help..."
          className={`border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-1 ${
            errors.message ? 'border-red-500 focus:ring-red-500' : ''
          }`}
        />
        {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={formState === 'submitting'}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {formState === 'submitting' ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}
