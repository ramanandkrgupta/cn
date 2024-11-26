"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PostCard from "@/components/cards/PostCard";

export default function Downloads() {
  const { data: session } = useSession();
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    const fetchDownloads = async () => {
      if (session?.user) {
        const response = await fetch('/api/users/downloads');
        if (response.ok) {
          const data = await response.json();
          setDownloads(data);
        }
      }
    };

    fetchDownloads();
  }, [session]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Your Downloads</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {downloads.map((download) => (
          <PostCard key={download.id} data={download.post} />
        ))}
      </div>
    </div>
  );
} 