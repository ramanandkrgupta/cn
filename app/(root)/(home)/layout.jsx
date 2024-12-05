import { Navbar, Navigation, Sidebar } from "@/components/navigation";

export const metadata = {
  title: {
    template: "%s | NotesMates.in",
    default: "Home | NotesMates.in", // a default is required when creating a template
  },
};

export default function HomeLayout({ children }) {
  return (
    <section>
         <div className="relative sm:p-8 p-4  flex flex-row">
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>
        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          <Navbar showSearch={true} />
          {children}
        </div>
       
      </div>
    </section>
  );
}
