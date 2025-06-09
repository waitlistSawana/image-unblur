import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";

export default async function ExamplesPage() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div
      id="ExamplesPage"
      className="flex min-h-screen flex-col items-center justify-center"
    >
      <Button>按钮</Button>
      <Button variant={"destructive"}>按钮</Button>
      <Button variant={"outline"}>按钮</Button>
      <Button variant={"outline"} size={"lg"}>
        按钮
      </Button>
      <Button variant={"outline"} size={"huge"}>
        按钮
      </Button>

      <button className={buttonVariants({ variant: "default" })}>按钮</button>
      <Link className={buttonVariants({ variant: "secondary" })} href="/">
        主页链接
      </Link>
      <Link href="/">主页链接</Link>
    </div>
  );
}
