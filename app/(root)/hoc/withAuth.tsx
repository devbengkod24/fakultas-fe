/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/context/profileUseContext";
import { AuthService } from "@/api";
import { SITE_COOKIES, EWS_ALLOWED_ROLES } from "@/lib/constant";

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredPermission?: string,
  requiredRole?: string | string[],
) => {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const { profile, setProfile } = useProfile();
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
      const token = getCookie(SITE_COOKIES.TOKEN);

      if (!token) {
        router.replace("/login");
        return;
      }

      const validatePermissions = (user: any) => {
        console.log("role:", user.roles, "requiredRole:", requiredRole);
      if (requiredPermission === "ews") {
        return (EWS_ALLOWED_ROLES as readonly string[]).includes(user.roles);
      }

      if (
        requiredPermission &&
        !user.permissions?.includes(requiredPermission)
      ) {
        return false;
      }

      if (requiredRole) {
        const userRole = user.roles;

        if (Array.isArray(requiredRole)) {
          return requiredRole.includes(userRole);
        } else {
          return userRole === requiredRole;
        }
      }

      return true;
    };

      if (profile) {
        const isValid = validatePermissions(profile);
        setHasPermission(isValid);
        setIsLoading(false);

        if (!isValid) {
          router.replace("/unauthorized");
          return;
        }

        return;
      }

      const fetchProfile = async () => {
        try {
          const response = await AuthService.getProfile();
          const responseData = response?.data ?? null;

          if (!responseData) {
            // No profile data returned, treat as unauthenticated
            console.error("AuthService.getProfile returned no data", response);
            router.replace("/login");
            return;
          }

          const { user, mahasiswa, daftar_prodi } = responseData;

          if (!user) {
            // If data structure is present but missing user, redirect to login
            console.error("Profile response missing user field", responseData);
            router.replace("/login");
            return;
          }

          const profileData = {
            ...user,
            roles: user.roles,
            ...(mahasiswa && { mahasiswa }),
            ...(daftar_prodi && { daftar_prodi }),
          };

          setProfile(profileData);

          const isValid = validatePermissions(profileData);
          setHasPermission(isValid);

          if (!isValid) {
            router.replace("/unauthorized");
            return;
          }

          if (
            (user.permissions?.includes("tugas-akhir") ||
              user.permissions?.includes("kerja-praktek")) &&
            mahasiswa?.is_completed === false
          ) {
            router.replace("/onboarding");
            return;
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          router.replace("/login");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, requiredPermission, requiredRole, setProfile, profile]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!hasPermission) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
