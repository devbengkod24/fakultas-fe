import { Metadata } from "next";
import LoginClient from "./login-client";

export const metadata: Metadata = {
  title: "Login STI Apps",
  description: "Login to access your STI Apps",
};

export default function SignInPage() {
  return (
      <LoginClient />
  );
}
