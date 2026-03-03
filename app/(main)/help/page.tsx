export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Help Center
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Find answers to common questions and learn how to get the most out of
        ClassMate.
      </p>

      <div className="grid gap-6">
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
            Getting Started
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Learn the basics of setting up your account and finding your first
            study group.
          </p>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
            Tutors & Sessions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            How to book tutors, join sessions, and manage your schedule.
          </p>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
            Account & Billing
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your subscription, payment methods, and account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
