'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { MaterialCard } from 'components/features/materials/MaterialCard'
import { Search, Filter, Upload, Download } from 'lucide-react'

interface MaterialApiItem {
  id: string
  title: string
  description: string | null
  fileUrl: string
  subject: string
  fileType: string | null
  downloads: number
  rating: number
  createdAt: string
  user: {
    email: string
    profile: {
      displayName: string | null
    } | null
  }
}

type SortOption = 'downloads' | 'createdAt' | 'rating'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'downloads', label: 'Most Popular' },
  { value: 'createdAt', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
]

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<MaterialApiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All Subjects')
  const [selectedType, setSelectedType] = useState('All Types')
  const [sortBy, setSortBy] = useState<SortOption>('downloads')

  async function loadMaterials(activeSortBy: SortOption, activeSubject?: string) {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('sortBy', activeSortBy)
      if (activeSubject && activeSubject !== 'All Subjects') {
        params.set('subject', activeSubject)
      }

      const response = await fetch(`/api/materials?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to load materials')
      }

      const data = (await response.json()) as { materials: MaterialApiItem[] }
      setMaterials(Array.isArray(data.materials) ? data.materials : [])
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load materials')
      setMaterials([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadMaterials(sortBy, selectedSubject)
  }, [sortBy, selectedSubject])

  const filteredMaterials = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()

    return materials.filter((material) => {
      const matchesSearch =
        !normalizedSearch ||
        material.title.toLowerCase().includes(normalizedSearch) ||
        material.subject.toLowerCase().includes(normalizedSearch) ||
        (material.description ?? '').toLowerCase().includes(normalizedSearch)

      const matchesType =
        selectedType === 'All Types' ||
        (material.fileType ?? 'unknown').toLowerCase() === selectedType.toLowerCase()

      return matchesSearch && matchesType
    })
  }, [materials, search, selectedType])

  async function handleDownload(materialId: number | string) {
    const response = await fetch(`/api/materials/${materialId}/download`, {
      method: 'POST',
    })

    if (!response.ok) {
      setError('Unable to download this material right now.')
      return
    }

    const data = (await response.json()) as { downloadUrl?: string }
    if (data.downloadUrl) {
      window.open(data.downloadUrl, '_blank', 'noopener,noreferrer')
      setMaterials((current) =>
        current.map((item) =>
          item.id === String(materialId) ? { ...item, downloads: item.downloads + 1 } : item
        )
      )
    }
  }

  const dynamicSubjects = Array.from(new Set(materials.map((material) => material.subject))).sort()
  const dynamicTypes = Array.from(
    new Set(materials.map((material) => (material.fileType ?? 'Unknown').toUpperCase()))
  ).sort()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Materials</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Share and discover resources to boost your learning.
          </p>
        </div>
        <Link href="/materials/upload">
          <Button className="rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            <Upload className="mr-2 h-4 w-4" />
            Upload Material
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="relative mb-4">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-9 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-3 flex items-center font-semibold text-gray-900 dark:text-white">
                  <Filter className="mr-2 h-4 w-4" />
                  Subject
                </h3>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {['All Subjects', ...dynamicSubjects].map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="subject"
                        id={`subject-${subject}`}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedSubject === subject}
                        onChange={() => setSelectedSubject(subject)}
                      />
                      <label
                        htmlFor={`subject-${subject}`}
                        className="cursor-pointer text-sm text-gray-700 select-none dark:text-gray-300"
                      >
                        {subject}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">File Type</h3>
                <div className="space-y-2">
                  {['All Types', ...dynamicTypes].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="type"
                        id={`type-${type}`}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedType === type}
                        onChange={() => setSelectedType(type)}
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="cursor-pointer text-sm text-gray-700 select-none dark:text-gray-300"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-green-100 bg-green-50 p-5">
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-900">Top Contributors</h3>
            </div>
            <ul className="mt-3 space-y-3">
              <li className="flex justify-between text-sm">
                <span className="text-green-800">Sarah Chen</span>
                <span className="font-medium text-green-700">12 uploads</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-green-800">Mike Ross</span>
                <span className="font-medium text-green-700">8 uploads</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-green-800">Jessica Pearson</span>
                <span className="font-medium text-green-700">6 uploads</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing{' '}
              <span className="font-medium text-gray-900 dark:text-white">
                {filteredMaterials.length}
              </span>{' '}
              resources
            </div>
            <select
              className="rounded-md border-gray-300 bg-white text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              Loading materials...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && filteredMaterials.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              No materials found for the current filters.
            </div>
          )}

          {!loading && !error && filteredMaterials.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredMaterials.map((material) => (
                <MaterialCard
                  key={material.id}
                  id={material.id}
                  title={material.title}
                  author={material.user.profile?.displayName || material.user.email}
                  subject={material.subject}
                  type={(material.fileType || 'unknown').toUpperCase()}
                  rating={material.rating}
                  downloads={material.downloads}
                  uploadedAt={formatDistanceToNow(new Date(material.createdAt), {
                    addSuffix: true,
                  })}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Button variant="outline" className="rounded-lg">
              Load More Resources
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
