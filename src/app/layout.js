import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Event Management System",
  description: "Manage events and invitations with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "1rem",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Event Management
            </h1>
            <div>
              <a
                href="/admin"
                style={{
                  marginRight: "1rem",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Admin
              </a>
              <a
                href="/invitations"
                style={{ color: "white", textDecoration: "none" }}
              >
                Invitations
              </a>
            </div>
          </div>
        </nav>
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
