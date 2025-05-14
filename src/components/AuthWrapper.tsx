"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/api";

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for login and register paths, accounting for the /messenger prefix
  const isLoginPath = pathname?.includes('/login');
  const isRegisterPath = pathname?.includes('/register');
  const isPublicPath = isLoginPath || isRegisterPath;
  
  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = auth.isAuthenticated();
    
    // Handle redirects based on authentication status
    if (!isAuthenticated && !isPublicPath) {
      // If not authenticated and trying to access protected route
      const loginPath = pathname?.startsWith('/messenger') ? '/messenger/login' : '/login';
      router.replace(loginPath);
    } else if (isAuthenticated && isPublicPath) {
      // If authenticated and trying to access login/register
      const homePath = pathname?.startsWith('/messenger') ? '/messenger' : '/';
      router.replace(homePath);
    } else {
      // If no redirect needed, stop loading
      setIsLoading(false);
    }
  }, [router, isPublicPath, pathname]);
  
  // Show nothing while checking authentication or redirecting
  if (isLoading) {
    return null;
  }
  
  return <>{children}</>;
}