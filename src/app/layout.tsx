import Providers from '@/Components/Providers'
import './globals.css'

export const metadata = {
  title: 'Chatnik'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
        {children}
        </Providers>
        </body>
    </html>
  )
}
