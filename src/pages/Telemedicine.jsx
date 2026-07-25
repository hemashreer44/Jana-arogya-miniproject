import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Video, MessageCircle, Phone, Mic, MicOff, VideoOff,
  PhoneOff, Monitor, User, Send, Clock, Shield
} from 'lucide-react';

export default function Telemedicine() {
  const { t } = useLanguage();
  const [mode, setMode] = useState(null); // 'video' | 'chat'
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', text: 'Welcome to Jana Arogya Telemedicine. A doctor will connect with you shortly.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', text: chatInput }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'doctor',
        text: 'Thank you for your message. A doctor will review and respond shortly. For emergencies, please call 108.'
      }]);
    }, 1500);
  };

  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Video className="w-12 h-12 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('telemedicine')}</h1>
            <p className="text-teal-200 max-w-lg mx-auto">
              Consult with government doctors from the comfort of your home
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-teal-100 cursor-pointer" onClick={() => setMode('video')}>
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-teal-800 mb-2">Video Consultation</h3>
                  <p className="text-gray-500 mb-4">Face-to-face consultation with a doctor via video call</p>
                  <Badge className="bg-teal-100 text-teal-700">Recommended</Badge>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-blue-100 cursor-pointer" onClick={() => setMode('chat')}>
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">Chat Consultation</h3>
                  <p className="text-gray-500 mb-4">Text-based consultation with a doctor</p>
                  <Badge className="bg-blue-100 text-blue-700">Available 24/7</Badge>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Card className="mt-8 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6 flex items-start gap-3">
              <Shield className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-800">Important Notice</p>
                <p className="text-sm text-yellow-700">
                  Telemedicine is for non-emergency consultations only. For emergencies, please call 108 immediately or visit the nearest hospital.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === 'video') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Video Area */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-xl font-semibold mb-2">Waiting for doctor to join...</p>
              <p className="text-gray-400 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 animate-spin" /> Connecting...
              </p>
            </div>
          </div>

          {/* Self view */}
          <div className="absolute bottom-4 right-4 w-32 h-44 bg-gray-800 rounded-xl border-2 border-gray-700 flex items-center justify-center">
            {isVideoOff ? (
              <VideoOff className="w-8 h-8 text-gray-500" />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 p-6 flex justify-center gap-4">
          <Button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'}`}
            size="icon"
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>
          <Button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-14 h-14 rounded-full ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'}`}
            size="icon"
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </Button>
          <Button
            onClick={() => { setMode(null); toast.info('Call ended'); }}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700"
            size="icon"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
          <Button className="w-14 h-14 rounded-full bg-gray-600 hover:bg-gray-500" size="icon"
            onClick={() => setMode('chat')}>
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>
      </div>
    );
  }

  // Chat mode
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-blue-600 text-white p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setMode(null)} className="text-white hover:bg-blue-700">
          <PhoneOff className="w-5 h-5" />
        </Button>
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold">Doctor Chat</p>
          <p className="text-xs text-blue-200">Online • Telemedicine Consultation</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-md'
                : msg.role === 'doctor'
                ? 'bg-white border border-gray-200 text-gray-700 rounded-bl-md shadow-sm'
                : 'bg-gray-200 text-gray-600 rounded-bl-md'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t flex gap-2">
        <Input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendChat()}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button onClick={sendChat} className="bg-blue-600 hover:bg-blue-700" size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}