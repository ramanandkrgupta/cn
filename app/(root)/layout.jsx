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
        data-website-id=""
      ></script>
     
      
 </>
  );
}
