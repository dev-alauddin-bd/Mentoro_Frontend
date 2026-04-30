"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Camera,
  Edit3,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  Upload,
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useSyncFirebaseMutation } from "@/redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";

// ---------- TYPES ----------
type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  isCaps?: boolean;
};

type StatusItemProps = {
  icon: React.ReactNode;
  label: string;
  status: string;
};

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.cmAuth);
  
  const [syncFirebase] = useSyncFirebaseMutation();
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    const file = (formData.get("avatar") as File);
    const name = formData.get("name") as string;

    try {
      let avatarUrl = user.avatar || "";

      // 1. Upload to Cloudinary if file exists
      if (file && file.size > 0) {
        const cloudData = new FormData();
        cloudData.append("file", file);
        cloudData.append("upload_preset", "course_thumbnails");

        const cloudRes = await fetch(
          "https://api.cloudinary.com/v1_1/dyfamn6rm/image/upload",
          { method: "POST", body: cloudData }
        );
        const cloudJson = await cloudRes.json();
        avatarUrl = cloudJson.secure_url;
      }

      // 2. Sync with Firebase Profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: avatarUrl
        });
      }

      // 3. Sync with Backend
      const response = await syncFirebase({
        email: user.email,
        name: name,
        avatar: avatarUrl
      }).unwrap();

      // 4. Update Redux State
      dispatch(setUser({ user: response.data.user, token: response.data.accessToken }));
      
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
    <div className="container mx-auto p-4 md:p-8 max-w-5xl space-y-12">

      {/* HEADER */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
          <Shield className="w-3.5 h-3.5" /> Identity & Security
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic">
          Your Personal Identity.
        </h1>

        <p className="text-muted-foreground font-medium max-w-xl">
          Manage your public appearance and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="space-y-8">

          {/* PROFILE CARD */}
          <div className="bg-card border rounded-[3rem] p-10 text-center group shadow-xl relative overflow-hidden">

            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full scale-110"></div>
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                alt={user.name} 
                className="w-full h-full rounded-full object-cover border-4 border-background relative z-10"
              />
            </div>

            <h2 className="text-2xl font-black mt-6">{user.name}</h2>

            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-[10px] font-bold uppercase">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Verified {user.role}
            </div>
          </div>

          {/* STATUS */}
          <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 space-y-6">
            <h4 className="text-sm font-black uppercase text-primary">
              Account Status
            </h4>

            <div className="space-y-4">
              <StatusItem
                icon={<CheckCircle2 className="w-4 h-4" />}
                label="Email Verified"
                status="Active"
              />

              <StatusItem
                icon={<Clock className="w-4 h-4" />}
                label="Member Since"
                status={
                  user.createdAt
                    ? new Date(user.createdAt).getFullYear().toString()
                    : "N/A"
                }
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-8 bg-card border rounded-[3rem] p-10">

          {/* BASIC INFO */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black">Basic Information</h3>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <InfoItem icon={<Shield />} label="Role" value={user.role} isCaps />
              <InfoItem icon={<Calendar />} label="Member Since" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Present"} />
            </div>

            <form ref={formRef} onSubmit={handleProfileUpdate} className="space-y-6 bg-secondary/30 p-6 rounded-2xl border border-border">
              <h4 className="text-sm font-bold uppercase text-primary mb-4 flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Edit Profile
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Display Name</label>
                  <input 
                    name="name" 
                    defaultValue={user.name} 
                    className="w-full bg-background border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Avatar Image</label>
                  <div className="relative border-2 border-dashed border-muted-foreground/30 rounded-xl px-4 py-6 hover:bg-background transition-colors text-center cursor-pointer overflow-hidden">
                    <input 
                      type="file" 
                      name="avatar" 
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <span className="text-sm font-medium text-muted-foreground">Click or Drag to Upload to Cloudinary</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button disabled={isUploading} type="submit" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold uppercase text-xs hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2">
                  {isUploading ? "Uploading Data..." : "Save Changes"} <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          <hr />

          {/* BIO */}
          <div>
            <h3 className="text-2xl font-black mb-4">Bio</h3>

            <div className="p-6 bg-secondary/30 rounded-2xl">
              <p className="text-muted-foreground italic">
                {user.bio || "No bio added yet."}
              </p>
            </div>
          </div>

          <hr />

          {/* PASSWORD UPDATE */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black">Security & Password</h3>
            
            <form className="space-y-4 bg-secondary/30 p-6 rounded-2xl border border-border">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">New Password</label>
                  <input 
                    type="password"
                    placeholder="Min 6 characters" 
                    className="w-full bg-background border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Confirm Password</label>
                  <input 
                    type="password"
                    placeholder="Repeat new password" 
                    className="w-full bg-background border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none" 
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="button" onClick={() => toast.success("Password update feature coming soon!")} className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs hover:bg-zinc-800 transition-all flex items-center gap-2">
                  Update Password <Shield className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* BUTTON */}
          <button className="w-full h-14 bg-secondary hover:bg-secondary/70 rounded-2xl flex items-center justify-center gap-2 font-bold uppercase text-xs">
            Connect External Accounts <ExternalLink className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

// ---------- COMPONENTS ----------
function InfoItem({ icon, label, value, isCaps }: InfoItemProps) {
  return (
    <div>
      <p className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-2">
        {icon} {label}
      </p>
      <p className={`text-lg font-bold ${isCaps ? "capitalize" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function StatusItem({ icon, label, status }: StatusItemProps) {
  return (
    <div className="flex justify-between text-sm">
      <span className="flex items-center gap-2 text-gray-300">
        {icon} {label}
      </span>
      <span className="font-bold text-primary">{status}</span>
    </div>
  );
}