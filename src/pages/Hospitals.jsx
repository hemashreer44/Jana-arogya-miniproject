import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/LanguageContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, Building2, MapPin, Phone, Mail, Bed, Star,
  Stethoscope, Filter, ChevronRight
} from 'lucide-react';

export default function Hospitals() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const { data: hospitals = [], isLoading } = useQuery({
  queryKey: ['hospitals'],
  queryFn: async () => [
    {
      id: 1,
      name: "Victoria Hospital",
      location: "Bengaluru",
      district: "Bengaluru Urban",
      contact_phone: "080-26701150",
      available_beds: 120,
      total_beds: 200,
      rating: 4.8,
      departments: ["Cardiology", "Orthopedics", "Emergency"]
    },
    {
      id: 2,
      name: "Bowring Hospital",
      location: "Shivajinagar, Bengaluru",
      district: "Bengaluru Urban",
      contact_phone: "080-25591362",
      available_beds: 75,
      total_beds: 150,
      rating: 4.6,
      departments: ["General Medicine", "Pediatrics", "ENT"]
    },
    {
      id: 3,
      name: "KC General Hospital",
      location: "Malleshwaram, Bengaluru",
      district: "Bengaluru Urban",
      contact_phone: "080-23341771",
      available_beds: 95,
      total_beds: 180,
      rating: 4.7,
      departments: ["Gynecology", "Neurology", "Dermatology"]
    }
  ],
});

  const filtered = hospitals.filter(h =>
    h.name?.toLowerCase().includes(search.toLowerCase()) ||
    h.district?.toLowerCase().includes(search.toLowerCase()) ||
    h.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">{t('hospitals')}</h1>
          </div>
          <p className="text-blue-200 mb-6 max-w-lg">Find government hospitals near you with real-time bed availability</p>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
            <Input
              placeholder="Search by hospital name, district, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 py-6 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-blue-200 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Hospital Cards */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-blue-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-gray-500">No hospitals found</h3>
            <p className="text-gray-400">Try a different search term</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((hospital, i) => (
              <motion.div
                key={hospital.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border-blue-100 group">
                  <div className="h-44 bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
                    {hospital.image_url ? (
                      <img src={hospital.image_url} alt={hospital.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-blue-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white border-0">
                        <Bed className="w-3 h-3 mr-1" />
                        {hospital.available_beds || 0} / {hospital.total_beds || 0} beds
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-blue-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">{hospital.name}</h3>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                        <span>{hospital.location}</span>
                      </div>
                      {hospital.contact_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-500" />
                          <span>{hospital.contact_phone}</span>
                        </div>
                      )}
                      {hospital.rating > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium text-gray-700">{hospital.rating}</span>
                        </div>
                      )}
                    </div>
                    {hospital.departments?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {hospital.departments.slice(0, 3).map(d => (
                          <Badge key={d} variant="secondary" className="text-xs bg-blue-50 text-blue-600">{d}</Badge>
                        ))}
                        {hospital.departments.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100">+{hospital.departments.length - 3}</Badge>
                        )}
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <Link to={`/appointments?hospital=${hospital.id}`} className="flex-1">
                        <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-xs gap-1">
                          Book Appointment <ChevronRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}