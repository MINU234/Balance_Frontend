import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "밸런스 게임 - 선택의 재미",
  description: "친구들과 함께 즐기는 밸런스 게임! 당신의 선택을 공유하고 비교해보세요.",
  keywords: ["밸런스게임", "선택게임", "친구", "비교", "재미"],
  authors: [{ name: "Balance Game Team" }],
  openGraph: {
    title: "밸런스 게임 - 선택의 재미",
    description: "친구들과 함께 즐기는 밸런스 게임! 당신의 선택을 공유하고 비교해보세요.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "밸런스 게임 - 선택의 재미",
    description: "친구들과 함께 즐기는 밸런스 게임! 당신의 선택을 공유하고 비교해보세요.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main>
                {children}
              </main>
              <Toaster />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
