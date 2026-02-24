import { Button } from "@/components/ui/Button";
import { UserPlus } from "lucide-react";

export default function TutorRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A]">
      <div className="max-w-xl mx-auto px-6 py-10">
        <div className="bg-white dark:bg-[#0F1117] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-600 text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Tutor Registration
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Fill out the form below to apply for tutor access. We review
            applications within 48 hours.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500">Full Name</label>
              <input className="w-full mt-1 bg-[#15181E] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Primary Subject</label>
                <input className="w-full mt-1 bg-[#15181E] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-500">
                  Years Experience
                </label>
                <input
                  type="number"
                  className="w-full mt-1 bg-[#15181E] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Bio</label>
              <textarea
                rows={4}
                className="w-full mt-1 bg-[#15181E] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline">Cancel</Button>
            <Button>Submit Application</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
