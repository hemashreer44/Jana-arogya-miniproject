import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { Phone, Mail, MapPin, Shield, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-blue-900 to-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">+</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">{t('appName')}</h3>
                <p className="text-blue-300 text-xs">{t('subtitle')}</p>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Bridging the healthcare gap for BPL citizens across India. Free, accessible, and quality healthcare for every citizen.
            </p>
            <div className="flex items-center gap-2 mt-4 text-green-400 text-sm">
              <Shield className="w-4 h-4" />
              <span>A Government of India Initiative</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-blue-200">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/hospitals', label: t('hospitals') },
                { to: '/doctors', label: t('doctors') },
                { to: '/appointments', label: t('appointments') },
                { to: '/medicines', label: t('medicines') },
                { to: '/emergency', label: t('emergency') },
                { to: '/telemedicine', label: t('telemedicine') },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-blue-300 hover:text-white text-sm transition-colors flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-blue-200">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-blue-300">
                <Phone className="w-4 h-4 mt-0.5 text-green-400" />
                <div>
                  <p>Toll Free: 104</p>
                  <p>Emergency: 108</p>
                </div>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-300">
                <Mail className="w-4 h-4 mt-0.5 text-green-400" />
                <span>support@janaarogya.gov.in</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-300">
                <MapPin className="w-4 h-4 mt-0.5 text-green-400" />
                <span>Ministry of Health & Family Welfare, New Delhi</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-blue-200">Important Links</h4>
            <ul className="space-y-2 text-sm text-blue-300">
              <li><a href="#" className="hover:text-white transition-colors">Ayushman Bharat</a></li>
              <li><a href="#" className="hover:text-white transition-colors">National Health Mission</a></li>
              <li><a href="#" className="hover:text-white transition-colors">PMJAY Scheme</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Digital Health ID</a></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Help & Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-400 text-xs text-center">
            © 2025 Jana Arogya | Government of India | All Rights Reserved
          </p>
          <p className="text-blue-400 text-xs flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400" /> for the citizens of India
          </p>
        </div>
      </div>
    </footer>
  );
}