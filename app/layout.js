import './globals.css'

export const metadata = {
  title: 'Headshot Hero - Professional AI Headshots',
  description: 'Transform your photos into professional headshots with AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
