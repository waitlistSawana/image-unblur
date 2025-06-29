import { type ReactNode } from "react";
import { Navbar } from "~/components/navbar";

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
    </>
  );
}
