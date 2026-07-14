import "./globals.css";
import AppShell from "@/components/layout/AppShell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex bg-background text-foreground overflow-x-hidden">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}