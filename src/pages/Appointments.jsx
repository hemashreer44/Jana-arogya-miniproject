import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar, Stethoscope, Building2, Clock, CheckCircle, User,
  ArrowRight, Ticket, AlertCircle
} from 'lucide-react';

export default function Appointments() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    hospital_id: urlParams.get('hospital') || '',
    department: '',
    doctor_id: urlParams.get('doctor') || '',
    appointment_date: '',
    appointment_time: '',
    patient_name: user?.full_name || '',
    patient_phone: '',
    symptoms: '',
  });
  const [bookingResult, setBookingResult] = useState(null);

 const { data: hospitals = [] } = useQuery({
  queryKey: ['hospitals-list'],
  queryFn: async () => [
    {
      id: 1,
      name: "Victoria Hospital",
      location: "Bengaluru",
      available_beds: 120
    },
    {
      id: 2,
      name: "Bowring Hospital",
      location: "Shivajinagar",
      available_beds: 75
    },
    {
      id: 3,
      name: "KC General Hospital",
      location: "Malleshwaram",
      available_beds: 95
    }
  ],
});

const { data: doctors = [] } = useQuery({
  queryKey: ['doctors-list'],
  queryFn: async () => [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      department: "Cardiology",
      specialization: "Cardiologist",
      hospital_id: 1,
      hospital_name: "Victoria Hospital",
      is_available: true
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      department: "Pediatrics",
      specialization: "Pediatrician",
      hospital_id: 2,
      hospital_name: "Bowring Hospital",
      is_available: true
    },
    {
      id: 3,
      name: "Dr. Anil Reddy",
      department: "Orthopedics",
      specialization: "Orthopedic Surgeon",
      hospital_id: 3,
      hospital_name: "KC General Hospital",
      is_available: true
    }
  ],
});

  const filteredDoctors = doctors.filter(d => {
    if (form.hospital_id && d.hospital_id !== form.hospital_id) return false;
    if (form.department && d.department !== form.department) return false;
    return d.is_available;
  });

  const selectedDoctor = doctors.find(d => d.id === form.doctor_id);
  const selectedHospital = hospitals.find(h => h.id === form.hospital_id);

  const allDepartments = [...new Set(doctors.map(d => d.department).filter(Boolean))];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'
  ];

  useEffect(() => {
    if (urlParams.get('doctor')) {
      const doc = doctors.find(d => d.id === urlParams.get('doctor'));
      if (doc) {
        setForm(f => ({
          ...f,
          doctor_id: doc.id,
          hospital_id: doc.hospital_id || '',
          department: doc.department || '',
        }));
        setStep(3);
      }
    }
  }, [doctors]);

  const bookMutation = useMutation({
  mutationFn: async (data) => {
    const token = Math.floor(Math.random() * 900) + 100;

    return {
      ...data,
      id: Date.now(),
      patient_id: user?.id || 1,
      doctor_name: selectedDoctor?.name,
      hospital_name: selectedHospital?.name || selectedDoctor?.hospital_name,
      status: "confirmed",
      token_number: token,
    };
  },

  onSuccess: (result) => {
    setBookingResult(result);
    setStep(5);
    toast.success("Appointment booked successfully!");
  },
});

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {['Hospital', 'Department', 'Doctor', 'Details', 'Confirmed'].map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'
                }`}>
                  {step > i + 1 ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-xs mt-1 hidden sm:block ${step === i + 1 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{label}</span>
              </div>
              {i < 4 && <div className={`w-8 h-0.5 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Hospital */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Building2 className="w-6 h-6" /> {t('selectHospital')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hospitals.map(h => (
                  <button
                    key={h.id}
                    onClick={() => { update('hospital_id', h.id); setStep(2); }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:border-blue-400 hover:bg-blue-50 ${
                      form.hospital_id === h.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <p className="font-semibold text-blue-900">{h.name}</p>
                    <p className="text-sm text-gray-500">{h.location}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                        {h.available_beds} beds available
                      </Badge>
                    </div>
                  </button>
                ))}
                <Button variant="ghost" onClick={() => setStep(2)} className="w-full text-blue-600">
                  Skip — select any hospital <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Department */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Stethoscope className="w-6 h-6" /> {t('selectDepartment')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {allDepartments.map(dept => (
                    <button
                      key={dept}
                      onClick={() => { update('department', dept); setStep(3); }}
                      className={`p-4 rounded-xl border-2 text-left transition-all hover:border-green-400 hover:bg-green-50 ${
                        form.department === dept ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <Stethoscope className="w-5 h-5 text-green-600 mb-2" />
                      <p className="font-medium text-sm">{dept}</p>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button variant="ghost" onClick={() => setStep(3)} className="text-blue-600">Skip</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Doctor */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <User className="w-6 h-6" /> {t('selectDoctor')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredDoctors.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No available doctors found. Try different filters.</p>
                  </div>
                ) : (
                  filteredDoctors.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => { update('doctor_id', doc.id); setStep(4); }}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:border-blue-400 hover:bg-blue-50 ${
                        form.doctor_id === doc.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-blue-900">{doc.name}</p>
                          <p className="text-sm text-green-600">{doc.department} • {doc.specialization}</p>
                          <p className="text-xs text-gray-500">{doc.hospital_name}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Date/Time/Details */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Calendar className="w-6 h-6" /> Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {selectedDoctor && (
                  <div className="p-4 bg-blue-50 rounded-xl flex items-center gap-3">
                    <Stethoscope className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900">{selectedDoctor.name}</p>
                      <p className="text-sm text-blue-600">{selectedDoctor.department}</p>
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Patient Name *</Label>
                    <Input value={form.patient_name} onChange={(e) => update('patient_name', e.target.value)} placeholder="Enter your name" />
                  </div>
                  <div>
                    <Label>Mobile Number</Label>
                    <Input value={form.patient_phone} onChange={(e) => update('patient_phone', e.target.value)} placeholder="10-digit mobile" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>{t('selectDate')} *</Label>
                    <Input type="date" value={form.appointment_date} onChange={(e) => update('appointment_date', e.target.value)} min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <Label>{t('selectTime')} *</Label>
                    <Select value={form.appointment_time} onValueChange={(v) => update('appointment_time', v)}>
                      <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Symptoms / Reason for Visit</Label>
                  <Textarea value={form.symptoms} onChange={(e) => update('symptoms', e.target.value)} placeholder="Describe your symptoms briefly..." />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
                    disabled={!form.patient_name || !form.appointment_date || !form.appointment_time || bookMutation.isPending}
                    onClick={() => bookMutation.mutate(form)}
                  >
                    {bookMutation.isPending ? 'Booking...' : t('confirmBooking')}
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && bookingResult && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-green-200 bg-green-50">
              <CardContent className="text-center py-10">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Appointment Confirmed!</h2>
                <p className="text-green-600 mb-6">Your appointment has been successfully booked</p>

                <div className="bg-white rounded-2xl p-6 max-w-sm mx-auto shadow-lg border border-green-200 space-y-3">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Ticket className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-extrabold text-blue-800">#{bookingResult.token_number}</div>
                  <p className="text-sm text-gray-500">{t('tokenNumber')}</p>
                  <div className="border-t pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Doctor</span>
                      <span className="font-medium">{bookingResult.doctor_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date</span>
                      <span className="font-medium">{bookingResult.appointment_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Time</span>
                      <span className="font-medium">{bookingResult.appointment_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Hospital</span>
                      <span className="font-medium">{bookingResult.hospital_name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-center mt-8">
                  <Button onClick={() => { setStep(1); setForm({ hospital_id: '', department: '', doctor_id: '', appointment_date: '', appointment_time: '', patient_name: user?.full_name || '', patient_phone: '', symptoms: '' }); setBookingResult(null); }}
                    variant="outline" className="border-green-300">
                    Book Another
                  </Button>
                  <Link to="/dashboard">
                    <Button className="bg-green-600 hover:bg-green-700">View Dashboard</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}