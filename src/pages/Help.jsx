import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { HelpCircle, MessageSquare, Phone, Mail, CheckCircle, Send } from 'lucide-react';

const faqs = [
  { q: 'How do I book an appointment?', a: 'Go to the Appointments page, select a hospital, department, and doctor, choose your preferred date and time, and confirm the booking. You will receive a token number.' },
  { q: 'Is this service free for BPL families?', a: 'Yes, all healthcare services through Jana Arogya are completely free for Below Poverty Line (BPL) cardholders. This includes consultations, basic medicines, and emergency services.' },
  { q: 'How do I access emergency services?', a: 'Click the SOS button on the homepage or go to the Emergency page. You can call 108 for an ambulance or 112 for national emergency helpline. You can also submit an online emergency request.' },
  { q: 'What is Ayushman Bharat / PMJAY scheme?', a: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana provides health cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization. It covers approximately 50 crore beneficiaries.' },
  { q: 'How do I check medicine availability?', a: 'Visit the Medicines page and search for the medicine name. You can see availability across government hospitals.' },
  { q: 'Can I consult a doctor online?', a: 'Yes, through our Telemedicine service. You can choose video consultation or text-based chat with government doctors.' },
  { q: 'How do I get my Health ID?', a: 'Your Health ID is automatically generated when you register. You can view it in your Dashboard under the Emergency Health ID section.' },
  { q: 'What documents do I need for registration?', a: 'Basic registration requires your name, mobile number, and password. Aadhaar number is optional but recommended for seamless healthcare services.' },
];

export default function Help() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    subject: '',
    message: '',
    category: 'other',
  });

  const mutation = useMutation({
  mutationFn: async (data) => {
    return {
      id: Date.now(),
      ...data,
      status: "submitted",
    };
  },

  onSuccess: () => {
    setSent(true);
    toast.success("Support ticket submitted!");
  },
});
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Help & Support</h1>
          </div>
          <p className="text-gray-300">Find answers or get in touch with our support team</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Quick Contact */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <Card className="p-5 text-center border-blue-100 hover:shadow-md transition-shadow">
            <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="font-semibold">Toll Free</p>
            <p className="text-2xl font-bold text-blue-600">104</p>
            <p className="text-xs text-gray-500">24/7 Health Helpline</p>
          </Card>
          <Card className="p-5 text-center border-red-100 hover:shadow-md transition-shadow">
            <Phone className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <p className="font-semibold">Emergency</p>
            <p className="text-2xl font-bold text-red-600">108</p>
            <p className="text-xs text-gray-500">Ambulance Service</p>
          </Card>
          <Card className="p-5 text-center border-green-100 hover:shadow-md transition-shadow">
            <Mail className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <p className="font-semibold">Email</p>
            <p className="text-sm font-bold text-green-600">support@janaarogya.gov.in</p>
            <p className="text-xs text-gray-500">We respond within 24 hrs</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-white rounded-xl border px-4">
                  <AccordionTrigger className="text-left font-medium text-sm">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
            {sent ? (
              <Card className="border-green-200 bg-green-50 text-center p-10">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Ticket Submitted!</h3>
                <p className="text-green-600">Our team will get back to you soon.</p>
                <Button onClick={() => setSent(false)} variant="outline" className="mt-4">Submit Another</Button>
              </Card>
            ) : (
              <Card className="border-gray-200">
                <CardContent className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><Label>Name *</Label><Input value={form.name} onChange={(e) => update('name', e.target.value)} /></div>
                    <div><Label>Email</Label><Input value={form.email} onChange={(e) => update('email', e.target.value)} /></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => update('phone', e.target.value)} /></div>
                    <div>
                      <Label>Category</Label>
                      <Select value={form.category} onValueChange={(v) => update('category', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appointment">Appointment Issue</SelectItem>
                          <SelectItem value="technical">Technical Problem</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="complaint">Complaint</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div><Label>Subject</Label><Input value={form.subject} onChange={(e) => update('subject', e.target.value)} placeholder="Brief subject" /></div>
                  <div><Label>Message *</Label><Textarea value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Describe your issue..." rows={4} /></div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                    disabled={!form.name || !form.message || mutation.isPending}
                    onClick={() => mutation.mutate(form)}
                  >
                    <Send className="w-4 h-4" /> {mutation.isPending ? 'Sending...' : 'Submit Ticket'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}