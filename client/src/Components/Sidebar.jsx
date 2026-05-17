import {
  Home,
  Flame,
  Music,
  Gamepad2,
  Trophy,
  Newspaper,
  Clapperboard,
  PlaySquare,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

function Sidebar({ mobileOpen, desktopCollapsed, setMobileOpen }) {
  const location = useLocation();

  const sidebarWidth = desktopCollapsed ? "md:w-20" : "md:w-60";
  const isCollapsed = desktopCollapsed;
  console.log("iscollapse", isCollapsed);
  console.log("mobileOpen", mobileOpen);

  const menuItems = [
    {
      id: 1,
      name: "Home",
      icon: Home,
      path: "/",
    },
    {
      id: 2,
      name: "Trending",
      icon: Flame,
    },
    {
      id: 3,
      name: "Music",
      icon: Music,
    },
    {
      id: 4,
      name: "Gaming",
      icon: Gamepad2,
    },
    {
      id: 5,
      name: "Sports",
      icon: Trophy,
    },
    {
      id: 6,
      name: "News",
      icon: Newspaper,
    },
    {
      id: 7,
      name: "Movies",
      icon: Clapperboard,
    },
  ];

  const handleItemClick = () => {
  if (mobileOpen) {
    setMobileOpen(false);
  }
};

  return (


    <>


      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-64px)]
          bg-black border-r border-zinc-800
          transition-all duration-300 z-40
          overflow-y-auto

          w-60
          ${sidebarWidth}

          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col py-3 px-2 gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive = location.pathname === item.path;

            // ONLY HOME WORKS
            if (item.path) {
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={handleItemClick}
                  className={`
                  flex items-center gap-5
                  px-4 py-3 rounded-xl
                  transition-all duration-200
                  group
                  ${isActive
                      ? "bg-zinc-800 text-white"
                      : "hover:bg-zinc-900 text-zinc-300"
                    }
                `}
                >
                  <Icon className="w-6 h-6 min-w-[24px]" />


                  {isCollapsed == false && (
                    <span className="font-medium text-sm">
                      {item.name}
                    </span>
                  )}

                  {(isCollapsed == true && mobileOpen == true) && (
                    <span className="font-medium text-sm">
                      {item.name}
                    </span>
                  )}

                </Link>
              );
            }

            return (
              <button
                key={item.id}
                className="
                flex items-center gap-5
                px-4 py-3 rounded-xl
                hover:bg-zinc-900
                text-zinc-300
                transition-all duration-200
                text-left
              "
              >
                <Icon className="w-6 h-6 min-w-[24px]" />

                {isCollapsed == false && (
                  <span className="font-medium text-sm">
                    {item.name}
                  </span>
                )}

                {(isCollapsed == true && mobileOpen == true) && (
                  <span className="font-medium text-sm">
                    {item.name}
                  </span>
                )}

              </button>
            );
          })}
        </div>

        {/* SUBSCRIPTIONS */}

        <div className="border-t border-zinc-800 mt-3 px-3 py-4">
          {isCollapsed == false && (
            <h2 className="text-white text-sm font-semibold mb-4 px-2">
              Subscriptions
            </h2>
          )}

          {(isCollapsed == true && mobileOpen == true) && (
            <h2 className="text-white text-sm font-semibold mb-4 px-2">
              Subscriptions
            </h2>
          )}

          <div className="flex flex-col gap-2">
            {["Apna College", "code_baithak", "Internshala Training"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-900 cursor-pointer transition"
              >
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                  <PlaySquare className="text-white w-4 h-4" />
                </div>
                {isCollapsed == false && (
                  <span className="text-zinc-300 text-sm">
                    {item}
                  </span>
                )}

                {(isCollapsed == true && mobileOpen == true) && (
                  <span className="text-zinc-300 text-sm">
                    {item}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </aside>
    </>
  );
}

export default Sidebar;