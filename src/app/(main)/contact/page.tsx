export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Contact Us
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Have questions or feedback? We'd love to hear from you.
      </p>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Message
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-32"
            placeholder="How can we help?"
          ></textarea>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
          Send Message
        </button>
      </form>
    </div>
  );
}
