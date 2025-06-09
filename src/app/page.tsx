import Link from "next/link";

export default async function Home() {
  return (
    <div className="mx-auto w-full">
      <div className="justiry-between flex flex-row">
        <div>logo</div>
        <div>navigation</div>
        <div>actions</div>
      </div>
      <div>Hero</div>
      <div>Content</div>
    </div>
  );
}
