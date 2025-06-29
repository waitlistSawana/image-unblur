import { type ReactNode } from "react";
import { Navbar } from "~/components/navbar";
import ModernFooter from "~/components/modern-footer";

interface TextToImageLayoutProps {
  children: ReactNode;
}

export default function TextToImageLayout({
  children,
}: TextToImageLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
      <ModernFooter />
    </>
  );
}
