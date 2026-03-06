import './globals.css';

export const metadata = {
  title: 'shapeit — grainy shape editor',
  description: 'Generate grainy gradient shapes. Stars, circles, hexagons and more. Export as PNG.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
