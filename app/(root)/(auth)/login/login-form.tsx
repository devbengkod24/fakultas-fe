"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import useSWRMutation from "swr/mutation";
import { AuthService } from "@/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/context/profileUseContext";
import { SITE_COOKIES } from "@/lib/constant";
import { Mail, Lock, EyeOff, Eye, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { handleToastResponse } from "@/lib/toast-response";
import Link from "next/link";

async function loginFetcher(
  _key: string,
  { arg }: { arg: { email: string; password: string } }
) {
  const response = await AuthService.login(arg);
  if (!response.success || !response.data.access_token) {
    throw new Error(response.message || "Login gagal, silahkan coba lagi.");
  }
  return response.data;
}

export function LoginForm() {
  const router = useRouter();
  const { setProfile } = useProfile();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { trigger, isMutating, error } = useSWRMutation("login", loginFetcher);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await trigger({ email, password });
      setCookie(SITE_COOKIES.TOKEN, data.access_token, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        secure: true,
        sameSite: "lax",
        path: "/",
      });

      setProfile({
        ...data.user,
      });

      if (data.user.permissions.includes("sti")) {
        router.replace("/admin");
        return;
      }

      if (data.user.permissions.length === 1) {
        const permission = data.user.permissions[0];
        const userRole = data.user.roles;

        if (permission === "fakultas") {
          if (userRole === "admin_fakultas") {
            router.replace("/admin-fakultas");
            return;
          }
          if (userRole === "super_fakultas") {
            router.replace("/fakultas");
            return;
          }
        }

        router.replace("/" + permission);
        return;
      }

      router.replace("/apps");

      handleToastResponse({ success: true, message: "Berhasil login!" });
    } catch {
      toast.error(error?.message || "Login gagal, silahkan coba lagi.");
    }
  };

  return (
    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
      <div>
        <div className="mb-8">
          <Link href={"/"} className="inline-flex items-center gap-3">
            <Image
              src={"/assets/landingpage/logo/logo-dinus.png"}
              alt="Logo STI"
              className="object-contain"
              width={70}
              height={7}
            />
            <div className="flex flex-col leading-tight font-extrabold uppercase tracking-wide text-[#114D91]">
              <span className="text-base sm:text-lg">UNIVERSITAS</span>
              <span className="text-base sm:text-lg">DIAN NUSWANTORO</span>
            </div>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Selamat datang di <span className="text-[#114D91]">FIK Apps</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Silahkan masuk untuk mengakses layanan dari website Fakultas Ilmu
            Komputer!
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1 relative group">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200"
            />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan alamat email"
              className="w-full pl-10 border-gray-200 focus:border-blue-600 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <div className="space-y-1 relative group">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200"
              />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-10 border-gray-200 focus:border-blue-600 transition-all duration-200"
              />
              <button
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-2/3 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#114D91] hover:bg-blue-700 text-base font-medium flex items-center justify-center space-x-2"
            disabled={isMutating}
          >
            {isMutating ? (
              <>
                <Loader2 className="animate-spin size-4 text-white" />
                <span>Logging in</span>
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-gray-200 w-full absolute"></div>
          <span className="bg-white px-4 text-xs text-gray-500 relative">
            Atau login dengan
          </span>
        </div>

        <Button
          onClick={() => {
            AuthService.redirectGoogle();
          }}
          variant="outline"
          className="w-full border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 48 48"
            className="mr-2 group-hover:scale-110 transition-transform duration-300"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          Login dengan Google
        </Button>
      </div>

      <div className="mt-12 flex justify-center text-xs text-gray-400">
        <p>2023-2025 FIK Universitas Dian Nuswantoro All rights reserved.</p>
      </div>
    </div>
  );
}
