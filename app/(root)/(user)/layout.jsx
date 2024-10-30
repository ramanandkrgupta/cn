import { Navbar, Sidebar } from "@/components/navigation";

export default function AccountLayout({ children }) {
  return (
    <section>
      <div className="relative sm:p-8 p-4  flex flex-row">
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>
        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          <Navbar />
          {children}
        </div>

      </div>
      <script src="https://checkout.razorpay.com/v1/checkout.js" />
    </section>

  );
}