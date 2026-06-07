import './globals.css';

export const metadata = {
  title: 'Crypto Intel Agent',
  description: 'AI Crypto Intelligence Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
