"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

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
    href: "/image-deblur",
    label: "Image Deblur",
  },
  {
    href: "/pricing",
    label: "Pricing",
  },
];

export function Navbar({ className, ...props }: React.ComponentProps<"div">) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div
      className={cn(
        "sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 supports-[backdrop-filter]:bg-background/60",
        className,
      )}
      {...props}
    >
      <div className="container mx-auto flex w-full flex-row items-center justify-between gap-4 px-4 py-4 xl:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 font-serif text-xl font-bold transition-colors hover:text-primary"
        >
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <Sparkles className="text-primary h-5 w-5" />
          </div>
          <span className="hidden sm:block">ImageUnblur</span>
          <Badge className="bg-primary/10 text-primary border-primary/20 hidden md:inline-flex text-xs">
            AI-Powered
          </Badge>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-start">
          <NavbarNavigation navigations={navbarOptions} />
        </div>

        {/* Auth & Mobile Menu */}
        <div className="flex flex-row items-center gap-3">
          {/* Auth Buttons */}
          <div className="hidden md:flex flex-row gap-2">
            <ClerkLoading>
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button size="sm">Sign Up</Button>
            </ClerkLoading>

            <ClerkLoaded>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">Sign Up</Button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/text-to-image">Create Image</Link>
                </Button>
                <div className="flex items-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </ClerkLoaded>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-lg md:hidden">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navbarOptions.map((option) => (
                <Link
                  key={option.href}
                  href={option.href}
                  className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {option.label}
                </Link>
              ))}

              {/* Mobile Auth */}
              <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                <ClerkLoading>
                  <Button variant="ghost" size="sm">Sign In</Button>
                  <Button size="sm">Sign Up</Button>
                </ClerkLoading>

                <ClerkLoaded>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button variant="ghost" size="sm" className="justify-start">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="sm" className="justify-start">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </SignedOut>

                  <SignedIn>
                    <Button variant="ghost" size="sm" asChild className="justify-start">
                      <Link href="/text-to-image">Create Image</Link>
                    </Button>
                    <div className="flex items-center gap-3 py-2">
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: "h-8 w-8",
                          },
                        }}
                      />
                      <span className="text-sm font-medium">Account</span>
                    </div>
                  </SignedIn>
                </ClerkLoaded>
              </div>
            </nav>
          </div>
        </div>
      )}
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
      <NavigationMenuList className="space-x-1">
        {navigations.map((option) => (
          <NavigationMenuItem key={option.href}>
            <NavigationMenuLink asChild>
              <Link
                href={option.href}
                className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                {option.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
