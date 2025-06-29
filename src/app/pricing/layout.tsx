import { type ReactNode } from "react";
import { Navbar } from "~/components/navbar";
import ModernFooter from "~/components/modern-footer";

interface PricingLayoutProps {
  children: ReactNode;
}

export default function PricingLayout({ children }: PricingLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
      <ModernFooter />
    </>
  );
}
