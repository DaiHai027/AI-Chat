"use client";
import dynamic from "next/dynamic";
import { MainLayout } from "@/components/main-layout";
import "@/styles/globals.css";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { NextTopLoaderProps } from "nextjs-toploader"; // Ensure types are imported if needed
import { UserProvider, useUser } from "@/contexts/userContext"; // Import UserProvider and useUser

// Dynamically import NextTopLoader without server-side rendering
const DynamicTopLoader = dynamic(
  () =>
    import("nextjs-toploader").then((mod) => mod.default) as Promise<
      React.ComponentType<NextTopLoaderProps>
    >,
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <UserProvider>
      <html lang="en">
        <head>
          <script src="https://apis.google.com/js/platform.js" async defer></script>
        </head>
        <body className="scroll-smooth">
          <DynamicTopLoader color="#d97706" showSpinner={false} speed={300} />
          <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}>
            <MainLayout>
              <AuthRedirect /> {/* Include the redirect logic here */}
              {children}
            </MainLayout>
          </GoogleOAuthProvider>
        </body>
      </html>
    </UserProvider>
  );
}


const AuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  useEffect(() => {
    if (user && pathname === "/") {
      router.replace("/chat");
    } else if (!user && pathname === "/chat") {
      router.replace("/");
    }
  }, [pathname, user, router]);

  return null; // This component doesn't render anything
};