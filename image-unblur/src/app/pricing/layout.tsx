import { type ReactNode } from "react";
import { Navbar } from "~/components/navbar";

interface PricingLayoutProps {
  children: ReactNode;
}

export default function PricingLayout({ children }: PricingLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
