// app/(root)/layout.jsx

import { Toaster } from "react-hot-toast";
import { Navigation } from "@/components/navigation";
import { EdgeStoreProvider } from "@/libs/edgestore";

export default function RootLayout({ children }) {
  return (
    <EdgeStoreProvider>
      <div className="min-h-screen bg-base-100">
        <Toaster position="top-center" />
        <main className="pb-3">{children}</main>
        <Navigation />
      </div>
    </EdgeStoreProvider>
  );
}
