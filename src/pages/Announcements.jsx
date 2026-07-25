import React, { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Megaphone, Shield, AlertTriangle, Syringe, Clock } from 'lucide-react';
import { format } from 'date-fns';

const categoryMeta = {
  scheme: { icon: Shield, color: 'text-green-600', bg: 'bg-green-100' },
  vaccination: { icon: Syringe, color: 'text-blue-600', bg: 'bg-blue-100' },
  alert: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  general: { icon: Megaphone, color: 'text-yellow-600', bg: 'bg-yellow-100' },
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
};

export default function Announcements() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');

  const { data: announcements = [], isLoading } = useQuery({
  queryKey: ["announcements"],
  queryFn: async () => [
    {
      id: 1,
      title: "Free Health Check-up Camp",
      description: "A free health check-up camp will be held at Victoria Hospital on Sunday.",
      category: "general",
      priority: "medium",
      created_date: "2026-07-25",
      is_active: true,
    },
    {
      id: 2,
      title: "COVID-19 Vaccination Drive",
      description: "COVID-19 booster doses are available at all government hospitals.",
      category: "vaccination",
      priority: "high",
      created_date: "2026-07-24",
      is_active: true,
    },
    {
      id: 3,
      title: "Ayushman Bharat Scheme",
      description: "Eligible families can receive free treatment under the Ayushman Bharat scheme.",
      category: "scheme",
      priority: "medium",
      created_date: "2026-07-23",
      is_active: true,
    },
    {
      id: 4,
      title: "Heat Wave Alert",
      description: "Stay hydrated and avoid direct sunlight during peak afternoon hours.",
      category: "alert",
      priority: "urgent",
      created_date: "2026-07-22",
      is_active: true,
    }
  ],
});

  const filtered = filter === 'all' ? announcements : announcements.filter(a => a.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Megaphone className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">{t('announcements')}</h1>
          </div>
          <p className="text-yellow-100">Latest government health updates, schemes, and vaccination drives</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={filter} onValueChange={setFilter} className="mb-8">
          <TabsList className="bg-white border">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="scheme">Schemes</TabsTrigger>
            <TabsTrigger value="vaccination">Vaccination</TabsTrigger>
            <TabsTrigger value="alert">Alerts</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded-xl animate-pulse border" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-gray-500">No announcements found</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((a, i) => {
              const meta = categoryMeta[a.category] || categoryMeta.general;
              const Icon = meta.icon;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow border-yellow-100">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-6 h-6 ${meta.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="secondary" className={`text-xs ${meta.bg} ${meta.color}`}>{a.category}</Badge>
                          <Badge variant="secondary" className={`text-xs ${priorityColors[a.priority]}`}>{a.priority}</Badge>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {a.created_date ? format(new Date(a.created_date), 'dd MMM yyyy') : ''}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">{a.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{a.content}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}