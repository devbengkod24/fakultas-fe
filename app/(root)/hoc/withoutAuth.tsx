"use client";

import { ComponentType, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import { SITE_COOKIES } from "@/lib/constant";
import { AuthService } from "@/api";

type WithoutAuthProps = {
  children?: ReactNode;
};

const withoutAuth = <P extends WithoutAuthProps>(
  WrappedComponent: ComponentType<P>
) => {
  return function WithoutAuthComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const token = getCookie(SITE_COOKIES.TOKEN);

    useEffect(() => {
      if (token) {
        console.log("Get Token");
        const fetchProfile = async () => {
          try {
            const response = await AuthService.getProfile();
            if (response.success == true) {
              const user = response.data.user;
              if (user.permissions.includes("sti")) {
                router.push("/admin");
              }
              router.push(user.permissions[0]);
            } else {
              router.push("/login");
            }
          } catch (error) {
            console.error("Failed to fetch profile:", error);
            router.push("/login");
          } finally {
            setIsLoading(false);
          }
        };

        fetchProfile();
      } else {
        setIsLoading(false);
      }
    }, [token, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withoutAuth;
