import { Navbar } from "~/components/navbar";
import ModernFooter from "~/components/modern-footer";

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="ExamplesLayout">
      <Navbar id="navbar" />
      {children}
      <ModernFooter />
    </div>
  );
}
