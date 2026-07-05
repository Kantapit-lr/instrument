import { User } from 'lucide-react';

export default function UserProfile() {
  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-semibold text-topbar-text">Kantapit Limpisawad</p>
        <p className="text-xs text-text-muted">kantapit.lim@student.mahidol.edu</p>
      </div>
      
      <div className="w-9 h-9 bg-mahidol-blue/10 text-mahidol-blue rounded-full flex items-center justify-center border border-mahidol-blue/20 shadow-sm">
        <User className="w-5 h-5" />
      </div>
    </div>
  );
}