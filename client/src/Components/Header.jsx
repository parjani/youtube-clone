import { useEffect, useState, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
    Menu,
    Search,
    Mic,
    Bell,
    Video,
    User,
    LogOut,
} from "lucide-react";

function Header({ toggleSidebar }) {
    const [search, setSearch] = useState("");
    const dropdownRef = useRef(null);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const hasChannel = user?.channel;

    const [showDropdown, setShowDropdown] =
        useState(false);

    // ================= LOGOUT =================

    const handleLogout = () => {
        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");
    };

    const handleSearch = () => {
        if (!search.trim()) {
            navigate("/");   // 👈 CLEAR SEARCH
            return;
        }

        navigate(`/?q=${search.trim()}`);
    };

    useEffect(() => {
        if (!search.trim()) {
            navigate("/");
        }
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full h-16 bg-black border-b border-zinc-800 flex items-center justify-between px-4 z-50">
            {/* LEFT */}
            <div className="flex items-center gap-4 min-w-fit relative">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-full hover:bg-zinc-800 transition"
                >
                    <Menu className="text-white w-6 h-6" />
                </button>

                <Link
                    to="/"
                    className="flex items-center gap-1"
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
                        alt="youtube"
                        className="w-28 hidden sm:block"
                    />

                    <span className="text-white font-bold text-xl sm:hidden">
                        YT
                    </span>
                </Link>
            </div>

            {/* CENTER */}
            <div className="flex items-center justify-center flex-1 px-4 max-w-3xl">
                <div className="flex items-center justify-center flex-1 px-2 sm:px-4 max-w-3xl">
  <div className="flex items-center w-full max-w-2xl">
    
    <div className="flex items-center w-full bg-zinc-900 border border-zinc-700 rounded-l-full overflow-hidden h-9 sm:h-10">
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        className="w-full h-full bg-transparent px-3 sm:px-4 text-white outline-none placeholder:text-zinc-400 text-sm sm:text-base"
      />
    </div>

    <button
      onClick={handleSearch}
      className="h-9 sm:h-10 px-3 sm:px-6 bg-zinc-800 border border-zinc-700 border-l-0 rounded-r-full hover:bg-zinc-700 transition"
    >
      <Search className="text-white w-4 h-5 sm:w-5 sm:h-5" />
    </button>

  </div>
</div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3 min-w-fit relative">
                {/* IF LOGGED IN */}
                {token ? (
                    <>
                        {/* <button className="hidden sm:flex p-2 rounded-full hover:bg-zinc-800 transition">
                            <Video className="text-white w-6 h-6" />
                        </button>

                        <button className="hidden sm:flex p-2 rounded-full hover:bg-zinc-800 transition relative">
                            <Bell className="text-white w-6 h-6" />

                            <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                2
                            </span>
                        </button> */}

                        {token && !hasChannel && (
                            <Link
                                to="/create-channel"
                                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition"
                            >
                                Create Channel
                            </Link>
                        )}

                        {token && (
                            <span className="hidden md:block text-sm text-white font-medium">
                                {user?.username}
                            </span>
                        )}

                        {/* PROFILE */}
                        <button
                            ref={profileRef}
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-zinc-700 cursor-pointer"
                        >
                            <img
                                src={
                                    user?.avatar ||
                                    "https://i.pinimg.com/736x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg"
                                }
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                        </button>

                        {/* DROPDOWN */}
                        {showDropdown && (
                            <div ref={dropdownRef} className="absolute top-14 right-0 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
                                <div className="p-4 border-b border-zinc-800">
                                    <h2 className="text-white font-semibold">
                                        {user?.username}
                                    </h2>

                                    <p className="text-zinc-400 text-sm">
                                        {user?.email}
                                    </p>
                                </div>

                                {token && hasChannel && (
                                    <Link
                                        to="/my-channel"
                                        className="block px-4 py-3 text-zinc-300 hover:bg-zinc-800 transition"
                                    >
                                        My Channel
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-zinc-800 transition"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    // LOGIN BUTTON
                    <Link
                        to="/login"
                        className="flex items-center gap-2 border border-zinc-700 hover:bg-zinc-800 transition text-white px-5 py-2 rounded-full"
                    >
                        <User className="w-5 h-5" />
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
}

export default Header;