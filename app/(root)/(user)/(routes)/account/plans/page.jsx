"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Crown,
  Check,
  ArrowLeft,
  Download,
  FileText,
  Share2,
  Shield,
} from "lucide-react";
import useUserStore from "@/store/useUserStore";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Basic access to study materials",
    features: [
      "Access to free study materials",
      "Limited downloads per day",
      "Basic search functionality",
      "Community support",
    ],
    limitations: [
      "No access to premium content",
      "Limited download speed",
      "Ads supported",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 1,
    description: "Full access to all features",
    features: [
      "Access to all study materials",
      "Unlimited downloads",
      "Priority support",
      "Ad-free experience",
      "Premium content access",
      "High-speed downloads",
      "Early access to new materials",
    ],
  },
];

export default function PlansPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const { updateUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("free");

  useEffect(() => {
    if (session?.user) {
      const isPro =
        session.user.role === "PRO" || session.user.userRole === "PRO";
      setCurrentPlan(isPro ? "pro" : "free");
    }
  }, [session]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgradeSuccess = async (updatedUser) => {
    try {
      // Update Zustand store
      updateUser({
        userRole: updatedUser.userRole,
        role: updatedUser.userRole, // Keep both for consistency
      });

      // Update NextAuth session
      await updateSession({
        ...session,
        user: {
          ...session.user,
          role: updatedUser.userRole,
          userRole: updatedUser.userRole,
        },
      });

      toast.success("Successfully upgraded to PRO!");
      router.refresh();
      router.push("/account");
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Error updating user status");
    }
  };

  const handleUpgrade = async (planId) => {
    try {
      setLoading(true);

      // Load Razorpay SDK
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      // Create order
      const orderResponse = await fetch("/api/user/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plans.find((p) => p.id === planId).price,
          currency: "INR",
          receipt: `plan_${planId}_${Date.now()}`,
        }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.error || "Failed to create order");
      }

      const orderData = await orderResponse.json();
      if (!orderData.id) throw new Error("Failed to create order");

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Notes Mates",
        description: `Upgrade to ${planId.toUpperCase()} Plan`,
        order_id: orderData.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/user/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.status === "success") {
              // Update user role
              const updateResponse = await fetch(
                "/api/v1/members/users/upgrade",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ plan: planId }),
                }
              );

              if (!updateResponse.ok) {
                throw new Error("Failed to upgrade plan");
              }

              const { user } = await updateResponse.json();
              await handleUpgradeSuccess(user);
            }
          } catch (error) {
            console.error("Error handling payment:", error);
            toast.error("Failed to process upgrade");
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => router.back()}
          className="btn btn-ghost btn-sm p-0"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            Subscription Plans
          </h1>
          <p className="text-base-content/60">
            Choose the perfect plan for your study needs
          </p>
        </div>
      </div>

      {/* Current Plan Info */}
      <div className="bg-base-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Current Plan</h2>
            <p className="text-base-content/60">
              You are currently on the {currentPlan.toUpperCase()} plan
            </p>
          </div>
          {currentPlan === "pro" && (
            <div className="badge badge-primary gap-2">
              <Crown className="w-4 h-4" />
              PRO
            </div>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`
              relative overflow-hidden rounded-lg border-2 p-6
              ${
                plan.id === "pro"
                  ? "border-primary bg-primary/5"
                  : "border-base-300 bg-base-200"
              }
            `}
          >
            {plan.id === "pro" && (
              <div className="absolute top-4 right-4">
                <Crown className="w-6 h-6 text-primary animate-pulse" />
              </div>
            )}

            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">₹{plan.price}</span>
              {plan.price > 0 && (
                <span className="text-base-content/60">/year</span>
              )}
            </div>

            <p className="text-base-content/70 mb-6">{plan.description}</p>

            <div className="space-y-3 mb-6">
              {plan.features?.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span>{feature}</span>
                </div>
              ))}
              {plan.limitations?.map((limitation, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-base-content/50"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    ×
                  </div>
                  <span>{limitation}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={loading || currentPlan === plan.id}
              className={`
                btn w-full
                ${plan.id === "pro" ? "btn-primary" : "btn-outline"}
              `}
            >
              {loading
                ? "Processing..."
                : currentPlan === plan.id
                ? "Current Plan"
                : plan.id === "pro"
                ? "Upgrade to PRO"
                : "Stay Free"}
            </button>
          </div>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Features Comparison</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th>Pro</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Downloads
                  </div>
                </td>
                <td>Limited (5/day)</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Premium Content
                  </div>
                </td>
                <td>❌</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Sharing
                  </div>
                </td>
                <td>Limited</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Priority Support
                  </div>
                </td>
                <td>❌</td>
                <td>✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
