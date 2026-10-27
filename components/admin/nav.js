import {
  LayoutDashboard, FileText, Briefcase, CalendarDays, Archive, Mail, MessageSquare, Users, PenSquare, Settings,
} from 'lucide-react';

export const adminNav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/applications', label: 'Applications', icon: FileText, countKey: 'newApplications' },
  { href: '/admin/positions', label: 'Positions', icon: Briefcase },
  { href: '/admin/events', label: 'Events', icon: CalendarDays },
  { href: '/admin/past-events', label: 'Past Events', icon: Archive },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/messages', label: 'Contact Messages', icon: MessageSquare, countKey: 'unreadMessages' },
  { href: '/admin/core', label: 'Core Members', icon: Users },
  { href: '/admin/content', label: 'Website Content', icon: PenSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];
