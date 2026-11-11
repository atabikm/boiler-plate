import { NavLink } from "react-router-dom";

interface SidebarProps {
    collapsed: boolean;
}

// Daftar menu — daftarkan modul baru di sini agar muncul di sidebar
const NAV_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Warehouses', path: '/warehouses', icon: 'warehouse' },
    { label: 'Accounts', path: '/accounts', icon: 'account_balance' },
    { label: 'Sales Orders', path: '/sales-orders', icon: 'shopping_bag'},
    { label: 'Purchase Orders', path: '/purchase-orders', icon: 'shopping_cart' },
    { label: 'Products', path: '/products', icon: 'storefront' },
    { label: 'Partners', path: '/partners', icon: 'people' },
    { label: 'Stock Movement', path: '/stock-movements', icon: 'inventory_2' },
    { label: 'Inventory', path: '/inventory-stocks', icon: 'inventory' },
    { label: 'Journal', path: '/journals', icon: 'description' },
];

export default function Sidebar({ collapsed }: SidebarProps) {
    return (
        <aside className={`bg-black text-gray-300 transition-all duration-300 flex flex-col ${
            collapsed ? 'w-16' : 'w-64'
        }`}>
            <div className="h-16 flex items-center px-4 border-b border-gray-800 font-bold text-white text-lg tracking-wider">
                {collapsed ? 'LMS' : 'LMS System'}
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                    <NavLink key={item.path} to={item.path} className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800'}`
                    }>
                        {/* Nama icon ditulis sebagai isi teks span — ikon diambil dari font Material Icons */}
                        <span className="material-icons-outlined mr-2 text-xl">{item.icon}</span>
                        {collapsed ? null : item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}
