"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserIcon, Mail, Lock, Loader2 } from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";
import { loginUser, registerUser } from "@/services/api";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useWeatherStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = isLogin
        ? await loginUser(email, password)
        : await registerUser(username, email, password);

      const { token, user } = res.data;
      setUser(user, token);
      localStorage.setItem("ws-token", token);
      localStorage.setItem("ws-user", JSON.stringify(user));
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (isLogin ? "Invalid credentials." : "Error creating account."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)" }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card w-full max-w-sm p-8 relative border-white/10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>

          <h2 className="text-3xl font-bold text-accent mb-2">
            {isLogin ? "Welcome Back" : "SkyStore Account"}
          </h2>
          <p className="text-sm text-text-secondary mb-8">
            {isLogin
              ? "Sign in to sync your weather data"
              : "Join our community today"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <UserIcon
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-bg-primary border border-border text-text-primary outline-none focus:ring-2 focus:ring-accent/40"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-bg-primary border border-border text-text-primary outline-none focus:ring-2 focus:ring-accent/40"
                required
              />
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-bg-primary border border-border text-text-primary outline-none focus:ring-2 focus:ring-accent/40"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-bold text-center px-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-accent text-white font-bold hover:bg-accent-light transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {isLogin ? "Sign In" : "Register Now"}
            </button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-6">
            {isLogin ? "No account?" : "Have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-accent font-bold hover:underline"
            >
              {isLogin ? "Join SkyStore" : "Login"}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
