"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function PublicAuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!loading && isMounted) {
            // These paths do not require authentication
            const publicPaths = ["/", "/user-login", "/login", "/signup", "/map", "/track", "/ward-performance"];
            const isPublicPath = publicPaths.includes(pathname) || pathname.startsWith("/track/");
            // These paths have their own authentications/guards
            const isOfficerOrAdminRoute = pathname.startsWith("/officer") || pathname.startsWith("/department") || pathname.startsWith("/councillor") || pathname.startsWith("/commissioner");

            if (!user && !isPublicPath && !isOfficerOrAdminRoute) {
                router.replace("/user-login");
            }
        }
    }, [user, loading, pathname, router, isMounted]);

    if (!isMounted || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-slate-50">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const publicPaths = ["/", "/user-login", "/login", "/signup", "/map", "/track", "/ward-performance"];
    const isPublicPath = publicPaths.includes(pathname) || pathname.startsWith("/track/");
    const isOfficerOrAdminRoute = pathname.startsWith("/officer") || pathname.startsWith("/department") || pathname.startsWith("/councillor") || pathname.startsWith("/commissioner");

    // If waiting for redirect, render nothing
    if (!user && !isPublicPath && !isOfficerOrAdminRoute) {
        return null;
    }

    return <>{children}</>;
}
