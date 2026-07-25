import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Mail, Lock, Loader2, User, Stethoscope, Building2, Phone, GraduationCap, Languages } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";

const DEPARTMENTS = [
  "General Medicine", "Cardiology", "Pediatrics", "Orthopedics",
  "Gynecology", "Dermatology", "ENT", "Ophthalmology",
  "Neurology", "Psychiatry", "Dentistry", "Pulmonology",
  "Gastroenterology", "Nephrology", "Oncology", "Urology",
];

const portalLabels = {
  patient: { icon: User, title: "Patient Registration", subtitle: "Create your healthcare account" },
  doctor: { icon: Stethoscope, title: "Doctor Registration", subtitle: "Join our government healthcare network" },
};

export default function Register() {
  const [portal, setPortal] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // Doctor fields
  const [doctorName, setDoctorName] = useState("");
  const [department, setDepartment] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [phone, setPhone] = useState("");
  const [languages, setLanguages] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [doctorStep, setDoctorStep] = useState(0);
  const [hospitals, setHospitals] = useState([]);

  const active = portalLabels[portal];

  useEffect(() => {
    if (portal === "doctor") {
      base44.entities.Hospital.list().then(setHospitals).catch(() => {});
    }
  }, [portal]);

  const isDoctor = portal === "doctor";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (isDoctor && !doctorName) {
      setError("Please enter your full name");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }

      // If doctor, update role and create Doctor entity
      if (isDoctor && doctorName && department) {
        const hospital = hospitals.find(h => h.id === hospitalId);
        await base44.auth.updateMe({ role: "doctor" });

        const me = await base44.auth.me();
        await base44.entities.Doctor.create({
          name: doctorName,
          department,
          specialization: specialization || department,
          qualification: qualification || "MBBS",
          experience_years: parseInt(experienceYears) || 0,
          phone: phone || undefined,
          email: email,
          languages: languages ? languages.split(",").map(s => s.trim()) : [],
          hospital_id: hospitalId || undefined,
          hospital_name: hospital ? hospital.name : "Not Assigned",
          user_id: me.id,
          is_available: true,
          consultation_fee: 0,
          rating: 0,
          total_reviews: 0,
        });
      }

      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({ title: "Code sent", description: "Check your email for the new code." });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/");
  };

  if (showOtp) {
    return (
      <AuthLayout icon={Mail} title="Verify your email" subtitle={`We sent a code to ${email}`}>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}
        <div className="flex justify-center mb-6">
          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button className="w-full h-12 font-medium" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</> : "Verify"}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Didn't receive the code?{" "}
          <button onClick={handleResend} className="text-primary font-medium hover:underline">Resend</button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={active.icon}
      title={active.title}
      subtitle={active.subtitle}
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </>
      }
    >
      {/* Portal Toggle */}
      <div className="flex rounded-xl bg-muted p-1 mb-6">
        {Object.entries(portalLabels).map(([key, { icon: Icon, title }]) => (
          <button
            key={key}
            onClick={() => { setPortal(key); setError(""); setDoctorStep(0); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              portal === key ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {title}
          </button>
        ))}
      </div>

      <Button variant="outline" className="w-full h-12 text-sm font-medium mb-6" onClick={handleGoogle}>
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">or</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Doctor extra fields */}
        {isDoctor && (
          <>
            {doctorStep === 0 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="doctorName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="doctorName" placeholder="Dr. Full Name" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} className="pl-10 h-12" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input id="specialization" placeholder="e.g., Heart Surgery, Child Health" value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="h-12" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input id="qualification" placeholder="MBBS, MD" value={qualification} onChange={(e) => setQualification(e.target.value)} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (Years)</Label>
                    <Input id="experience" type="number" placeholder="5" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} className="h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Hospital</Label>
                  <Select value={hospitalId} onValueChange={setHospitalId}>
                    <SelectTrigger className="h-12">
                      <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select your hospital" />
                    </SelectTrigger>
                    <SelectContent>
                      {hospitals.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" className="w-full h-12 font-medium" onClick={() => setDoctorStep(1)}>
                  Continue <span className="ml-1 opacity-60">— Account Details</span>
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <button type="button" onClick={() => setDoctorStep(0)} className="text-sm text-primary hover:underline">
                    ← Back
                  </button>
                  <span className="text-sm text-muted-foreground">Step 2: Account Details</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="languages">Languages (comma separated)</Label>
                  <div className="relative">
                    <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="languages" placeholder="Kannada, English, Hindi" value={languages} onChange={(e) => setLanguages(e.target.value)} className="pl-10 h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="password" type="password" autoComplete="new-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-12" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="confirm" type="password" autoComplete="new-password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-12" required />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</> : "Create Account"}
                </Button>
              </>
            )}
          </>
        )}

        {/* Patient fields */}
        {!isDoctor && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" autoComplete="email" autoFocus placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type="password" autoComplete="new-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-12" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="confirm" type="password" autoComplete="new-password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-12" required />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</> : "Create Account"}
            </Button>
          </>
        )}
      </form>
    </AuthLayout>
  );
}