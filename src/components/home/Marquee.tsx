export function Marquee() {
  const items = [
    "🇺🇿 Navruz",
    "🍚 Plov",
    "🎭 Culture",
    "🤝 Community",
    "🎉 Events",
    "💙 Birmingham",
    "🌟 Tradition",
    "🎵 Music",
  ];

  return (
    <div className="bg-primary border-y-[3px] border-foreground py-4 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, index) => (
          <span
            key={index}
            className="mx-8 font-display text-xl md:text-2xl font-bold text-primary-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
