import { Navbar } from "~/components/navbar";

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="ExamplesLayout">
      <Navbar id="navbar" />
      {children}
    </div>
  );
}
