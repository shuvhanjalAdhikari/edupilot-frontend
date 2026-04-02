import Header from "./Header";

export default function PageWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden">
      <Header title={title} />
      <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
        {children}
      </main>
    </div>
  );
}