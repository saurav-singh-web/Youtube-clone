import { Home, ListVideo } from "lucide-react";
import { Link } from "react-router-dom";

const sidebarItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Your videos", icon: ListVideo, path: "/channel" },
];

function Sidebar({ isOpen }) {
  return (
    <aside className={`fixed md:sticky top-16 bottom-0 left-0 bg-white border-r border-gray-200 overflow-y-auto z-30 transition-all duration-200 flex-none ${isOpen ? 'w-60 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'} p-3`} style={{ height: 'calc(100vh - 64px)' }}>
      {sidebarItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 ${!isOpen && 'md:justify-center'}`} to={item.path} key={item.label}>
            <Icon size={20} className="min-w-[20px]" />
            <span className={!isOpen ? "md:hidden" : ""}>{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}

export default Sidebar;
