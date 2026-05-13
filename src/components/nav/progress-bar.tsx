"use client";

import NProgress from "nprogress";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || target.target === "_blank") return;
      NProgress.start();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

export function ProgressBar() {
  return <NavigationEvents />;
}
