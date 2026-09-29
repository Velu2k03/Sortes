import { ReactNode } from "react";

export type SpreadType = "single" | "three-card";

interface SpreadLayoutProps {
  spreadType: SpreadType;
  children: ReactNode;
}

export function SpreadLayout({ spreadType, children }: SpreadLayoutProps) {
  let gridClass = "";

  switch (spreadType) {
    case "single":
      gridClass = "grid-cols-1 max-w-sm";
      break;
    case "three-card":
      gridClass = "grid-cols-1 md:grid-cols-3 max-w-4xl";
      break;
    default:
      gridClass = "grid-cols-1";
  }

  return (
    <div className={`w-full mx-auto grid gap-6 md:gap-12 place-items-center ${gridClass}`}>
      {children}
    </div>
  );
}
