"use client";
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast  from "react-hot-toast";

const GoogleOneTap = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated") {
      router.push("/dashboard");
      return;
    }

    const initializeGsi = () => {
      if (!window.google || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return;

      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              const result = await signIn("google", {
                credential: response.credential,
                redirect: false,
              });

              if (result?.error) {
                toast.error(result.error);
                return;
              }

              if (result?.ok) {
                toast.success("Successfully logged in!");
                router.push("/dashboard");
                window.google.accounts.id.cancel();
              }
            } catch (error) {
              console.error("Sign in error:", error);
              toast.error("Failed to sign in");
            }
          },
          auto_select: false,
          prompt_parent_id: "googleButton",
          allowed_parent_origin: [
            "https://www.notesmates.in",
            "https://notesmates.in",
            "https://cn-eta.vercel.app",
            "http://localhost:3000",
          ],
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleButton"),
          {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            logo_alignment: "left",
            width: "100%",
            height: 50,
            longtitle: true,
          }
        );

        if (!sessionStorage.getItem("googleOneTapDismissed")) {
          window.google.accounts.id.prompt((notification) => {
            if (
              notification.isNotDisplayed() ||
              notification.isSkippedMoment()
            ) {
              sessionStorage.setItem("googleOneTapDismissed", "true");
            }
          });
        }
      } catch (error) {
        console.error("Google Sign In Error:", error);
      }
    };

    const script = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    if (script) {
      if (window.google) {
        initializeGsi();
      } else {
        script.addEventListener("load", initializeGsi);
      }
    }

    return () => {
      if (window.google) {
        window.google.accounts.id.cancel();
      }
    };
  }, [status, router]);

  if (status === "authenticated") return null;

  return (
    <div
      id="googleButton"
      className="w-full flex justify-center items-center"
      style={{
        minHeight: "50px",
        maxHeight: "50px",
        overflow: "hidden",
      }}
    />
  );
};

export default GoogleOneTap;
