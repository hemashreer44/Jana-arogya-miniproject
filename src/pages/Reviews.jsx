import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Star, User, Building2, Stethoscope, Plus, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

function StarRating({ value, onChange, size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} onClick={() => onChange?.(i)} type="button">
          <Star className={`${sizes[size]} transition-colors ${i <= value ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ target_type: 'doctor', target_name: '', rating: 0, comment: '' });

  const { data: reviews = [] } = useQuery({
  queryKey: ["reviews"],
  queryFn: async () => [
    {
      id: 1,
      target_type: "doctor",
      target_name: "Dr. Rajesh Kumar",
      reviewer_name: "Hema",
      rating: 5,
      comment: "Very kind and professional doctor.",
      created_date: "2026-07-25",
    },
    {
      id: 2,
      target_type: "hospital",
      target_name: "Victoria Hospital",
      reviewer_name: "Rahul",
      rating: 4,
      comment: "Good service and clean environment.",
      created_date: "2026-07-24",
    },
  ],
});

const { data: doctors = [] } = useQuery({
  queryKey: ["doctors-rev"],
  queryFn: async () => [
    { id: 1, name: "Dr. Rajesh Kumar" },
    { id: 2, name: "Dr. Priya Sharma" },
    { id: 3, name: "Dr. Anil Reddy" },
  ],
});

const { data: hospitals = [] } = useQuery({
  queryKey: ["hospitals-rev"],
  queryFn: async () => [
    { id: 1, name: "Victoria Hospital" },
    { id: 2, name: "Bowring Hospital" },
    { id: 3, name: "KC General Hospital" },
  ],
});
  const submitMutation = useMutation({
  mutationFn: async (data) => {
    return {
      id: Date.now(),
      ...data,
      reviewer_name: user?.full_name || "Guest",
      reviewer_id: user?.id || 1,
    };
  },

  onSuccess: () => {
    setShowForm(false);
    setForm({
      target_type: "doctor",
      target_name: "",
      rating: 0,
      comment: "",
    });

    toast.success("Review submitted!");
  },
});
  const targets = form.target_type === 'doctor' ? doctors : hospitals;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Ratings & Reviews</h1>
              </div>
              <p className="text-indigo-200">Share your experience to help other citizens</p>
            </div>
            {user && (
              <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-indigo-600 hover:bg-indigo-50 gap-2">
                    <Plus className="w-4 h-4" /> Write Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Review For</Label>
                      <Select value={form.target_type} onValueChange={(v) => setForm(f => ({ ...f, target_type: v, target_name: '', target_id: '' }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="hospital">Hospital</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Select {form.target_type === 'doctor' ? 'Doctor' : 'Hospital'}</Label>
                      <Select value={form.target_id || ''} onValueChange={(v) => {
                        const target = targets.find(t => t.id === v);
                        setForm(f => ({ ...f, target_id: v, target_name: target?.name }));
                      }}>
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>
                          {targets.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Rating</Label>
                      <StarRating value={form.rating} onChange={(v) => setForm(f => ({ ...f, rating: v }))} size="lg" />
                    </div>
                    <div>
                      <Label>Comment</Label>
                      <Textarea value={form.comment} onChange={(e) => setForm(f => ({ ...f, comment: e.target.value }))} placeholder="Share your experience..." />
                    </div>
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      disabled={!form.target_id || !form.rating || submitMutation.isPending}
                      onClick={() => submitMutation.mutate(form)}
                    >
                      {submitMutation.isPending ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-gray-500">No reviews yet</h3>
            <p className="text-gray-400">Be the first to share your experience</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="border-indigo-100">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{r.is_anonymous ? 'Anonymous' : r.reviewer_name || 'User'}</span>
                          <Badge variant="secondary" className="text-xs">
                            {r.target_type === 'doctor' ? <Stethoscope className="w-3 h-3 mr-1" /> : <Building2 className="w-3 h-3 mr-1" />}
                            {r.target_name}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {r.created_date ? format(new Date(r.created_date), 'dd MMM yyyy') : ''}
                          </span>
                        </div>
                        <StarRating value={r.rating} size="sm" />
                        {r.comment && <p className="text-gray-600 mt-2 text-sm">{r.comment}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}