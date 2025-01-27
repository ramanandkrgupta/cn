const ProFeaturesSection = ({ items, router }) => (
  <div className="mb-4">
    <h3 className="text-sm md:text-base font-medium text-primary flex items-center gap-2 px-2 mb-2">
      <Crown size={14} className="md:w-5 md:h-5" />
      PRO FEATURES
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => router.push(item.path)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 rounded-xl shadow-sm transition-all duration-200 group border border-primary/10"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
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
      ))}
    </div>
  </div>
)
