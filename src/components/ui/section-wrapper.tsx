import { cn } from "~/lib/utils";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export function SectionWrapper({
  id,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn("relative w-full py-16 md:py-24", className)}
      {...props}
    >
      <div className="container mx-auto px-4 md:px-6">{children}</div>
    </section>
  );
}
