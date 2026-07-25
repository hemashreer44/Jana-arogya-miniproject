import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';
import {
  Calendar, Stethoscope, Building2, Pill, Phone, Video,
  FileText, Heart, Megaphone, Star, HelpCircle, Shield
} from 'lucide-react';

const services = [
  { icon: Calendar, label: 'Book Appointment', path: '/appointments', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
  { icon: Stethoscope, label: 'Find Doctors', path: '/doctors', color: 'from-green-500 to-green-600', bg: 'bg-green-50' },
  { icon: Building2, label: 'Hospital Directory', path: '/hospitals', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
  { icon: Pill, label: 'Check Medicines', path: '/medicines', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50' },
  { icon: Phone, label: 'Emergency SOS', path: '/emergency', color: 'from-red-500 to-red-600', bg: 'bg-red-50' },
  { icon: Video, label: 'Telemedicine', path: '/telemedicine', color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50' },
  { icon: Megaphone, label: 'Announcements', path: '/announcements', color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50' },
  { icon: Star, label: 'Reviews', path: '/reviews', color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50' },
  { icon: Shield, label: 'Health Schemes', path: '/announcements', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
  { icon: FileText, label: 'Prescriptions', path: '/dashboard', color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50' },
  { icon: Heart, label: 'Health ID', path: '/dashboard', color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50' },
  { icon: HelpCircle, label: 'Help & Support', path: '/help', color: 'from-gray-500 to-gray-600', bg: 'bg-gray-50' },
];

export default function QuickServices() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">{t('quickServices')}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Access all healthcare services at your fingertips</p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {services.map((service, i) => (
            <motion.div
              key={service.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={service.path}
                className={`${service.bg} rounded-2xl p-5 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border border-transparent hover:border-blue-100`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center leading-tight">{service.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}