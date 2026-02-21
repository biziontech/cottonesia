// hooks/useMenu.js
'use client';

import { useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getFilteredMenuByRoles } from '@/config/menu';

export function useMenu() {
  const { user, loading: authLoading } = useAuth();

  // Get user roles dari user object
  // Sesuaikan dengan struktur data user dari backend
  const userRoles = useMemo(() => {
    if (!user) return [];
    
    // Jika user punya property 'roles' (array of role objects)
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.map(role => role);
    }
    
    // Jika user punya property 'role' (single role string)
    if (user.role) {
      return [user.role];
    }
    
    // Fallback: empty array
    return [];
  }, [user]);

  // Filter menu berdasarkan user roles
  const filteredMenus = useMemo(() => {
    if (authLoading || userRoles.length === 0) return [];
    
    return getFilteredMenuByRoles(userRoles);
  }, [userRoles, authLoading]);

  // Process menus: add icon component dari Lucide
  const processedMenus = useMemo(() => {
    if (!filteredMenus || filteredMenus.length === 0) return [];

    return filteredMenus.map(menu => ({
      ...menu,
      icon_component: menu.icon && LucideIcons[menu.icon] 
        ? LucideIcons[menu.icon] 
        : LucideIcons.Home // Fallback icon
    }));
  }, [filteredMenus]);

  return { 
    menus: processedMenus, 
    loading: authLoading,
    userRoles // Expose user roles jika diperlukan
  };
}