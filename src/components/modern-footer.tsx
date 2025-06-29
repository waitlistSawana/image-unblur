"use client";

import Link from "next/link";
import { cn } from "~/lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Sparkles, Twitter, Github, Mail, Heart } from "lucide-react";

interface ModernFooterProps {
  className?: string;
}

const footerLinks = {
  product: [
    { label: "Image Deblur", href: "/image-deblur" },
    { label: "Text to Image", href: "/text-to-image" },
    { label: "Examples", href: "/examples" },
    { label: "Pricing", href: "/pricing" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api" },
    { label: "Support", href: "/support" },
    { label: "Status", href: "/status" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "DMCA", href: "/dmca" },
  ],
};

const socialLinks = [
  {
    label: "Twitter",
    href: "https://twitter.com/imageunblur",
    icon: Twitter,
  },
  {
    label: "GitHub",
    href: "https://github.com/imageunblur",
    icon: Github,
  },
  {
    label: "Email",
    href: "mailto:hello@imageunblur.com",
    icon: Mail,
  },
];

export default function ModernFooter({
  className,
  ...props
}: React.ComponentProps<"footer"> & ModernFooterProps) {
  return (
    <footer
      className={cn(
        "bg-muted/30 border-border/50 relative border-t",
        className,
      )}
      {...props}
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="bg-primary absolute top-10 left-10 h-32 w-32 rounded-full blur-3xl" />
        <div className="absolute right-10 bottom-10 h-40 w-40 rounded-full bg-purple-500 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-6">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link
                href="/"
                className="hover:text-primary flex items-center gap-3 font-serif text-xl font-bold transition-colors"
              >
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Sparkles className="text-primary h-6 w-6" />
                </div>
                <span>ImageUnblur</span>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  AI-Powered
                </Badge>
              </Link>

              <p className="text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed">
                Transform blurry images into crystal-clear perfection with our
                advanced AI technology. Fast, reliable, and easy to use.
              </p>

              {/* Social Links */}
              <div className="mt-6 flex gap-3">
                {socialLinks.map((social) => (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Link href={social.href} aria-label={social.label}>
                      <social.icon className="h-4 w-4" />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold">Product</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-border/50 bg-background/50 border-t">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>© {new Date().getFullYear()} ImageUnblur.</span>
                <span>Made with</span>
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                <span>for creators worldwide.</span>
              </div>

              <div className="text-muted-foreground flex items-center gap-6 text-sm">
                <span>Powered by cutting-edge AI technology</span>
                <Badge variant="outline" className="text-xs">
                  v2.0
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
