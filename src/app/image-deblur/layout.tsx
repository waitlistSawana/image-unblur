import { type ReactNode } from "react";
import { Navbar } from "~/components/navbar";

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
    </>
  );
}
