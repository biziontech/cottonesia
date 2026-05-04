export const MENU_CONFIG = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        path: '/app/panel/dashboard',
        icon: 'Home',
        roles: ['ALL'],
        submenu: null
    },
    {
        id: "human_resources",
        is_label: true,
        name: "Human Resouces",
        roles: ['super_admin', 'hr', 'payroll']
    },
    {
        id: "schedule",
        path: '/app/panel/schedule',
        icon: 'CalendarDays',
        name: "Schedule",
        roles: ['super_admin', 'hr', 'payroll'],
        submenu: null
    },
    {
        id: "presence",
        path: '/app/panel/presence',
        icon: 'ClipboardCheck',
        name: "Attendance",
        roles: ['super_admin', 'hr', 'payroll'],
        submenu: null
    },
    {
        id: "permission",
        path: '/app/panel/permission',
        icon: 'FileCheck',
        name: "Leave & Permission",
        roles: ['super_admin', 'hr', 'payroll'],
        submenu: null
    },
    {
        id: "salary",
        path: '/app/panel/salary',
        icon: 'Banknote',
        name: "Payroll Manage",
        roles: ['super_admin', 'hr', 'payroll'],
        submenu: null
    },
    {
        id: "app",
        is_label: true,
        name: "Master Data",
        roles: ['super_admin']
    },
    {
        id: "shift",
        path: '/app/panel/shift',
        icon: 'CalendarDays',
        name: "Shift Operational",
        roles: ['super_admin', 'hr']
    },
    {
        id: 'department',
        name: 'Department',
        path: '/app/panel/department',
        icon: 'Building',
        roles: ['super_admin'],
        submenu: null
    },
    {
        id: 'employees',
        name: 'Employees',
        path: '/app/panel/employees',
        icon: 'Users',
        roles: ['super_admin'],
        submenu: null
    }

];

/**
 * Filter menu berdasarkan user roles
 * @param {Array} userRoles - Array roles yang dimiliki user (e.g., ['admin', 'staff'])
 * @returns {Array} - Filtered menu
 */
export const getFilteredMenuByRoles = (userRoles) => {
    if (!userRoles || userRoles.length === 0) return [];

    const filteredMenus = [];

    for (const menu of MENU_CONFIG) {
        // Cek apakah user punya akses ke menu ini
        const hasAccess = hasRoleAccess(userRoles, menu.roles);

        if (!hasAccess) continue;

        // Clone menu untuk tidak modify original
        const menuCopy = { ...menu };

        // Jika ada submenu, filter juga
        if (menuCopy.submenu && menuCopy.submenu.length > 0) {
            const filteredSubmenu = menuCopy.submenu.filter(sub =>
                hasRoleAccess(userRoles, sub.roles)
            );

            // Jika setelah filter submenu kosong, skip parent menu
            if (filteredSubmenu.length === 0) continue;

            menuCopy.submenu = filteredSubmenu;
        }

        filteredMenus.push(menuCopy);
    }

    return filteredMenus;
};

/**
 * Cek apakah user roles punya akses
 * @param {Array} userRoles - Roles yang dimiliki user
 * @param {Array} menuRoles - Roles yang boleh akses menu
 * @returns {boolean}
 */
const hasRoleAccess = (userRoles, menuRoles) => {
    // Jika menuRoles berisi 'ALL', langsung return true
    if (menuRoles.includes('ALL')) return true;
    // return   
    return userRoles.some(role => menuRoles.includes(role));
};

/**
 * Get single menu by ID
 * @param {string} menuId - ID menu
 * @param {Array} userRoles - User roles untuk filtering
 * @returns {Object|null}
 */
export const getMenuById = (menuId, userRoles) => {
    const filteredMenus = getFilteredMenuByRoles(userRoles);
    return filteredMenus.find(menu => menu.id === menuId) || null;
};

/**
 * Get breadcrumb dari path
 * @param {string} currentPath - Current pathname
 * @param {Array} userRoles - User roles
 * @returns {Array} - Array of breadcrumb items
 */
export const getBreadcrumbFromPath = (currentPath, userRoles) => {
    const filteredMenus = getFilteredMenuByRoles(userRoles);
    const breadcrumbs = [];

    for (const menu of filteredMenus) {
        // Cek jika menu path match
        if (menu.path === currentPath) {
            breadcrumbs.push({ name: menu.name, path: menu.path });
            break;
        }

        // Cek submenu
        if (menu.submenu) {
            const submenu = menu.submenu.find(sub => sub.path === currentPath);
            if (submenu) {
                breadcrumbs.push({ name: menu.name, path: null });
                breadcrumbs.push({ name: submenu.name, path: submenu.path });
                break;
            }
        }
    }

    return breadcrumbs;
};