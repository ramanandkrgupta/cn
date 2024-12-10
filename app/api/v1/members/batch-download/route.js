import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import JSZip from 'jszip';
import axios from 'axios';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== 'PRO') {
      return NextResponse.json(
        { error: "Batch download is a PRO feature" },
        { status: 403 }
      );
    }

    const { fileIds } = await req.json();

    if (!fileIds?.length) {
      return NextResponse.json(
        { error: "No files selected" },
        { status: 400 }
      );
    }

    // Fetch files from database with more details
    const files = await prisma.post.findMany({
      where: {
        id: { in: fileIds },
        status: "approved"
      },
      select: {
        id: true,
        title: true,
        file_url: true,
        file_name: true,
        subject_name: true
      }
    });

    const zip = new JSZip();

    // Create folders for each subject
    const subjectFolders = {};

    // Add files to ZIP with progress tracking
    for (const file of files) {
      try {
        console.log(`Downloading file: ${file.file_name}`);
        
        // Get or create subject folder
        if (!subjectFolders[file.subject_name]) {
          subjectFolders[file.subject_name] = zip.folder(file.subject_name);
        }

        // Download file
        const response = await axios({
          method: 'get',
          url: file.file_url,
          responseType: 'arraybuffer',
          headers: {
            'Accept': 'application/pdf'
          }
        });

        // Add file to appropriate subject folder
        subjectFolders[file.subject_name].file(file.file_name, response.data);

        // Update download count and record
        await Promise.all([
          prisma.post.update({
            where: { id: file.id },
            data: { downloads: { increment: 1 } }
          }),
          prisma.userDownload.create({
            data: {
              userId: session.user.id,
              postId: file.id
            }
          })
        ]);

        console.log(`Successfully processed: ${file.file_name}`);
      } catch (error) {
        console.error(`Error processing file ${file.id}:`, error);
        throw new Error(`Failed to process file: ${file.file_name}`);
      }
    }

    console.log("Generating ZIP file...");

    // Generate ZIP file with better compression
    const zipContent = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9
      }
    });

    console.log("ZIP file generated successfully");

    // Before generating the ZIP file
    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files found to download" },
        { status: 404 }
      );
    }

    // After generating the ZIP file
    if (zipContent.length === 0) {
      return NextResponse.json(
        { error: "Generated ZIP file is empty" },
        { status: 500 }
      );
    }

    // Return ZIP file with proper headers
    return new Response(zipContent, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="study-materials-${Date.now()}.zip"`,
        'Content-Length': zipContent.length.toString(),
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error("Error in batch download:", error);
    return NextResponse.json(
      { 
        error: "Failed to process download",
        details: error.message
      },
      { status: 500 }
    );
  }
} 