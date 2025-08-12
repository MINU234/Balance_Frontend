import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
// import { Toaster } from "@/components/ui/sonner"; // sonner 설치 후 사용

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Balance Game",
    description: "Create and share your own balance game collections.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
        <body className={inter.className}>
            <AuthProvider>
                {children}
                {/* <Toaster /> sonner 설치 후 사용 */}
            </AuthProvider>
        </body>
        </html>
    );
}
