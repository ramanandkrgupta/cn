// /pages/api/download.js

import { getSession } from "next-auth/react";
import { getFileWithWatermark } from "@/libs/file-utils"; // Util for watermarking

export default async function (req, res) {
  const session = await getSession({ req });

  // Check if the user is authenticated
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { fileId, isPremium } = req.query;
  if (!fileId) {
    return res.status(400).json({ message: "Missing file ID" });
  }

  // Check for premium access
  if (isPremium === "true" && session.user.userRole !== "PRO") {
    return res.status(403).json({ message: "Premium access required" });
  }

if (req.method !== 'GET')
{
  return res.status(405).json({ message: 'Method not allowed' });
}
  try {
    // Fetch the file and apply watermark if needed
    const watermarkedFile = await getFileWithWatermark(fileId, session.user, isPremium === "true");

    // Set response headers for file download
    res.setHeader("Content-Disposition", `attachment; filename="watermarked-${fileId}.pdf"`);
    res.setHeader("Content-Type", "application/pdf");

    // Stream the watermarked file to the client
    res.send(watermarkedFile);
  } catch (error) {
    console.error("Error in file download:", error);
    res.status(500).json({ message: "Failed to download file" });
  }
}