export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="ExamplesLayout">
      <div>导航栏</div>
      {children}
    </div>
  );
}
