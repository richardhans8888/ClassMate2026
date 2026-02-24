export default function GuidelinesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Community Guidelines
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        We are committed to creating a safe, inclusive, and productive learning
        environment for everyone.
      </p>

      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Respect & Kindness
          </h2>
          <p>
            Treat all members with respect. Harassment, hate speech, and
            bullying are strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Academic Integrity
          </h2>
          <p>
            ClassMate is for learning, not cheating. Do not ask for or provide
            answers to exam questions or plagiarize work.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Safety & Privacy
          </h2>
          <p>
            Protect your personal information and respect the privacy of others.
            Do not share contact details in public forums.
          </p>
        </section>
      </div>
    </div>
  );
}
