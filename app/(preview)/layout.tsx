import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { ThemeToggle } from "@/components/theme-toggle";
import { SocialLinks } from "@/components/social-links";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-pdf-support.vercel.app"),
  title: "PDF Support Preview",
  description: "Experimental preview of PDF support with the AI SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.className}`}>
      <body>
        <ThemeProvider attribute="class" enableSystem>
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <SocialLinks />
          <Toaster position="top-center" richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
