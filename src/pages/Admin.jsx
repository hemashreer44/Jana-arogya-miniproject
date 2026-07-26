import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Stethoscope, Calendar, Megaphone,
  Plus, Pencil, Trash2, Users, Pill, BarChart3, Activity
} from 'lucide-react';

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function HospitalManager() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', district: '', contact_phone: '', total_beds: 100, available_beds: 50, departments: [] });
  const [deptInput, setDeptInput] = useState('');

  const { data: hospitals = [] } = useQuery({ queryKey: ['admin-hospitals'], queryFn: () => base44.entities.Hospital.list() });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Hospital.create({ ...data, is_active: true }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-hospitals'] }); setShowForm(false); toast.success('Hospital added!'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Hospital.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-hospitals'] }); toast.success('Hospital deleted'); },
  });

  const addDept = () => { if (deptInput.trim()) { setForm(f => ({ ...f, departments: [...f.departments, deptInput.trim()] })); setDeptInput(''); } };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Hospitals ({hospitals.length})</h3>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild><Button className="gap-2 bg-blue-600"><Plus className="w-4 h-4" /> Add Hospital</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add Hospital</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><Label>Location *</Label><Input value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>District</Label><Input value={form.district} onChange={(e) => setForm(f => ({ ...f, district: e.target.value }))} /></div>
                <div><Label>Phone</Label><Input value={form.contact_phone} onChange={(e) => setForm(f => ({ ...f, contact_phone: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Total Beds</Label><Input type="number" value={form.total_beds} onChange={(e) => setForm(f => ({ ...f, total_beds: Number(e.target.value) }))} /></div>
                <div><Label>Available Beds</Label><Input type="number" value={form.available_beds} onChange={(e) => setForm(f => ({ ...f, available_beds: Number(e.target.value) }))} /></div>
              </div>
              <div>
                <Label>Departments</Label>
                <div className="flex gap-2">
                  <Input value={deptInput} onChange={(e) => setDeptInput(e.target.value)} placeholder="Department name" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDept())} />
                  <Button type="button" onClick={addDept} variant="outline">Add</Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.departments.map((d, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {d} <button onClick={() => setForm(f => ({ ...f, departments: f.departments.filter((_, j) => j !== i) }))} className="text-xs">×</button>
                    </Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-blue-600" onClick={() => createMutation.mutate(form)} disabled={!form.name || !form.location}>
                {createMutation.isPending ? 'Adding...' : 'Add Hospital'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {hospitals.map(h => (
        <Card key={h.id} className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{h.name}</p>
              <p className="text-xs text-gray-500 truncate">{h.location}</p>
            </div>
            <Badge className="bg-green-100 text-green-700">{h.available_beds}/{h.total_beds} beds</Badge>
            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteMutation.mutate(h.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function DoctorManager() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', department: '', specialization: '', hospital_id: '', hospital_name: '', qualification: '', experience_years: 5, available_time_start: '09:00', available_time_end: '17:00', is_available: true, consultation_fee: 0 });

  const { data: doctors = [] } = useQuery({ queryKey: ['admin-doctors'], queryFn: () => base44.entities.Doctor.list() });
  const { data: hospitals = [] } = useQuery({ queryKey: ['admin-hosp-list'], queryFn: () => base44.entities.Hospital.list() });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Doctor.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-doctors'] }); setShowForm(false); toast.success('Doctor added!'); },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_available }) => base44.entities.Doctor.update(id, { is_available }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-doctors'] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Doctors ({doctors.length})</h3>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild><Button className="gap-2 bg-green-600"><Plus className="w-4 h-4" /> Add Doctor</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add Doctor</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Department *</Label><Input value={form.department} onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))} /></div>
                <div><Label>Specialization</Label><Input value={form.specialization} onChange={(e) => setForm(f => ({ ...f, specialization: e.target.value }))} /></div>
              </div>
              <div>
                <Label>Hospital</Label>
                <Select value={form.hospital_id} onValueChange={(v) => {
                  const h = hospitals.find(h => h.id === v);
                  setForm(f => ({ ...f, hospital_id: v, hospital_name: h?.name }));
                }}>
                  <SelectTrigger><SelectValue placeholder="Select hospital" /></SelectTrigger>
                  <SelectContent>{hospitals.map(h => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Qualification</Label><Input value={form.qualification} onChange={(e) => setForm(f => ({ ...f, qualification: e.target.value }))} /></div>
                <div><Label>Experience (yrs)</Label><Input type="number" value={form.experience_years} onChange={(e) => setForm(f => ({ ...f, experience_years: Number(e.target.value) }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Available From</Label><Input type="time" value={form.available_time_start} onChange={(e) => setForm(f => ({ ...f, available_time_start: e.target.value }))} /></div>
                <div><Label>Available To</Label><Input type="time" value={form.available_time_end} onChange={(e) => setForm(f => ({ ...f, available_time_end: e.target.value }))} /></div>
              </div>
              <Button className="w-full bg-green-600" onClick={() => createMutation.mutate(form)} disabled={!form.name || !form.department}>
                {createMutation.isPending ? 'Adding...' : 'Add Doctor'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {doctors.map(d => (
        <Card key={d.id} className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{d.name}</p>
              <p className="text-xs text-gray-500">{d.department} • {d.hospital_name}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{d.is_available ? 'Available' : 'Unavailable'}</span>
              <Switch checked={d.is_available} onCheckedChange={(v) => toggleMutation.mutate({ id: d.id, is_available: v })} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function AnnouncementManager() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'general', priority: 'medium' });

  const { data: announcements = [] } = useQuery({ queryKey: ['admin-announcements'], queryFn: () => base44.entities.Announcement.list('-created_date') });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Announcement.create({ ...data, is_active: true }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-announcements'] }); setShowForm(false); toast.success('Announcement posted!'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Announcement.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-announcements'] }); toast.success('Deleted'); },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Announcements ({announcements.length})</h3>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild><Button className="gap-2 bg-yellow-600"><Plus className="w-4 h-4" /> New Announcement</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Announcement</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div><Label>Content *</Label><Textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} rows={4} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheme">Scheme</SelectItem>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => setForm(f => ({ ...f, priority: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full bg-yellow-600" onClick={() => createMutation.mutate(form)} disabled={!form.title || !form.content}>
                {createMutation.isPending ? 'Posting...' : 'Post Announcement'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {announcements.map(a => (
        <Card key={a.id} className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{a.title}</p>
              <div className="flex gap-1 mt-1">
                <Badge variant="secondary" className="text-xs">{a.category}</Badge>
                <Badge variant="secondary" className="text-xs">{a.priority}</Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteMutation.mutate(a.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth();

  const { data: hospitals = [] } = useQuery({ queryKey: ['stats-hosp'], queryFn: () => base44.entities.Hospital.list() });
  const { data: doctors = [] } = useQuery({ queryKey: ['stats-doc'], queryFn: () => base44.entities.Doctor.list() });
  const { data: appointments = [] } = useQuery({ queryKey: ['stats-appt'], queryFn: () => base44.entities.Appointment.list() });
  const { data: users = [] } = useQuery({ queryKey: ['stats-users'], queryFn: () => base44.entities.User.list() });

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Hospitals" value={hospitals.length} icon={Building2} color="text-blue-600" bg="bg-blue-100" />
          <StatCard label="Doctors" value={doctors.length} icon={Stethoscope} color="text-green-600" bg="bg-green-100" />
          <StatCard label="Appointments" value={appointments.length} icon={Calendar} color="text-purple-600" bg="bg-purple-100" />
          <StatCard label="Users" value={users.length} icon={Users} color="text-orange-600" bg="bg-orange-100" />
        </div>

        <Tabs defaultValue="hospitals">
          <TabsList className="bg-white border mb-6">
            <TabsTrigger value="hospitals"><Building2 className="w-4 h-4 mr-1" /> Hospitals</TabsTrigger>
            <TabsTrigger value="doctors"><Stethoscope className="w-4 h-4 mr-1" /> Doctors</TabsTrigger>
            <TabsTrigger value="announcements"><Megaphone className="w-4 h-4 mr-1" /> Announcements</TabsTrigger>
          </TabsList>
          <TabsContent value="hospitals"><HospitalManager /></TabsContent>
          <TabsContent value="doctors"><DoctorManager /></TabsContent>
          <TabsContent value="announcements"><AnnouncementManager /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}