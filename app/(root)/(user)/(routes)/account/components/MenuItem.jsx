const MenuItem = ({ item, router }) => (
  <button
    onClick={() => router.push(item.path)}
    className="w-full flex items-center justify-between p-4 bg-base-300 hover:bg-base-200 rounded-xl shadow-sm transition-all duration-200 group border border-transparent hover:border-primary/10"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-base-200 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
        {item.icon}
      </div>
      <div>
        <span className="text-secondary font-medium block md:text-lg">
          {item.title}
        </span>
        <span className="text-xs md:text-sm text-gray-500">
          {item.description}
        </span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {item.badge}
      <ChevronRight
        size={18}
        className="text-gray-500 group-hover:transform group-hover:translate-x-1 transition-transform"
      />
    </div>
  </button>
)
