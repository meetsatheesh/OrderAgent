import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Local SLM Benchmark | Ollama",
  description: "Advanced local model benchmarking and comparison dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="main-layout">
          <header className="header glass">
            <div className="container flex-between">
              <div className="logo">
                <span className="logo-icon">●</span>
                <span className="logo-text">SLM<span style={{ color: 'var(--primary)' }}>Bench</span></span>
              </div>
              <nav>
                <div className="badge badge-success">Offline Mode</div>
              </nav>
            </div>
          </header>
          <main className="container">
            {children}
          </main>
          <footer className="footer">
            <div className="container flex-center">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                &copy; 2026 Local SLM App • Built for Privacy and Performance
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
