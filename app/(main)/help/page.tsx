export default function HelpPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">Help Center</h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
        Find answers to common questions and learn how to get the most out of ClassMate.
      </p>

      <div className="grid gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-[#1E293B]">
          <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Getting Started</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Learn the basics of setting up your account and finding your first study group.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-[#1E293B]">
          <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
            Tutors & Sessions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            How to book tutors, join sessions, and manage your schedule.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-[#1E293B]">
          <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Account Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Update your profile, privacy preferences, and account settings.
          </p>
        </div>
      </div>
    </div>
  )
}
