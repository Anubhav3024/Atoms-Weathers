"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Key,
  Mail,
  Star,
  Shield,
  Smartphone,
  Check,
  X,
  LogOut,
  Save,
} from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";

export default function ProfilePanel() {
  const { user, searchHistory, toggleFavorite, logout, updateProfile } =
    useWeatherStore();

  const [editEmail, setEditEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(user?.email || "");
  const [changePassword, setChangePassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center max-w-md mx-auto"
      >
        <div className="w-20 h-20 rounded-full bg-bg-primary flex items-center justify-center mx-auto mb-6 border border-border">
          <UserIcon size={32} className="text-text-muted" />
        </div>
        <h3 className="text-2xl font-black text-text-primary mb-2 tracking-tight">
          Not Signed In
        </h3>
        <p className="text-text-secondary text-sm mb-8">
          Sign in to your SkyStore account to sync your favorite cities and
          custom alerts across all devices.
        </p>
      </motion.div>
    );
  }

  const handleUpdate = async (field: "email" | "password") => {
    setLoading(true);
    setMsg(null);
    try {
      if (field === "email") {
        await updateProfile({ email: emailInput });
        setEditEmail(false);
        setMsg({ type: "success", text: "Email updated successfully" });
      } else {
        await updateProfile({ password: passwordInput });
        setChangePassword(false);
        setPasswordInput("");
        setMsg({ type: "success", text: "Password updated successfully" });
      }
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Update failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-10"
    >
      {/* Header Profile */}
      <div className="glass-card p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
        <div className="w-32 h-32 rounded-[40px] bg-accent flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-accent/30 relative">
          {user.username?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest">
            Premium Member
          </span>
          <h2 className="text-4xl font-black text-text-primary tracking-tighter">
            {user.username}
          </h2>
          <p className="text-text-secondary flex items-center justify-center md:justify-start gap-2">
            <Mail size={16} className="text-accent" /> {user.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Settings */}
        <div className="space-y-6">
          <h3 className="px-2 font-black text-xs uppercase tracking-widest text-text-muted flex items-center gap-2">
            <Shield size={14} className="text-accent" /> Security & Privacy
          </h3>

          {msg && (
            <div
              className={`px-4 py-2 rounded-xl text-sm font-bold ${msg.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
            >
              {msg.text}
            </div>
          )}

          <div className="glass-card divide-y divide-border/50">
            {/* Password Item */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-bg-primary flex items-center justify-center text-text-muted">
                    <Key size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">
                      Change Password
                    </p>
                    <p className="text-xs text-text-secondary">
                      Suggest updating regularly
                    </p>
                  </div>
                </div>
                {!changePassword && (
                  <button
                    onClick={() => setChangePassword(true)}
                    className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              <AnimatePresence>
                {changePassword && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 flex gap-2">
                      <input
                        type="password"
                        placeholder="New Password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="flex-1 bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
                      />
                      <button
                        onClick={() => handleUpdate("password")}
                        disabled={loading}
                        className="p-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setChangePassword(false)}
                        className="p-2 bg-bg-primary border border-border rounded-lg hover:bg-bg-card"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Email Item */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-bg-primary flex items-center justify-center text-text-muted">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">
                      Primary Email
                    </p>
                    <p className="text-xs text-text-secondary">{user.email}</p>
                  </div>
                </div>
                {!editEmail && (
                  <button
                    onClick={() => setEditEmail(true)}
                    className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              <AnimatePresence>
                {editEmail && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 flex gap-2">
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="flex-1 bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
                      />
                      <button
                        onClick={() => handleUpdate("email")}
                        disabled={loading}
                        className="p-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditEmail(false)}
                        className="p-2 bg-bg-primary border border-border rounded-lg hover:bg-bg-card"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2FA Item (Mock) */}
            <div className="flex items-center justify-between p-5 hover:bg-white/5 transition-colors group cursor-not-allowed opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-bg-primary flex items-center justify-center text-text-muted">
                  <Smartphone size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">
                    Two-Factor Auth
                  </p>
                  <p className="text-xs text-text-secondary">
                    Disabled (Coming Soon)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Content Overview */}
        <div className="space-y-6 flex flex-col">
          <h3 className="px-2 font-black text-xs uppercase tracking-widest text-text-muted flex items-center gap-2">
            <Star size={14} className="text-accent" /> Quick Overview
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-6 flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-text-primary">
                {user.favorites.length}
              </span>
              <span className="text-sm font-bold text-text-secondary">
                Favorites
              </span>
            </div>
            <div className="glass-card p-6 flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-text-primary">
                {searchHistory.length}
              </span>
              <span className="text-sm font-bold text-text-secondary">
                History
              </span>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 flex-1">
            <h4 className="text-sm font-bold text-text-primary">
              Recent Favorites
            </h4>
            <div className="space-y-2">
              {user.favorites.slice(0, 3).map((fav) => (
                <div
                  key={fav}
                  className="flex items-center justify-between p-3 rounded-xl bg-bg-primary border border-border"
                >
                  <span className="text-sm font-medium">{fav}</span>
                  <button
                    onClick={() => toggleFavorite(fav)}
                    className="text-amber-400"
                  >
                    <Star size={14} fill="currentColor" />
                  </button>
                </div>
              ))}
              {user.favorites.length === 0 && (
                <p className="text-xs text-text-muted italic">
                  No favorite cities yet.
                </p>
              )}
            </div>
          </div>

          {/* Logout Button (Moved to bottom of Profile Panel) */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-3 py-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all font-bold shadow-lg"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </div>
    </motion.div>
  );
}
