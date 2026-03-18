import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eid Order Tracker 2025",
  description: "Modern order management system for Eid celebrations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.className} overflow-x-hidden`}>
        {children}
        <Toaster
          position="bottom-right"
          richColors={false}
          theme="dark"
          closeButton={true}
          toastOptions={{
            style: {
              background: 'hsl(var(--card) / 0.85)',
              border: '1px solid hsl(var(--border) / 0.5)',
              color: 'hsl(var(--muted-foreground))',
              fontWeight: '400',
              fontSize: '0.875rem',
              padding: '0.75rem 1rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            className: 'toast-custom',
          }}
        />
      </body>
    </html>
  );
}
