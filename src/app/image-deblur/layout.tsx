import { type ReactNode } from "react";
import { Navbar } from "~/components/navbar";
import ModernFooter from "~/components/modern-footer";

interface ImageDeblurLayoutProps {
  children: ReactNode;
}

export default function ImageDeblurLayout({
  children,
}: ImageDeblurLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
      <ModernFooter />
    </>
  );
}
