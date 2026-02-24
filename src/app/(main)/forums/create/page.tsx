import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateForumPostPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/forums"
        className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Forums
      </Link>

      <div className="bg-white p-8 rounded-xl border shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Create New Discussion
        </h1>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="What's your question or topic?"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                <option value="math">Mathematics</option>
                <option value="cs">Computer Science</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="history">History</option>
                <option value="literature">Literature</option>
                <option value="languages">Languages</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                placeholder="e.g., calculus, homework, derivatives"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              rows={8}
              placeholder="Describe your question or discussion topic in detail..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
            <p className="text-xs text-gray-500 mt-2">Markdown is supported.</p>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link href="/forums">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Post Discussion</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
