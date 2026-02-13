"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Pill,
  Boxes,
  AreaChart,
  ShieldCheck,
  AlertTriangle,
  PieChart,
  ClipboardList,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useState } from "react";

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
    label: "Analytics",
    icon: AreaChart,
    subLinks: [
      {
        href: "/reports",
        label: "Dispensing and Diagnoses",
        icon: ClipboardList,
      },
      {
        href: "/reports/disease-trends",
        label: "Disease Trends",
        icon: PieChart,
      },
      {
        href: "/reports/low-stock",
        label: "Low Stock",
        icon: AlertTriangle,
      },
    ]
  },
  {
    href: "/narcotics",
    label: "Narcotics",
    icon: ShieldCheck,
  },
];

export default function MainNav() {
  const pathname = usePathname();
  const isAnalyticsActive = pathname.startsWith('/reports');
  const [isAnalyticsOpen, setAnalyticsOpen] = useState(isAnalyticsActive);

  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      {links.map((link) => {
        if (link.subLinks) {
          const isParentActive = link.subLinks.some(sublink => pathname === sublink.href);
          return (
            <Collapsible key={link.label} open={isAnalyticsOpen} onOpenChange={setAnalyticsOpen} className="my-1">
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    buttonVariants({
                      variant: isParentActive ? "default" : "ghost",
                      size: "default",
                    }),
                    "justify-start w-full"
                  )}
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                  <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", isAnalyticsOpen && "rotate-180")} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="py-1 pl-6">
                <nav className="grid gap-1">
                  {link.subLinks.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={cn(
                          buttonVariants({
                            variant: isActive ? "secondary" : "ghost",
                            size: "sm",
                          }),
                          "justify-start",
                          isActive &&
                            "text-secondary-foreground"
                        )}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {label}
                      </Link>
                    )
                  })}
                </nav>
              </CollapsibleContent>
            </Collapsible>
          )
        }
        
        const { href, label, icon: Icon } = link;
        const isActive = pathname === href;
        return (
          <Link
            key={href!}
            href={href!}
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
