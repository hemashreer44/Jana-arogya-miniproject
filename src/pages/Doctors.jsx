import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/LanguageContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, Stethoscope, Star, Clock, CheckCircle, XCircle,
  Building2, Calendar, User
} from 'lucide-react';

const departments = [
  'All Departments', 'General Medicine', 'Pediatrics', 'Orthopedics',
  'Cardiology', 'Gynecology', 'ENT', 'Ophthalmology', 'Dermatology',
  'Neurology', 'Psychiatry', 'Dental', 'Emergency Medicine'
];

export default function Doctors() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');

  const { data: doctors = [], isLoading } = useQuery({
  queryKey: ['doctors'],
  queryFn: async () => [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      specialization: "Cardiologist",
      hospital_name: "Victoria Hospital",
      qualification: "MBBS, MD",
      rating: 4.8,
      experience_years: 12,
      is_available: true,
      available_time_start: "09:00 AM",
      available_time_end: "01:00 PM",
      consultation_fee: 0
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      specialization: "Pediatrician",
      hospital_name: "Bowring Hospital",
      qualification: "MBBS, DCH",
      rating: 4.9,
      experience_years: 10,
      is_available: true,
      available_time_start: "10:00 AM",
      available_time_end: "02:00 PM",
      consultation_fee: 0
    },
    {
      id: 3,
      name: "Dr. Anil Reddy",
      specialization: "Orthopedic Surgeon",
      hospital_name: "KC General Hospital",
      qualification: "MBBS, MS",
      rating: 4.7,
      experience_years: 15,
      is_available: true,
      available_time_start: "11:00 AM",
      available_time_end: "04:00 PM",
      consultation_fee: 0
    }
  ],
});

  const filtered = doctors.filter(d => {
    const matchSearch = d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
      d.hospital_name?.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All Departments' || d.department === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Stethoscope className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">{t('doctors')}</h1>
          </div>
          <p className="text-green-200 mb-6 max-w-lg">Find available doctors across government hospitals</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-300 w-5 h-5" />
              <Input
                placeholder="Search doctor name, specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 py-6 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-green-200"
              />
            </div>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-full sm:w-52 bg-white/10 border-white/20 text-white h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-56 animate-pulse border" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-gray-500">No doctors found</h3>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-green-100">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center overflow-hidden shrink-0">
                      {doc.image_url ? (
                        <img src={doc.image_url} alt={doc.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-blue-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-blue-900 truncate">{doc.name}</h3>
                      <p className="text-sm text-green-600 font-medium">{doc.specialization || doc.department}</p>
                      <p className="text-xs text-gray-500 truncate">{doc.qualification}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Building2 className="w-4 h-4 text-blue-400" />
                      <span className="truncate">{doc.hospital_name || 'Government Hospital'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{doc.rating || '4.5'}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{doc.experience_years || 10}+ yrs</span>
                    </div>
                    {doc.available_time_start && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <span>{doc.available_time_start} - {doc.available_time_end}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <Badge className={doc.is_available
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-red-100 text-red-700 border-red-200'
                    }>
                      {doc.is_available ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      {doc.is_available ? 'Available' : 'Unavailable'}
                    </Badge>
                    {doc.consultation_fee === 0 && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">Free Consultation</Badge>
                    )}
                  </div>

                  <Link to={`/appointments?doctor=${doc.id}`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700 gap-2" disabled={!doc.is_available}>
                      <Calendar className="w-4 h-4" />
                      Book Appointment
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}