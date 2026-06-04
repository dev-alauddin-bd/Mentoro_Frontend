"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  User,
  Mail,
  Shield,
  Clock,
  Edit3,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Upload,
  ArrowRight,
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/common/DashboardHeader";
import DashboardCard from "@/components/common/DashboardCard";
import { useUpdateProfileMutation } from "@/redux/features/user/userApi";
import { setUser } from "@/redux/features/auth/authSlice";

// ---------- COMPONENTS ----------

export default function ProfilePage() {
  const { user, token } = useSelector((state: RootState) => state.mentoroAuth);
  const dispatch = useDispatch();
  const [updateProfile] = useUpdateProfileMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    const file = (formData.get("avatar") as File);
    const name = formData.get("name") as string;

    try {
      if (!file || file.size === 0) {
        formData.delete("avatar");
      }

      const res = await updateProfile(formData).unwrap();

      if (res.success && res.data) {
        dispatch(setUser({ user: res.data, token: token! }));
      }

      setImagePreview(null);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error updating profile");
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse space-y-4 text-center">
          <User className="w-12 h-12 text-muted-foreground/30 mx-auto" />
          <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">
            Authenticating user...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">

      <DashboardHeader
        badgeIcon={<Shield className="w-3.5 h-3.5" />}
        badgeText="Identity & Security"
        title="Settings & Privacy."
        subtitle="Manage your public appearance, account security, and personalized experience across the Mentoro ecosystem."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card border border-border/60 rounded-[2.5rem] p-8 shadow-xl">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-[20px] rounded-full scale-110"></div>
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                alt={user.name}
                className="w-full h-full rounded-full object-cover border-4 border-background relative z-10 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 border-4 border-background rounded-full z-20"></div>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black truncate">{user.name}</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{user.role}</p>
            </div>

            <div className="mt-10 space-y-2">
              <TabButton
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
                icon={<User className="w-4 h-4" />}
                label="Profile Details"
              />
              <TabButton
                active={activeTab === "security"}
                onClick={() => setActiveTab("security")}
                icon={<Shield className="w-4 h-4" />}
                label="Account Security"
              />
            </div>
          </div>

          <div className="bg-card border border-border/60 rounded-[2.5rem] p-8 space-y-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
            <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest border-l-2 border-primary pl-3 relative z-10">
              Account Status
            </h4>
            <div className="space-y-5 relative z-10">
              <StatusItem
                icon={<CheckCircle2 className="w-4 h-4" />}
                label="Verified"
                status="Active"
                isDark={false}
              />
              <StatusItem
                icon={<Clock className="w-4 h-4" />}
                label="Member"
                status={user.createdAt ? new Date(user.createdAt).getFullYear().toString() : "2024"}
                isDark={false}
              />
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="lg:col-span-9">
          {activeTab === "profile" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <DashboardCard
                header={
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Edit3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black italic">Curate Your Profile.</h3>
                      <p className="text-sm font-medium text-muted-foreground">This information will be displayed publicly to other students and instructors.</p>
                    </div>
                  </div>
                }
              >
                <form ref={formRef} onSubmit={handleProfileUpdate} className="p-8 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Display Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          name="name"
                          defaultValue={user.name}
                          className="w-full bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email Address (Read-only)</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          readOnly
                          value={user.email}
                          className="w-full bg-secondary/10 border border-transparent rounded-2xl py-4 pl-12 pr-4 outline-none cursor-not-allowed text-muted-foreground font-bold text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Avatar Identity</label>
                    <div className="relative border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 rounded-[2rem] p-10 transition-all text-center cursor-pointer group overflow-hidden">
                      <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setImagePreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      {imagePreview ? (
                        <div className="relative z-0">
                          <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-2xl mx-auto object-cover shadow-lg border-2 border-primary/20" />
                          <p className="mt-3 font-black text-xs uppercase text-primary">New Identity Selected</p>
                        </div>
                      ) : (
                        <div className="relative z-0 space-y-3">
                          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                            <Upload className="w-7 h-7 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-black text-sm uppercase tracking-tight">Drop your visual identity here</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Supports JPG, PNG or WebP (Max 2MB)</p>
                          </div>
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-20 flex items-center justify-center animate-in fade-in">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Uploading...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      disabled={isUploading}
                      type="submit"
                      className="h-14 px-10 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isUploading ? "Synchronizing..." : "Synchronize Profile"}
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </DashboardCard>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <DashboardCard
                header={
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black italic">Lock Down Security.</h3>
                      <p className="text-sm font-medium text-muted-foreground">Manage your credentials and authentication your intellectual assets.</p>
                    </div>
                  </div>
                }
              >
                <div className="p-8 space-y-10">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background rounded-2xl py-4 px-6 outline-none transition-all font-bold text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Confirm New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background rounded-2xl py-4 px-6 outline-none transition-all font-bold text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => toast.success("Password update feature coming soon!")}
                        className="h-14 px-8 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-black/10"
                      >
                        Update Credentials <Shield className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <hr className="border-border/50" />

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                        <ExternalLink className="w-5 h-5" />
                      </div>
                      <h4 className="text-lg font-black italic">External Integrations</h4>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Link your account with external providers for faster authentication and data synchronization.</p>
                    <button className="w-full h-14 bg-secondary/50 hover:bg-secondary border border-border/60 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest transition-all">
                      Manage External Connections <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </DashboardCard>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ---------- COMPONENTS ----------
function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 font-black uppercase tracking-widest text-[10px]
        ${active
          ? "bg-primary text-white shadow-lg shadow-primary/20 translate-x-1"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-1"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatusItem({ icon, label, status, isDark = true }: { icon: React.ReactNode, label: string, status: string, isDark?: boolean }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className={`flex items-center gap-3 font-bold uppercase tracking-widest text-[9px] ${isDark ? "text-zinc-400" : "text-muted-foreground"}`}>
        <div className={`p-2 rounded-xl backdrop-blur-md border ${isDark ? "bg-zinc-800 text-primary border-zinc-700" : "bg-primary/10 text-primary border-primary/10"}`}>{icon}</div>
        {label}
      </span>
      <span className={`font-black italic text-sm ${isDark ? "text-primary" : "text-foreground"}`}>{status}</span>
    </div>
  );
}