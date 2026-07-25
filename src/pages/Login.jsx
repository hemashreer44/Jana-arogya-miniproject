import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LogIn,
  Mail,
  Lock,
  Loader2,
  User,
  Stethoscope,
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";

const portalLabels = {
  patient: {
    icon: User,
    title: "Patient Portal",
    subtitle: "Sign in to manage your healthcare",
  },
  doctor: {
    icon: Stethoscope,
    title: "Doctor Portal",
    subtitle: "Sign in to manage your practice",
  },
};

export default function Login() {
  const navigate = useNavigate();

  const [portal, setPortal] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const active = portalLabels[portal];

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          portal,
        })
      );

      setLoading(false);
      navigate("/");
    }, 1000);
  };

  const handleGoogle = () => {
    alert("Google Login will be added later.");
  };

  return (
    <AuthLayout
      icon={active.icon}
      title={active.title}
      subtitle={active.subtitle}
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Create one
          </Link>
        </>
      }
    >
      <div className="flex rounded-xl bg-muted p-1 mb-6">
        {Object.entries(portalLabels).map(([key, { icon: Icon, title }]) => (
          <button
            key={key}
            type="button"
            onClick={() => setPortal(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              portal === key
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {title}
          </button>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 mb-6"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">or</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Email</Label>

          <div className="relative mt-2">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

            <Input
              type="email"
              placeholder="you@example.com"
              className="pl-10 h-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between">
            <Label>Password</Label>

            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="relative mt-2">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

            <Input
              type="password"
              placeholder="••••••••"
              className="pl-10 h-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              <LogIn className="mr-2 w-4 h-4" />
              Sign In
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}