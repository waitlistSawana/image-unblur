import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

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
        <NavbarNavigation />
      </div>

      <div className="flex flex-row gap-2">
        <Button variant={"outline"}>Sign In</Button>
        <Button>Sign UP</Button>
      </div>
    </div>
  );
}

const NavbarNavigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/examples">Examples</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
