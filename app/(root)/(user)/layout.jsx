// app/(root)/(user)/layout.jsx

"use client";
import { Navbar, Sidebar } from "@/components/navigation";
import { ProtectedLayout } from "@/components/layouts/protectLayouts";
import Script from "next/script";
import Loading from "./loading"; // Import the Loading component
import { useState, useEffect } from "react";

export default function UserLayout({ children }) {
  return <>{children}</>;
}