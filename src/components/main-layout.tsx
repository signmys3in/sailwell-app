import Image from "next/image";
import MainNav from "@/components/main-nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="flex flex-1">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-sidebar sm:flex">
          <div className="border-b p-0">
            <a href="/">
              <Image
                src="/logo.png"
                alt="SailWell Logo"
                width={512}
                height={220}
                className="w-full h-auto"
              />
            </a>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <MainNav />
          </div>
        </aside>
        <main className="flex flex-1 flex-col sm:pl-64">
            <div className="flex-1 p-4 md:p-8 pt-6">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}
