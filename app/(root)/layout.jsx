// app/(root)/layout.jsx

import { Toaster } from "react-hot-toast";
import { Navigation } from "@/components/navigation";

export default function RootLayout({ children }) {
  return (
    <>
      <div className="min-h-screen bg-base-100">
        <Toaster position="top-center" />
        <main className="pb-16 sm:pb-0">{children}</main>
        <Navigation />
      </div>
      <script
        defer
        src="https://cloud.umami.is/script.js"
        data-website-id="ce416d58-503a-40cd-9663-7e7618ecc8f7"
      ></script>

      {/* <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-DFFQPQG8G4"
      ></script>
      <script>
        window.dataLayer = window.dataLayer || []; function gtag()
        {dataLayer.push(arguments)}
        gtag('js', new Date()); gtag('config', 'G-DFFQPQG8G4');
      </script> */}
    </>
  );
}
