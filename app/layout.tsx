import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from './components/providers/AuthProvider'
import Navigation from './components/navigation/Navigation'

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
            <Navigation />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}