import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { UserCircle } from 'lucide-react';

const TopNav = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
      <h2 className="text-xl font-semibold text-text">
        Welcome back, {user?.name.split(' ')[0]}
      </h2>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-text">{user?.name}</p>
          <p className="text-xs text-text/60 capitalize">{user?.role}</p>
        </div>
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <UserCircle size={24} />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
