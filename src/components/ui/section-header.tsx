import { cn } from "~/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center" | "right";
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
  align = "center",
  ...props
}: React.ComponentProps<"div"> & SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 w-full max-w-3xl",
        {
          "mx-auto text-center": align === "center",
          "ml-auto text-right": align === "right",
          "text-left": align === "left",
        },
        className,
      )}
      {...props}
    >
      {eyebrow && (
        <p className="bg-primary/10 text-primary mb-2 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground mt-4 text-lg">{subtitle}</p>
      )}
    </div>
  );
}
