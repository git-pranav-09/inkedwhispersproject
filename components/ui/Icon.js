import {
  Feather, Users, Compass, BookOpen, Sparkles, Eye, Star, CircleCheck, CircleX, FilePen, Globe,
  DoorOpen, Lock, Archive, Mail, MailOpen, CircleMinus, Circle, PenLine, Mic, Lightbulb, Award,
} from 'lucide-react';

// Whitelisted icons that may be referenced by name from config/database.
const ICONS = {
  Feather, Users, Compass, BookOpen, Sparkles, Eye, Star, CircleCheck, CircleX, FilePen, Globe,
  DoorOpen, Lock, Archive, Mail, MailOpen, CircleMinus, Circle, PenLine, Mic, Lightbulb, Award,
};

export default function Icon({ name, ...props }) {
  const Cmp = ICONS[name] || Circle;
  return <Cmp aria-hidden="true" {...props} />;
}
