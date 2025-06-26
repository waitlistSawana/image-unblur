import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const navbarOptions: { href: string; label: string }[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/examples",
    label: "Examples",
  },
  {
    href: "/text-to-image",
    label: "Text to Image",
  },
  {
    href: "/pricing",
    label: "Pricing",
  },
];

export function Navbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between gap-4 border-b px-2 py-2 md:px-4 xl:px-6",
        className,
      )}
      {...props}
    >
      <div className="flex flex-nowrap justify-start font-serif text-lg font-semibold">
        Image Generator Starter
      </div>

      <div className="flex-1">
        <NavbarNavigation navigations={navbarOptions} />
      </div>

      {/* Auth */}
      <div className="flex flex-row gap-2">
        <ClerkLoading>
          <Button variant={"outline"}>Sign In</Button>
          <Button>Sign UP</Button>
        </ClerkLoading>

        <ClerkLoaded>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant={"outline"}>Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Sign UP</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <div className="flex flex-row items-center justify-center">
              <UserButton />
            </div>
            <Button variant={"default"} asChild>
              <Link href="/text-to-image">Create Image</Link>
            </Button>
          </SignedIn>
        </ClerkLoaded>
      </div>
    </div>
  );
}

const NavbarNavigation = ({
  navigations,
}: {
  navigations: {
    href: string;
    label: string;
  }[];
}) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navigations.map((option) => (
          <NavigationMenuItem key={option.href}>
            <NavigationMenuLink asChild>
              <Link href={option.href}>{option.label}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
