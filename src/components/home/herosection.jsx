import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, Calendar, Phone, Stethoscope, ArrowRight, Heart, Shield, Users } from 'lucide-react';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Decorative bg elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute top-20 left-1/2 w-64 h-64 bg-yellow-50 rounded-full opacity-20 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Government Healthcare Initiative
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-900 leading-tight mb-4">
              {t('tagline')}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              Free healthcare services for BPL families. Book appointments, find doctors, 
              and access emergency services — all from your phone.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/appointments">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2 text-base px-6 shadow-lg shadow-blue-200">
                  <Calendar className="w-5 h-5" />
                  {t('bookAppointment')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/doctors">
                <Button size="lg" variant="outline" className="gap-2 text-base border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Stethoscope className="w-5 h-5" />
                  {t('searchDoctors')}
                </Button>
              </Link>
              <Link to="/emergency">
                <Button size="lg" variant="destructive" className="gap-2 text-base animate-pulse-emergency">
                  <Phone className="w-5 h-5" />
                  SOS
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: '500+', label: 'Hospitals', icon: Heart },
                { value: '2000+', label: 'Doctors', icon: Stethoscope },
                { value: '10L+', label: 'Citizens Served', icon: Users },
              ].map((stat) => (
                <div key={stat.label} className="text-center md:text-left">
                  <div className="flex items-center gap-1.5 justify-center md:justify-start mb-1">
                    <stat.icon className="w-4 h-4 text-green-500" />
                    <span className="text-2xl md:text-3xl font-bold text-blue-800">{stat.value}</span>
                  </div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Image & Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600&h=700&fit=crop"
                alt="Healthcare"
                className="rounded-3xl shadow-2xl w-full max-w-md mx-auto object-cover aspect-[4/5]"
              />
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -left-8 top-20 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-blue-50"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-blue-800 text-sm">24/7 Available</p>
                  <p className="text-xs text-gray-500">Emergency Services</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -right-4 bottom-24 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-blue-50"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-blue-800 text-sm">Free Booking</p>
                  <p className="text-xs text-gray-500">No charges for BPL</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}