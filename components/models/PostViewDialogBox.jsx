"use client";

import toast from "react-hot-toast";
import { Fragment, useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { Dialog, Transition } from "@headlessui/react";
import { ShareIcon, XMarkIcon, HeartIcon } from "@heroicons/react/20/solid";
import { useSession, signIn } from "next-auth/react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Lock } from "lucide-react";
import Link from "next/link";

import { handlesharebtn } from "@/libs/utils";

const PostViewDialogBox = ({ isOpen, setIsOpen, data }) => {
  const { data: session } = useSession();

  useEffect(() => {
    console.log("Session in component:", session); // Debug log
  }, [session]);

  const [metrics, setMetrics] = useState({
    downloads: data.downloads || 0,
    likes: data.likes || 0,
    shares: data.shares || 0,
  });
  const [isLiked, setIsLiked] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  // Check user's interaction when dialog opens
  useEffect(() => {
    const checkUserInteraction = async () => {
      if (session?.user) {
        const response = await fetch(
          `/api/v1/members/posts/metrics?postId=${data.id}`
        );
        if (response.ok) {
          const { hasLiked, hasDownloaded } = await response.json();
          setHasLiked(hasLiked);
          setHasDownloaded(hasDownloaded);
        }
      }
    };

    checkUserInteraction();
  }, [data.id, session]);

  function closeModal() {
    setIsOpen(false);
  }

  const addUserDetailsToPdf = async (existingPdfBytes, userName, userEmail) => {
    const pdfDoc = await PDFDocument.load(existingPdfBytes, {
      ignoreEncryption: true,
    });
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const fontSize = 10;
      const userDetails = `${userName} - ${userEmail}`;
      const textWidth = helveticaFont.widthOfTextAtSize(userDetails, fontSize);

      // Bottom-right corner (user details)
      page.drawText(userDetails, {
        x: width - textWidth - 10,
        y: 10,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.5,
      });
    });

    return await pdfDoc.save();
  };

  const updateMetric = async (metricType) => {
    try {
      console.log("Updating metric:", {
        metricType,
        postId: data.id,
        session: session,
      });

      const response = await fetch("/api/v1/members/posts/metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: data.id,
          metricType,
        }),
      });

      const responseData = await response.json();
      console.log("Metric update response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update metric");
      }

      setMetrics((prev) => ({
        ...prev,
        ...responseData,
      }));

      return true;
    } catch (error) {
      console.error("Error updating metric:", error);
      toast.error(error.message);
      return false;
    }
  };

  const handleDownload = async (postId, filename) => {
    try {
      // Check if user is logged in
      if (!session?.user) {
        toast.error("Please login to download files");
        return;
      }

      // Additional check for premium content
      if (data.premium && session.user.userRole !== "PRO") {
        toast.error(
          "This is a premium file. You need a premium membership to download it."
        );
        return;
      }

      const response = await fetch("/api/v1/members/posts/secure-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: data.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get file access");
      }

      const { fileUrl } = await response.json();
      const fileResponse = await fetch(fileUrl);
      const existingPdfBytes = await fileResponse.arrayBuffer();

      // Add user details to PDF
      const modifiedPdfBytes = await addUserDetailsToPdf(
        existingPdfBytes,
        session.user.name,
        session.user.email
      );

      const modifiedBlob = new Blob([modifiedPdfBytes], {
        type: "application/pdf",
      });
      saveAs(modifiedBlob, `cn-${filename}`);

      // Update download metrics
      await updateMetric("downloads");
      toast.success("File downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Error downloading file");
    }
  };

  const handleLike = async () => {
    // Require login for likes
    if (!session?.user) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      const response = await fetch("/api/v1/members/posts/metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: data.id,
          metricType: "likes",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setHasLiked(true);
        setMetrics((prev) => ({
          ...prev,
          likes: result.likes || prev.likes + 1,
        }));
        toast.success("Post liked!");
      } else {
        if (result.error === "Already liked") {
          toast.error("You've already liked this post");
        } else {
          throw new Error(result.error || "Failed to like post");
        }
      }
    } catch (error) {
      console.error("Like error:", error);
      toast.error(error.message || "Error liking post");
    }
  };

  const handleShare = async () => {
    try {
      // Check if running in browser and if navigator.share is available
      if (typeof navigator !== "undefined" && navigator.share) {
        // Mobile share
        await navigator.share({
          title: SharePost.title,
          text: SharePost.content,
          url: SharePost.url,
        });
      } else {
        // Desktop fallback - copy to clipboard
        await navigator.clipboard.writeText(
          `${SharePost.content}\n${SharePost.url}`
        );
        toast.success("Link copied to clipboard!");
      }

      // Update share count without requiring login
      const response = await fetch("/api/v1/members/posts/metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: data.id,
          metricType: "shares",
        }),
      });

      if (response.ok) {
        const updatedMetrics = await response.json();
        setMetrics((prev) => ({
          ...prev,
          ...updatedMetrics,
        }));
      }
    } catch (error) {
      console.error("Share error:", error);
      if (error.name === "AbortError") {
        // User cancelled the share
        return;
      }
      toast.error("Error sharing post");
    }
  };

  const SharePost = {
    title: data.title || "",
    content: `Hey! check out this notes for your best result in exams.\n\n🛂Course Name🛂\n ${
      data.course_name
    }\n\n📕File Title 📕\n ${data.title} \n\n#${data.subject_name.replace(
      /\s/g,
      ""
    )} #${data.course_name.replace(/\s/g, "")}\n\n 🚀 Download Link 🚀 \n`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/post/${
      data.id
    }/${data.title.replace(/\s+/g, "-")}`,
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <XMarkIcon
                  className="text-black hover:text-gray-300 absolute top-4 right-4 text-lg  cursor-pointer w-6 h-6"
                  onClick={closeModal}
                />
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold leading-6 text-black mt-3"
                >
                  {data.title}
                </Dialog.Title>
                <Dialog.Description className="text-md text-gray-500 font-medium mt-3">
                  {data.description}
                </Dialog.Description>
                <div className="mt-2 text-[15px] capitalize">
                  <ul>
                    <li>Subject : {data.subject_name}</li>
                    <li>Course : {data.course_name}</li>
                    <li>Semester : {data.semester_code}</li>
                    <li>Category : {data.category}</li>
                  </ul>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{metrics.downloads} 📥</span>
                    <span>{metrics.likes} ❤️</span>
                    <span>{metrics.shares} 📢</span>
                  </div>
                  <div className="flex w-full gap-2">
                    <button
                      type="button"
                      className="rounded-full items-center justify-center text-white bg-black hover:bg-gray-700 py-2.5 px-2 capitalize mt-4 flex-1 transition-all duration-300"
                      onClick={() => {
                        if (!session?.user) {
                          toast.error("Please login to download files");
                          return;
                        }
                        handleDownload(data.id, data.file_name);
                      }}
                    >
                      {!session?.user ? (
                        <span className="flex items-center justify-center gap-1 text-sm">
                          <Lock className="w-4 h-4" />
                          Login to Download
                        </span>
                      ) : data.premium ? (
                        session.user.userRole === "PRO" ? (
                          "Premium File - Download"
                        ) : (
                          "Premium File - Upgrade to Download"
                        )
                      ) : (
                        "Download"
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (!session?.user) {
                          toast.error("Please login to like posts");
                          return;
                        }
                        handleLike();
                      }}
                      disabled={hasLiked}
                      className={`mt-4 p-2.5 rounded-full transition-all duration-300 ${
                        hasLiked ? "bg-red-500" : "bg-black hover:bg-gray-700"
                      }`}
                      title={
                        !session?.user
                          ? "Login to Like"
                          : hasLiked
                          ? "Already Liked"
                          : "Like"
                      }
                    >
                      <HeartIcon
                        className={`h-6 w-6 ${
                          hasLiked ? "text-white" : "text-gray-300"
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      className="rounded-full items-center mt-4 p-2.5 text-white bg-black hover:bg-gray-700 transition-all duration-300"
                      onClick={handleShare}
                    >
                      <ShareIcon className="h-6 w-6" />
                    </button>
                  </div>
                  {!session?.user && (
                    <div className="mt-4 p-4 bg-base-200 rounded-lg border border-base-300">
                      <div className="text-center">
                        <h4 className="font-semibold mb-2">Login Required</h4>
                        <p className="text-sm text-gray-500 mb-4">
                          Please login to download and like documents. It's free
                          and takes less than a minute.
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Link
                            href="/login"
                            className="btn btn-primary btn-sm"
                          >
                            Login
                          </Link>
                          <Link
                            href="/register"
                            className="btn btn-outline btn-sm"
                          >
                            Register
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                  {data.premium &&
                    session?.user &&
                    session.user.userRole !== "PRO" && (
                      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="text-center">
                          <h4 className="font-semibold text-amber-900 mb-2">
                            Premium Content
                          </h4>
                          <p className="text-sm text-amber-800 mb-4">
                            This is a premium document. Upgrade to PRO to access
                            premium content.
                          </p>
                          <Link
                            href="/plans"
                            className="btn btn-warning btn-sm"
                          >
                            Upgrade to PRO
                          </Link>
                        </div>
                      </div>
                    )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PostViewDialogBox;
