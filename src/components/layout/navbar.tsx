import Link from 'next/link'
import { Button } from '../ui/button'

export function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <img className="h-30 w-auto" src="../logo.png" alt="logo" />
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/features"
                className="text-gray-500 hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-gray-500 hover:text-gray-900"
              >
                Pricing
              </Link>
            </nav>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
