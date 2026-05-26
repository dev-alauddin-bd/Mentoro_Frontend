"use client"
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, Save, RotateCcw } from "lucide-react";

const DEFAULT_POLICY = `## Refund & Cancellation Policy

### 1. General Policy
We want you to be completely satisfied with your course purchase. If you are not satisfied, you may request a refund within 14 days of purchase.

### 2. Eligibility for Refund
To be eligible for a refund, you must meet the following criteria:
- You have purchased the course within the last 14 days.
- You have watched less than 20% of the course content.
- You have not downloaded any course materials or resources.

### 3. How to Request a Refund
Please email our support team at support@example.com with your course receipt and a brief explanation of why you are requesting a refund. Our team will review your request and process it within 3-5 business days.

### 4. Exceptions
Certain courses or promotional bundles may be strictly non-refundable. If applicable, this will be clearly stated on the checkout page before purchase.
`;

export default function RefundPolicyPage() {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage or use default
  useEffect(() => {
    const saved = localStorage.getItem("cm_refund_policy");
    if (saved) {
      setContent(saved);
    } else {
      setContent(DEFAULT_POLICY);
    }
    setIsLoaded(true);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate network delay
    setTimeout(() => {
      localStorage.setItem("cm_refund_policy", content);
      setIsSaving(false);
      toast.success("Refund Policy updated successfully!");
    }, 800);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to revert to the default template? Your current edits will be lost.")) {
      setContent(DEFAULT_POLICY);
      toast.success("Template reset. Don't forget to save!");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Manage Refund Policy</h1>
          <p className="text-gray-500 text-sm mt-1">
            This policy is displayed publicly to your students during checkout and in the footer.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded font-medium hover:bg-gray-50 transition"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : "Save Policy"}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 dark:bg-zinc-800 px-4 py-3 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="font-medium text-sm">Markdown Editor</span>
          <span className="text-xs text-gray-500">Supports Github Flavored Markdown</span>
        </div>
        <div className="p-0">
          <textarea
            className="w-full h-[500px] p-6 focus:outline-none resize-y bg-transparent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your refund policy here using markdown..."
            spellCheck="false"
          />
        </div>
      </div>

      <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
        <div className="mt-0.5 font-bold text-lg">💡</div>
        <div className="text-sm">
          <strong>Pro Tip:</strong>
          <p className="mt-1 opacity-90">Your refund policy acts as a legal binding framework for user disputes. Ensure you clearly mention timelines (e.g. 14 or 30 days) and explicit non-refundable conditions to authentication against unauthorizationd chargebacks.</p>
        </div>
      </div>
    </div>
  )
}
