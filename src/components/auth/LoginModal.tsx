import React, { useState } from 'react';
import { 
  Lock, 
  User as UserIcon, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Pantalla de acceso obligatoria: no se puede cerrar sin iniciar sesión
  required?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, required = false }) => {
  const { users, loginWithCredentials, currentUser } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Ingresa tu nombre de usuario.');
      return;
    }
    if (!password) {
      setErrorMsg('Ingresa tu contraseña.');
      return;
    }

    setIsLoading(true);
    loginWithCredentials(username, password).then(res => {
      setIsLoading(false);
      if (res.success) {
        setUsername('');
        setPassword('');
        setErrorMsg('');
        onClose();
      } else {
        setErrorMsg(res.error || 'Credenciales incorrectas.');
      }
    });
  };

  const handleQuickFill = (user: typeof users[0]) => {
    setUsername(user.username);
    setPassword('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-stone-800/80 flex items-start justify-between">
          <div className="flex-1 flex flex-col items-center text-center">
            <img
              src="/brand/logo-karma-blanco.png"
              alt="kårma · Accesorios Buena Vibra"
              className="h-16 w-auto mb-4 select-none"
              draggable={false}
            />
            <h3 className="font-serif text-lg text-stone-100">Acceso por Rol</h3>
            <p className="text-xs text-stone-400">Ingresa tu usuario y contraseña</p>
          </div>
          {!required && <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 flex items-center justify-center transition-colors"
          >
            ✕
          </button>}
        </div>

        {/* Current Active Session Status */}
        {!required && <div className="px-6 py-2.5 bg-stone-950/60 border-b border-stone-800/60 flex items-center justify-between text-xs">
          <span className="text-stone-400">Sesión actual:</span>
          <span className="flex items-center space-x-1.5 font-medium text-amber-300">
            <span className={`w-2 h-2 rounded-full ${currentUser.avatar_color}`}></span>
            <span>{currentUser.name}</span>
            <span className="text-stone-500">({currentUser.role})</span>
          </span>
        </div>}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">Usuario</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej. admin, sha, teffy, vicky, extra"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <span>{isLoading ? 'Verificando...' : 'Iniciar Sesión'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick role selector for testing convenience */}
          <div className="pt-3 border-t border-stone-800">
            <p className="text-[11px] font-semibold text-stone-400 mb-2 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Selecciona tu usuario:</span>
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {users.map(u => (
                <button
                  key={u.user_id}
                  type="button"
                  onClick={() => handleQuickFill(u)}
                  className="text-left px-2.5 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-xs transition-colors flex items-center justify-between"
                >
                  <div className="truncate mr-1">
                    <span className="font-medium text-stone-200 block truncate">{u.name}</span>
                    <span className="text-[10px] text-stone-400 block font-mono">@{u.username}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-900 text-amber-300 shrink-0">
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-stone-400 mt-2 text-center">
              Rol <strong>Karma</strong>: solo venta en Terminal POS.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
