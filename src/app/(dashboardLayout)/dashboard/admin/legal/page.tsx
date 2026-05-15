"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  Scale, 
  Save, 
  FileText, 
  RotateCcw, 
  Shield, 
  Cookie, 
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { 
  useGetLegalDocumentBySlugQuery, 
  useSaveLegalDocumentMutation 
} from "@/redux/features/legal/legalApi";
import { toast } from "react-hot-toast";

const LEGAL_PAGES = [
  { slug: "terms-of-service", title: "Terms of Service", icon: Scale },
  { slug: "refund-policy", title: "Refund Policy", icon: RotateCcw },
  { slug: "privacy-policy", title: "Privacy Policy", icon: Shield },
  { slug: "cookie-policy", title: "Cookie Policy", icon: Cookie },
];

export default function AdminLegalPage() {
  const { t } = useTranslation();
  const [selectedSlug, setSelectedSlug] = useState(LEGAL_PAGES[0].slug);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data, isLoading, refetch } = useGetLegalDocumentBySlugQuery(selectedSlug);
  const [saveLegalDoc, { isLoading: isSaving }] = useSaveLegalDocumentMutation();

  useEffect(() => {
    if (data?.data) {
      setTitle(data.data.title);
      setContent(data.data.content);
    } else {
      // Set defaults if no data in DB
      const current = LEGAL_PAGES.find(p => p.slug === selectedSlug);
      setTitle(current?.title || "");
      setContent("");
    }
  }, [data, selectedSlug]);

  const handleSave = async () => {
    if (!title || !content) {
      toast.error("Title and Content are required");
      return;
    }

    try {
      await saveLegalDoc({ slug: selectedSlug, title, content }).unwrap();
      toast.success(`${title} saved successfully!`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save document");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* Header */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full">
           <FileText className="w-4 h-4 text-primary" />
           <span className="text-[10px] font-black uppercase tracking-widest text-primary">Content Management</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-foreground">
          Legal <span className="text-primary italic font-serif">Command Center</span>
        </h1>
        <p className="text-muted-foreground text-lg font-medium max-w-xl">
          Manage your platform's legal framework and policy documentation.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-3">
          {LEGAL_PAGES.map((page) => {
            const Icon = page.icon;
            const isActive = selectedSlug === page.slug;
            return (
              <button
                key={page.slug}
                onClick={() => setSelectedSlug(page.slug)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 text-left
                ${isActive 
                  ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" 
                  : "bg-card border border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-primary/60"}`} />
                <span className="text-xs font-black uppercase tracking-widest">{page.title}</span>
              </button>
            );
          })}
        </aside>

        {/* Editor Area */}
        <main className="lg:col-span-9 space-y-8 bg-card border border-border rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
          {isLoading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Retrieving Secure Data...</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Document Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-14 px-6 bg-secondary/30 border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="e.g. Terms & Conditions"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Document Content (HTML supported)</label>
                  <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-primary/60">
                    <AlertCircle className="w-3 h-3" />
                    Rich Text Mode Active
                  </div>
                </div>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-[500px] p-8 bg-secondary/30 border border-border rounded-[2rem] text-sm font-medium leading-relaxed focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Enter the legal content here..."
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-14 px-10 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isSaving ? "Encrypting & Saving..." : "Save Document"}
                </button>
              </div>
            </div>
          )}

          {/* Status Indicator */}
          <div className="absolute top-8 right-8">
            {data?.data ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full">
                <CheckCircle className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-widest">Live in Production</span>
              </div>
            ) : !isLoading && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full">
                <AlertCircle className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-widest">Local Placeholder Only</span>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
