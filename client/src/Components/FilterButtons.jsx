function FilterButtons({
  selectedCategory,
  setSelectedCategory,
  sidebarOpen,
  isMobile,
}) {
  const filters = [
  "All",
  "Education",
  "Programming",
  "Database",
  "Career",
];

  return (
    <div
  className={`
    fixed top-16 right-0 z-30
    bg-black border-b border-zinc-800
    transition-all duration-300
  `}
  style={{
    left: isMobile
      ? "20px"
      : sidebarOpen
        ? "240px"
        : "80px",
  }}
>
      <div className="flex gap-3 overflow-x-auto px-5 py-3 scrollbar-hide">
        {filters.map((filter, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(filter)}
            className={`
              px-4 py-2 rounded-lg
              whitespace-nowrap
              text-sm font-medium
              transition-all duration-200 cursor-pointer
              ${
                selectedCategory === filter
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-white hover:bg-zinc-700"
              }
            `}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterButtons;