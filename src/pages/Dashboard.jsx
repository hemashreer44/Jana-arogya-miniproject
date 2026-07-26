import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  User, Calendar, Clock, CheckCircle, XCircle, Ticket,
  Stethoscope, Building2, FileText, Heart, Phone,
  Download, Star, AlertCircle
} from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const [appointments, setAppointments] = useState([
  {
    id: 1,
    doctor_name: "Dr. Rajesh Kumar",
    hospital_name: "Victoria Hospital",
    appointment_date: "2026-07-30",
    appointment_time: "10:00 AM",
    status: "confirmed",
    token_number: 101,
  },
  {
    id: 2,
    doctor_name: "Dr. Priya Sharma",
    hospital_name: "Bowring Hospital",
    appointment_date: "2026-07-20",
    appointment_time: "11:30 AM",
    status: "completed",
    token_number: 102,
  },
]);

const { data: prescriptions = [] } = useQuery({
  queryKey: ['my-prescriptions'],
  queryFn: async () => [
    {
      id: 1,
      diagnosis: "Common Cold",
      doctor_name: "Dr. Priya Sharma",
      created_date: "2026-07-20",
      medicines: [
        {
          name: "Paracetamol",
          dosage: "500 mg",
          duration: "5 days"
        }
      ],
      follow_up_date: "2026-08-05"
    }
  ],
});
const cancelMutation = useMutation({
  mutationFn: async (id) => {
    return id;
  },

  onSuccess: (id) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: "cancelled" }
          : appointment
      )
    );

    toast.success("Appointment cancelled");
  },
});
  const today = new Date().toISOString().split('T')[0];

const upcoming = appointments.filter(
  (a) => a.appointment_date >= today && a.status !== "cancelled"
);

const past = appointments.filter(
  (a) =>
    a.appointment_date < today ||
    a.status === "completed" ||
    a.status === "cancelled"
);

const stats = {
  total: appointments.length,
  upcoming: upcoming.length,
  completed: appointments.filter((a) => a.status === "completed").length,
  cancelled: appointments.filter((a) => a.status === "cancelled").length,
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-8 border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-green-500 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl md:text-3xl font-bold">{user?.full_name || 'Patient'}</h1>
                  <p className="text-blue-100 text-sm">{user?.email}</p>
                  <div className="flex gap-2 mt-2">
                     <Badge className="bg-white/20 text-white border-white/30">
  Patient ID: {String(user?.id ?? "").slice(0, 8)}
</Badge>
                  </div>
                </div>
                <div className="ml-auto flex gap-2">
                  <Link to="/appointments">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50 gap-2">
                      <Calendar className="w-4 h-4" /> Book Appointment
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Appointments', value: stats.total, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: 'text-green-600', bg: 'bg-green-100' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
            { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="p-5 border-blue-100">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Emergency Health ID */}
        <Card className="mb-8 border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-800 text-lg">{t('emergencyHealthId')}</h3>
                <p className="text-sm text-red-600">Show this in case of emergency</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Health ID</p>
                <p className="font-mono font-bold text-lg text-red-800">
  JA-{String(user?.id ?? "").slice(0, 6).toUpperCase()}
</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="upcoming">
          <TabsList className="bg-white border mb-6">
            <TabsTrigger value="upcoming">{t('upcomingAppointments')} ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="history">{t('appointmentHistory')} ({past.length})</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions ({prescriptions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcoming.length === 0 ? (
              <Card className="p-10 text-center border-blue-100">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming appointments</p>
                <Link to="/appointments"><Button className="mt-4 bg-blue-600">Book Now</Button></Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcoming.map(a => (
                  <Card key={a.id} className="p-5 border-blue-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                        <Ticket className="w-7 h-7 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-blue-900">{a.doctor_name}</h3>
                          <Badge className={statusColors[a.status]}>{a.status}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {a.appointment_date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {a.appointment_time}</span>
                          <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {a.hospital_name}</span>
                        </div>
                        {a.token_number && (
                          <Badge className="mt-2 bg-blue-600 text-white">Token #{a.token_number}</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => cancelMutation.mutate(a.id)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {past.length === 0 ? (
              <Card className="p-10 text-center border-blue-100">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No appointment history</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {past.map(a => (
                  <Card key={a.id} className="p-4 border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <Stethoscope className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{a.doctor_name}</p>
                        <p className="text-xs text-gray-500">{a.appointment_date} • {a.hospital_name}</p>
                      </div>
                      <Badge className={statusColors[a.status]}>{a.status}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="prescriptions">
            {prescriptions.length === 0 ? (
              <Card className="p-10 text-center border-blue-100">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No prescriptions yet</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {prescriptions.map(p => (
                  <Card key={p.id} className="p-5 border-blue-100">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{p.diagnosis || 'Prescription'}</p>
                        <p className="text-sm text-gray-500">By {p.doctor_name} • {p.created_date ? format(new Date(p.created_date), 'dd MMM yyyy') : ''}</p>
                        {p.medicines?.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {p.medicines.map((m, i) => (
                              <p key={i} className="text-sm text-gray-600">• {m.name} — {m.dosage} ({m.duration})</p>
                            ))}
                          </div>
                        )}
                        {p.follow_up_date && (
                          <p className="text-sm text-blue-600 mt-2 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Follow-up: {p.follow_up_date}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}