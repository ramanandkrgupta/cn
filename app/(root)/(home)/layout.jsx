// app/(root)/(home)/layout.jsx

import { Navbar, Navigation, Sidebar } from "@/components/navigation";

export const metadata = {
  title: {
    template: "%s | NotesMates.in",
    default: "Home | NotesMates.in",
  },
};

export default function HomeLayout({ children }) {
  return (
    <section>
      <div className="relative sm:p-4 p-2 flex flex-row">
        <div className="sm:flex hidden mr-2">
          <Sidebar />
        </div>
        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-2">
          <Navbar showSearch={true} />
          {children}
        </div>
      </div>
    </section>
  );
}
