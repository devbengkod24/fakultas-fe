import { Metadata } from "next";
import OnboardingPage from "./client-page";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Onboarding mahasiswa baru",
};

const Onboarding = () => {
  return <OnboardingPage />;
};

export default Onboarding;
