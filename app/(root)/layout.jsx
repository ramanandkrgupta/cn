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
      <script defer src="https://cloud.umami.is/script.js" data-website-id="ce416d58-503a-40cd-9663-7e7618ecc8f7"></script>
    </EdgeStoreProvider>
  );
}
