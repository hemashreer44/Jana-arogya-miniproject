import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/LanguageContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Search, Pill, CheckCircle, XCircle, Building2, Package } from 'lucide-react';

export default function Medicines() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const { data: medicines = [], isLoading } = useQuery({
  queryKey: ["medicines"],
  queryFn: async () => [
    {
      id: 1,
      name: "Paracetamol",
      generic_name: "Acetaminophen",
      category: "Pain Relief",
      hospital_name: "Victoria Hospital",
      is_available: true,
      quantity: 250,
    },
    {
      id: 2,
      name: "Amoxicillin",
      generic_name: "Amoxicillin",
      category: "Antibiotic",
      hospital_name: "Bowring Hospital",
      is_available: true,
      quantity: 120,
    },
    {
      id: 3,
      name: "Metformin",
      generic_name: "Metformin",
      category: "Diabetes",
      hospital_name: "KC General Hospital",
      is_available: false,
      quantity: 0,
    },
    {
      id: 4,
      name: "Cetirizine",
      generic_name: "Cetirizine",
      category: "Allergy",
      hospital_name: "Victoria Hospital",
      is_available: true,
      quantity: 95,
    }
  ],
});

  const filtered = medicines.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.generic_name?.toLowerCase().includes(search.toLowerCase()) ||
    m.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Pill className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">{t('medicines')}</h1>
          </div>
          <p className="text-orange-200 mb-6">Check medicine availability in government hospitals</p>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300 w-5 h-5" />
            <Input
              placeholder="Search medicine name, generic name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 py-6 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-orange-200"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-40 bg-white rounded-xl animate-pulse border" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-gray-500">No medicines found</h3>
            <p className="text-gray-400">Try a different search term</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((med, i) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="p-5 hover:shadow-lg transition-all border-orange-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                      <Pill className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{med.name}</h3>
                      {med.generic_name && <p className="text-sm text-gray-500">{med.generic_name}</p>}
                      {med.category && (
                        <Badge variant="secondary" className="text-xs mt-1 bg-orange-50 text-orange-700">{med.category}</Badge>
                      )}
                    </div>
                    <Badge className={med.is_available
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-red-100 text-red-700 border-red-200'
                    }>
                      {med.is_available ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      {med.is_available ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                    {med.hospital_name && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {med.hospital_name}
                      </span>
                    )}
                    {med.quantity_available > 0 && (
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" /> Qty: {med.quantity_available} {med.unit}
                      </span>
                    )}
                    {med.price === 0 && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">Free</Badge>
                    )}
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