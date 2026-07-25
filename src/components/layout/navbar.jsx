import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu, X, Home, Building2, Stethoscope, Calendar, Phone, Pill, Megaphone,
  User, LogOut, Settings, Globe, Eye, Type, LayoutDashboard, Shield, HelpCircle, Star
} from 'lucide-react';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
];

export default function Navbar() {
  const { t, language, changeLanguage, highContrast, toggleHighContrast, largeText, toggleLargeText } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('home'), icon: Home },
    { path: '/hospitals', label: t('hospitals'), icon: Building2 },
    { path: '/doctors', label: t('doctors'), icon: Stethoscope },
    { path: '/appointments', label: t('appointments'), icon: Calendar },
    { path: '/medicines', label: t('medicines'), icon: Pill },
    { path: '/announcements', label: t('announcements'), icon: Megaphone },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-green-600 text-white py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3" />
            <span>Government of India | Ministry of Health & Family Welfare</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button onClick={toggleHighContrast} className="flex items-center gap-1 hover:text-yellow-300 transition-colors">
              <Eye className="w-3 h-3" /> {highContrast ? 'Normal' : 'High Contrast'}
            </button>
            <button onClick={toggleLargeText} className="flex items-center gap-1 hover:text-yellow-300 transition-colors">
              <Type className="w-3 h-3" /> {largeText ? 'Normal Text' : 'Large Text'}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-yellow-300 transition-colors">
                <Globe className="w-3 h-3" /> {languages.find(l => l.code === language)?.label}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map(l => (
                  <DropdownMenuItem key={l.code} onClick={() => changeLanguage(l.code)}>
                    {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-lg">+</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-blue-800 leading-tight">{t('appName')}</h1>
              <p className="text-[10px] text-green-600 font-medium -mt-0.5">{t('subtitle')}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link to="/emergency">
              <Button variant="destructive" size="sm" className="animate-pulse-emergency hidden sm:flex gap-1.5 bg-red-600 hover:bg-red-700">
                <Phone className="w-4 h-4" />
                SOS
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-blue-200">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="hidden md:inline text-sm">{user.full_name?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> {t('dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/reviews" className="flex items-center gap-2">
                      <Star className="w-4 h-4" /> {t('reviews')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/help" className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" /> {t('help')}
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" /> {t('admin')}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/logout-action" className="flex items-center gap-2 text-red-600">
                      <LogOut className="w-4 h-4" /> {t('logout')}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-700">{t('login')}</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">{t('register')}</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">+</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-blue-800">{t('appName')}</h2>
                      <p className="text-xs text-green-600">{t('subtitle')}</p>
                    </div>
                  </div>
                  <nav className="space-y-1">
                    {navLinks.map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive(link.path) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                      </Link>
                    ))}
                    <Link to="/emergency" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 bg-red-50">
                      <Phone className="w-5 h-5" /> {t('emergencySOS')}
                    </Link>
                    <Link to="/telemedicine" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                      <Stethoscope className="w-5 h-5" /> {t('telemedicine')}
                    </Link>
                    <Link to="/help" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                      <HelpCircle className="w-5 h-5" /> {t('help')}
                    </Link>
                  </nav>

                  {/* Mobile language & accessibility */}
                  <div className="mt-6 pt-6 border-t space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {languages.map(l => (
                        <button
                          key={l.code}
                          onClick={() => changeLanguage(l.code)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            language === l.code ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={toggleHighContrast} className="flex-1 text-xs">
                        <Eye className="w-3 h-3 mr-1" /> Contrast
                      </Button>
                      <Button variant="outline" size="sm" onClick={toggleLargeText} className="flex-1 text-xs">
                        <Type className="w-3 h-3 mr-1" /> Text Size
                      </Button>
                    </div>
                  </div>

                  {!user && (
                    <div className="mt-6 space-y-2">
                      <Link to="/login" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full border-blue-200">{t('login')}</Button>
                      </Link>
                      <Link to="/register" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full bg-blue-600">{t('register')}</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}