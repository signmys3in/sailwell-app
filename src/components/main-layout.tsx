import { Sailboat } from "lucide-react";
import MainNav from "@/components/main-nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="flex flex-1">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-card sm:flex">
          <div className="flex h-20 items-center border-b px-6">
            <a href="/" className="flex items-center gap-3 font-semibold">
              <Sailboat className="h-12 w-12 text-primary" />
              <span className="text-3xl font-bold">SailWell</span>
            </a>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <MainNav />
          </div>
        </aside>
        <main className="flex flex-1 flex-col sm:pl-60">
            <div className="flex-1 p-4 md:p-8 pt-6">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}
