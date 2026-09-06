'use client'

import { AuthService } from "@/api";
import { useProfile } from "@/context/profileUseContext";
import { SITE_COOKIES } from "@/lib/constant";
import { setCookie } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function CallbackGoogleContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const jwtToken = searchParams.get("jwt_token");
    const { setProfile } = useProfile();

    useEffect(() => {
        const handleCallback = async () => {
            setCookie(SITE_COOKIES.TOKEN, jwtToken, {
                maxAge: 30 * 24 * 60 * 60, // 30 days
                secure: true,
                sameSite: "lax",
                path: "/",
            });
            const response = await AuthService.getProfile();
            if (response.success) {
                setProfile(response.data.user);
            }
            if(response.data.user.permissions.length === 1) {
                router.replace(response.data.user.permissions[0]);
            } else if (response.data.user.permissions.includes("sti")) {
                router.replace("/admin");
            } else {
                router.replace("/apps");
            }
        };

        handleCallback();
    }, [jwtToken, setProfile, router]);

    return null;
}

export default function CallbackGooglePage() {
    return (
        <Suspense fallback={null}>
            <CallbackGoogleContent />
        </Suspense>
    );
}