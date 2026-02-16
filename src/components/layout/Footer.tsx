import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-blue-600 mb-4">EduConnect</h3>
            <p className="text-sm text-gray-500">
              Connecting students to learn together, share knowledge, and succeed.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/forums" className="hover:text-blue-600">Forums</Link></li>
              <li><Link href="/tutors" className="hover:text-blue-600">Find Tutors</Link></li>
              <li><Link href="/materials" className="hover:text-blue-600">Study Materials</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/help" className="hover:text-blue-600">Help Center</Link></li>
              <li><Link href="/guidelines" className="hover:text-blue-600">Community Guidelines</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} EduConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
