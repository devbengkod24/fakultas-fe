"use client"

import React from 'react'
import { LoginForm } from './login-form'
import { AppShowcase } from './app-showcase'
import withoutAuth from '../../hoc/withoutAuth'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

const LoginClient = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  if (error === "email_not_found") {
    toast.error("Email tidak ditemukan, silahkan daftar terlebih dahulu", {
      id: "email-not-found",
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-xl">
        <LoginForm />
        <AppShowcase />
      </div>
    </div>
  )
}

export default withoutAuth(LoginClient)