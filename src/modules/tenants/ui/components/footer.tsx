import { Poppins } from "next/font/google";
import Link from "next/link";

import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

export function Footer() {
  return (
    <footer className="border-t font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto gap-2 flex items-center h-full px-4 py-6 lg:px-12">
        <p>Powered by</p>
        <Link href="/">
          <span className={cn("text-2xl font-semibold", poppins.className)}>
            funroad.
          </span>
        </Link>
      </div>
    </footer>
  );
}
