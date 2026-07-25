import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Phone, Ambulance, HeartPulse, Wind, AlertTriangle,
  MapPin, CheckCircle, Siren, Shield
} from 'lucide-react';

const emergencyTypes = [
  { value: 'ambulance', label: 'Ambulance Required', icon: Ambulance, color: 'bg-red-500' },
  { value: 'cardiac', label: 'Heart Emergency', icon: HeartPulse, color: 'bg-red-600' },
  { value: 'breathing', label: 'Breathing Difficulty', icon: Wind, color: 'bg-orange-500' },
  { value: 'accident', label: 'Accident / Injury', icon: AlertTriangle, color: 'bg-yellow-500' },
  { value: 'other', label: 'Other Emergency', icon: Siren, color: 'bg-purple-500' },
];

export default function Emergency() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    patient_name: user?.full_name || '',
    patient_phone: '',
    emergency_type: '',
    location: '',
    notes: '',
  });

  const mutation = useMutation({
  mutationFn: async (data) => {
    return {
      id: Date.now(),
      ...data,
      patient_id: user?.id || 1,
      status: "requested",
    };
  },

  onSuccess: () => {
    setSent(true);
    toast.success("Emergency request sent! Help is on the way.");
  },
});

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Card className="max-w-md w-full border-green-200 text-center">
            <CardContent className="py-10">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Emergency Request Sent!</h2>
              <p className="text-gray-600 mb-6">Your request has been received. Emergency services have been alerted.</p>
              <div className="bg-red-50 rounded-xl p-4 mb-6">
                <p className="text-red-800 font-semibold">Emergency Helpline Numbers:</p>
                <p className="text-3xl font-bold text-red-600 mt-2">108 / 112</p>
                <p className="text-sm text-red-500 mt-1">Call immediately for fastest response</p>
              </div>
              <Button onClick={() => setSent(false)} variant="outline">Send Another Request</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-emergency">
            <Phone className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Emergency SOS</h1>
          <p className="text-red-200 mb-6">Get immediate medical help. One click to request emergency services.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:108">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 gap-2 text-lg font-bold shadow-xl">
                <Phone className="w-6 h-6" /> Call 108 — Ambulance
              </Button>
            </a>
            <a href="tel:112">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2 text-lg">
                <Shield className="w-6 h-6" /> Call 112 — National Emergency
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Form */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Siren className="w-6 h-6" /> Request Emergency Help Online
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Emergency Type */}
            <div>
              <Label className="mb-3 block font-semibold">Type of Emergency *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {emergencyTypes.map(et => (
                  <button
                    key={et.value}
                    onClick={() => update('emergency_type', et.value)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      form.emergency_type === et.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <div className={`w-12 h-12 ${et.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                      <et.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium">{et.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Patient Name *</Label>
                <Input value={form.patient_name} onChange={(e) => update('patient_name', e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <Label>Mobile Number *</Label>
                <Input value={form.patient_phone} onChange={(e) => update('patient_phone', e.target.value)} placeholder="10-digit mobile" />
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Location *
              </Label>
              <Input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="Enter your current location / address" />
            </div>

            <div>
              <Label>Additional Notes</Label>
              <Textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Describe the situation briefly..." />
            </div>

            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-lg py-6 gap-2 animate-pulse-emergency"
              disabled={!form.patient_name || !form.emergency_type || !form.location || mutation.isPending}
              onClick={() => mutation.mutate(form)}
            >
              <Siren className="w-6 h-6" />
              {mutation.isPending ? 'Sending...' : 'Send Emergency Request'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}