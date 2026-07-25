import React from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Stethoscope, Clock, CheckCircle } from 'lucide-react';

export default function FeaturedDoctors() {
  const { data: doctors = [] } = useQuery({
    queryKey: ['featured-doctors'],
    queryFn: async () => [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    specialization: "Cardiologist",
    hospital_name: "Victoria Hospital",
    rating: 4.8,
    experience_years: 12,
    is_available: true,
    available_time_start: "09:00 AM",
    available_time_end: "01:00 PM"
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    specialization: "Pediatrician",
    hospital_name: "Bowring Hospital",
    rating: 4.9,
    experience_years: 10,
    is_available: true,
    available_time_start: "10:00 AM",
    available_time_end: "02:00 PM"
  },
  {
    id: 3,
    name: "Dr. Anil Reddy",
    specialization: "Orthopedic Surgeon",
    hospital_name: "KC General Hospital",
    rating: 4.7,
    experience_years: 15,
    is_available: true,
    available_time_start: "11:00 AM",
    available_time_end: "04:00 PM"
  }
],
  });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Top Doctors</h2>
            <p className="text-gray-500">Experienced government healthcare professionals</p>
          </div>
          <Link to="/doctors">
            <Button variant="outline" className="gap-2 border-blue-200 text-blue-700">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-blue-100 p-6 hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {doc.image_url ? (
                    <img src={doc.image_url} alt={doc.name} className="w-full h-full object-cover" />
                  ) : (
                    <Stethoscope className="w-8 h-8 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-blue-900 truncate">{doc.name}</h3>
                  <p className="text-sm text-gray-500">{doc.specialization || doc.department}</p>
                  <p className="text-xs text-green-600 font-medium mt-0.5">{doc.hospital_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-gray-700">{doc.rating || '4.5'}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">{doc.experience_years || 10}+ yrs exp</span>
                <span className="text-gray-300">•</span>
                <Badge variant="secondary" className={doc.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {doc.is_available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>

              {doc.available_time_start && (
                <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {doc.available_time_start} - {doc.available_time_end}
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <Link to={`/appointments?doctor=${doc.id}`} className="flex-1">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-xs">
                    Book Appointment
                  </Button>
                </Link>
                <Link to={`/doctors?id=${doc.id}`}>
                  <Button size="sm" variant="outline" className="text-xs border-blue-200">
                    Profile
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}