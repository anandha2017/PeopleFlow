import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PeopleFlow | People & Organisation Management",
  description:
    "Operational cockpit for people, organisational structure, hiring, and employee lifecycle management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
