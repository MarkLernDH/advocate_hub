import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from './components/providers/AuthProvider'
import Link from 'next/link'
import AuthNav from './components/auth/AuthNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Advocacy Hub',
  description: 'Engage and reward your brand advocates',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex-shrink-0">
                    <Link href="/" className="text-2xl font-bold text-gray-900">
                      Advocacy Hub
                    </Link>
                  </div>
                  <div className="hidden sm:flex sm:items-center sm:space-x-8">
                    <Link 
                      href="/challenges" 
                      className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Challenges
                    </Link>
                    <Link 
                      href="/rewards" 
                      className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Rewards
                    </Link>
                    <Link 
                      href="/leaderboard" 
                      className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Leaderboard
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <AuthNav />
                  </div>
                </div>
              </div>
            </nav>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}