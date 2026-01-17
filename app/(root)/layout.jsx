// app/(root)/layout.jsx
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "react-hot-toast";
import { NavigationWrapper } from "./NavigationWrapper";
import { headers } from "next/headers";

export default function RootLayout({ children }) {
  // const headersList = headers();
  // const pathname = headersList.get("x-url") || "";
  // Check if we are in the dashboard route. 
  // However, getting pathname in server component layout can be tricky if not passed.
  // A simpler CSS approach is usually better for client logic, but here we can hide it via CSS in global or just use a client wrapper.
  // Actually, standard way is to move Navigation to a client component or check pathname.
  // Let's use a Client Wrapper for the Navigation to check props.
  // Or better: The (root) layout is catering to both Home and Dashboard? 
  // Ideally, Dashboard should have its own layout group (root)/(dashboard) to avoid this.
  // Since we are in (root)/layout, we should conditionally render Navigation.

  return (
    <>
      <div className="min-h-screen bg-base-100">
        <Toaster position="top-center" />
        <main className="pb-16 sm:pb-0">{children}</main>
        {/* Navigation handles its own visibility based on path in its own component usually, 
            but if not, we should wrap it. 
            Let's rely on CSS 'hidden lg:block' or similar if it's mobile only navigation? 
            No, the screenshot shows it on mobile. 
            WE need to modify the Navigation component itself or wrap it. 
            Let's wrap it in a client component for conditional rendering.
         */}
        <NavigationWrapper />
      </div>
      {/* ... scripts ... */}
      <script
        defer
        src="https://cloud.umami.is/script.js"
        data-website-id="ce416d58-503a-40cd-9663-7e7618ecc8f7"
      ></script>


      <GoogleAnalytics gaId="G-DFFQPQG8G4" />
    </>
  );
}
