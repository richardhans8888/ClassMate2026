import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-border bg-background mt-auto border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-primary mb-4 text-lg font-bold">ClassMate</h3>
            <p className="text-muted-foreground text-sm">
              Connecting students to learn together, share knowledge, and succeed.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Platform</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/forums" className="hover:text-primary">
                  Forums
                </Link>
              </li>
              <li>
                <Link href="/groups" className="hover:text-primary">
                  Study Groups
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/help" className="hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-primary">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Legal</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-border text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
          © {new Date().getFullYear()} ClassMate. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
