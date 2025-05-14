"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/api";

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(pathname || '') || 
                      (pathname || '').startsWith('/login') || 
                      (pathname || '').startsWith('/register');
  
  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = auth.isAuthenticated();
    
    // If not authenticated and trying to access a protected route
    if (!isAuthenticated && !isPublicPath) {
      router.replace('/login');
    }
    
    // If already authenticated and trying to access login/register
    if (isAuthenticated && isPublicPath) {
      router.replace('/');
    }
  }, [router, isPublicPath, pathname]);
  
  return <>{children}</>;
}