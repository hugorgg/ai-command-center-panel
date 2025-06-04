
import React, { useState } from 'react';
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
  Menu,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Layout() {
  const { user, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      <div className={cn(
        "bg-[#161b22] border-r border-[#30363d] flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header with toggle button */}
        <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">ComandAI</h1>
              <p className="text-sm text-[#9ca3af] mt-1">{user?.nome}</p>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs bg-[#70a5ff] text-white rounded">
                  {user?.plano}
                </span>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[#9ca3af] hover:text-white hover:bg-[#21262d] h-8 w-8"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center text-sm font-medium rounded-md transition-colors group",
                  isCollapsed ? "px-3 py-3 justify-center" : "px-3 py-2",
                  isActive
                    ? 'bg-[#70a5ff] text-white'
                    : 'text-[#9ca3af] hover:text-white hover:bg-[#21262d]'
                )
              }
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && item.name}
            </NavLink>
          ))}
        </nav>

        {/* User Actions */}
        <div className="p-4 border-t border-[#30363d]">
          <Button
            onClick={signOut}
            variant="ghost"
            className={cn(
              "text-[#9ca3af] hover:text-white hover:bg-[#21262d] transition-colors",
              isCollapsed ? "w-8 h-8 p-0" : "w-full justify-start"
            )}
            title={isCollapsed ? "Sair" : undefined}
          >
            <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && "Sair"}
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
