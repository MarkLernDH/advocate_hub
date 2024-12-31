import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from './components/providers/AuthProvider'
import Navigation from './components/navigation/Navigation'
import { Suspense } from 'react'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

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
            <Navigation />
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}