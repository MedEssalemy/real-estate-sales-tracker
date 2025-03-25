import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Track Your Real Estate</span>
                <span className="block text-primary-700">Sales With Ease</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                The complete solution for real estate agents and agencies to
                track sales, manage commissions, and analyze performance.
              </p>
              <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
                <div className="rounded-md shadow">
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-[--color-primary]"
                    >
                      Get started
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link href="/auth/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Log in
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-primary-700 font-semibold tracking-wide uppercase">
                Features
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to manage sales
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {/* Feature 1 */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Sales Tracking
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Easily record and manage all your property sales in one
                      place.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Commission Management
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Automatically calculate and track commissions for agents,
                      referrers, and partners.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Performance Analytics
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Gain insights into your sales performance with detailed
                      reports and dashboards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
