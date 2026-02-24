export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: February 2026</p>

      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <p>
          At ClassMate, we take your privacy seriously. This policy describes
          how we collect, use, and protect your personal information.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
          Information We Collect
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Account information (name, email, profile details)</li>
          <li>Usage data (learning progress, forum activity)</li>
          <li>Communication data (messages with tutors and peers)</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
          How We Use Your Data
        </h2>
        <p>
          We use your data to provide personalized learning experiences, improve
          our platform, and facilitate connections between students and tutors.
        </p>
      </div>
    </div>
  );
}
