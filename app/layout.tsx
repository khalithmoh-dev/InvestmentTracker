import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Investracker - Investment Tracker',
  description: 'Track your investments in Gold, Stocks, Crypto, and Cash',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

