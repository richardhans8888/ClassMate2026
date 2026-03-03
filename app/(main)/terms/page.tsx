export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Terms of Service
      </h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: February 2026</p>

      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <p>
          Welcome to ClassMate. By using our platform, you agree to these terms.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
          User Responsibilities
        </h2>
        <p>
          You agree to use ClassMate for educational purposes only and to
          maintain academic integrity in all interactions.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
          Content Ownership
        </h2>
        <p>
          You retain rights to content you create, but grant ClassMate a license
          to display and distribute it on the platform.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
          Termination
        </h2>
        <p>
          We reserve the right to suspend accounts that violate our community
          guidelines or terms of service.
        </p>
      </div>
    </div>
  );
}
