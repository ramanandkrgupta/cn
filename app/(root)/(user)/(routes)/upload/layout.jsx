import { EdgeStoreProvider } from "@/libs/edgestore"
export const metadata = {
  title: "Upload",
};

export default function UploadLayout({ children }) {
  return <>
  <EdgeStoreProvider>
  {children}
  </EdgeStoreProvider>

  </>;
}
