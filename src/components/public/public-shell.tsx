import type { ReactNode } from "react";
import { PublicHeader } from "./public-header";
import { PublicFooter } from "./public-footer";

export function PublicShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background"><PublicHeader /><main>{children}</main><PublicFooter /></div>;
}
