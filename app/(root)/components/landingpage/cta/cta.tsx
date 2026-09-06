import CTAClient from "./cta-client";

export const revalidate = 86400; // Cache 1 hari

export default function CTASection() {
  return <CTAClient />;
}