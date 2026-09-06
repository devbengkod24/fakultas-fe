interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  accentColor?: "blue" | "orange" | "green" | "yellow";
  className?: string;
}

const SectionHeader = ({
  title,
  subtitle,
  accentColor = "orange",
  className = "",
}: SectionHeaderProps) => {
  const colorMap = {
    blue: {
      title: "text-slate-800",
      subtitle: "text-slate-600",
      accent: "bg-primary-500",
      line: "bg-gradient-to-r from-transparent via-slate-300 to-transparent",
      glow: "shadow-primary-500/50",
    },
    orange: {
      title: "text-slate-800",
      subtitle: "text-slate-600",
      accent: "bg-orange-500",
      line: "bg-gradient-to-r from-transparent via-slate-300 to-transparent",
      glow: "shadow-orange-500/50",
    },
    green: {
      title: "text-slate-800",
      subtitle: "text-slate-600",
      accent: "bg-green-500",
      line: "bg-gradient-to-r from-transparent via-slate-300 to-transparent",
      glow: "shadow-green-500/50",
    },
    yellow: {
      title: "text-slate-800",
      subtitle: "text-slate-600",
      accent: "bg-yellow-500",
      line: "bg-gradient-to-r from-transparent via-slate-300 to-transparent",
      glow: "shadow-yellow-500/50",
    },
  };
  const colors = colorMap[accentColor];

  return (
    <div className={`text-center space-y-3 ${className}`}>
      {/* Title with hover effect */}
      <h2
        className={`text-2xl md:text-3xl font-semibold ${colors.title} tracking-tight leading-tight`}
      >
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={`text-base md:text-lg ${colors.subtitle} font-normal max-w-2xl mx-auto leading-relaxed `}
        >
          {subtitle}
        </p>
      )}

      {/* Divider with dot */}
      <div className="flex items-center justify-center pt-4">
        <div className={`h-px w-16 ${colors.line}`} />
        
        <div
          className={`w-1.5 h-1.5 ${colors.accent} rounded-full mx-4 ${colors.glow} hover:scale-150 transition-transform duration-300`}
        />
        
        <div className={`h-px w-16 ${colors.line}`} />
      </div>
    </div>
  );
};

export default SectionHeader;
