"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pill, Boxes, AreaChart, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const links = [
  {
    href: "/",
    label: "Drug Suggester",
    icon: Pill,
  },
  {
    href: "/stock",
    label: "Stock Management",
    icon: Boxes,
  },
  {
    href: "/reports",
    label: "Reports",
    icon: AreaChart,
  },
  {
    href: "/reports/disease-trends",
    label: "Disease Trends",
    icon: LineChart,
  },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              buttonVariants({
                variant: isActive ? "default" : "ghost",
                size: "default",
              }),
              "justify-start my-1",
              isActive &&
                "text-primary-foreground"
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
