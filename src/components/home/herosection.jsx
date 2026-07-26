import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Calendar,
  Phone,
  Stethoscope,
  ArrowRight,
  Heart,
  Shield,
  Users,
} from 'lucide-react';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-20 left-1/2 w-64 h-64 bg-yellow-50 rounded-full opacity-20 blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Government Healthcare Initiative
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-900 leading-tight mb-4">
              {t('tagline')}
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg mb-8">
              Free healthcare services for BPL families. Book appointments,
              find doctors and access emergency healthcare from anywhere.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/appointments">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 gap-2 px-6"
                >
                  <Calendar className="w-5 h-5" />
                  {t('bookAppointment')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link to="/doctors">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-blue-200 text-blue-700"
                >
                  <Stethoscope className="w-5 h-5" />
                  {t('searchDoctors')}
                </Button>
              </Link>

              <Link to="/emergency">
                <Button
                  size="lg"
                  variant="destructive"
                  className="gap-2"
                >
                  <Phone className="w-5 h-5" />
                  SOS
                </Button>
              </Link>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6">
              {[
                {
                  value: '500+',
                  label: 'Hospitals',
                  icon: Heart,
                },
                {
                  value: '2000+',
                  label: 'Doctors',
                  icon: Stethoscope,
                },
                {
                  value: '10L+',
                  label: 'Citizens Served',
                  icon: Users,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center md:text-left"
                >
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <stat.icon className="w-5 h-5 text-green-500" />
                    <span className="text-2xl md:text-3xl font-bold text-blue-900">
                      {stat.value}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
                    {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <img
                src="/images/doctor.png"
                alt="Healthcare"
                className="w-full rounded-3xl shadow-2xl object-cover"
              />

              {/* Floating Card 1 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-8 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-green-600" />
                </div>

                <div>
                  <p className="font-semibold text-blue-900 text-sm">
                    24/7 Available
                  </p>
                  <p className="text-xs text-gray-500">
                    Emergency Services
                  </p>
                </div>
              </motion.div>

              {/* Floating Card 2 */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute bottom-8 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>

                <div>
                  <p className="font-semibold text-blue-900 text-sm">
                    Free Booking
                  </p>
                  <p className="text-xs text-gray-500">
                    No charges for BPL
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}