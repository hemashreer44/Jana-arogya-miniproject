import React from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Megaphone, ArrowRight, AlertTriangle, Shield, Syringe } from 'lucide-react';

const categoryIcons = {
  scheme: Shield,
  vaccination: Syringe,
  alert: AlertTriangle,
  general: Megaphone,
};

const categoryColors = {
  scheme: 'bg-green-100 text-green-700 border-green-200',
  vaccination: 'bg-blue-100 text-blue-700 border-blue-200',
  alert: 'bg-red-100 text-red-700 border-red-200',
  general: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

export default function AnnouncementsBanner() {
  const { t } = useLanguage();
  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements-home'],
    queryFn: async () => [
  {
    id: 1,
    title: "Free Health Check-up Camp",
    content: "Free health check-up camp will be conducted on Sunday at Victoria Hospital.",
    category: "general",
    priority: "normal"
  },
  {
    id: 2,
    title: "COVID-19 Vaccination Drive",
    content: "COVID-19 booster dose is available for all eligible citizens.",
    category: "vaccination",
    priority: "urgent"
  },
  {
    id: 3,
    title: "New Government Health Scheme",
    content: "Ayushman Bharat scheme registration is now open.",
    category: "scheme",
    priority: "normal"
  },
  {
    id: 4,
    title: "Heat Wave Alert",
    content: "Stay hydrated and avoid going outside during peak afternoon hours.",
    category: "alert",
    priority: "urgent"
  }
],
  });

  if (announcements.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-2">{t('announcements')}</h2>
            <p className="text-gray-500">Latest government health updates</p>
          </div>
          <Link to="/announcements">
            <Button variant="outline" className="gap-2 border-blue-200 text-blue-700">
              {t('viewAll')} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {announcements.map((a, i) => {
            const Icon = categoryIcons[a.category] || Megaphone;
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl border border-blue-100 p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[a.category]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className={`text-xs ${categoryColors[a.category]}`}>
                    {a.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-blue-900 mb-2 line-clamp-2">{a.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-3">{a.content}</p>
                {a.priority === 'urgent' && (
                  <Badge variant="destructive" className="mt-3 text-xs">Urgent</Badge>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}