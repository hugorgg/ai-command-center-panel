
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Activity
} from 'lucide-react';

export function Layout() {
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Agendamentos', href: '/agendamentos', icon: Calendar },
    { name: 'Atendimentos', href: '/atendimentos', icon: Users },
    { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#30363d]">
          <h1 className="text-xl font-bold text-white">ComandAI</h1>
          <p className="text-sm text-[#9ca3af] mt-1">{user?.nome}</p>
          <span className="inline-block mt-2 px-2 py-1 text-xs bg-[#70a5ff] text-white rounded">
            {user?.plano}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-[#70a5ff] text-white'
                    : 'text-[#9ca3af] hover:text-white hover:bg-[#21262d]'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User Actions */}
        <div className="p-4 border-t border-[#30363d]">
          <Button
            onClick={signOut}
            variant="ghost"
            className="w-full justify-start text-[#9ca3af] hover:text-white hover:bg-[#21262d]"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
