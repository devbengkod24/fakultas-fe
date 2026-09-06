import React from "react";

interface TitleSectionProps {
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  className?: string;
}

export default function TitleSection({
  titlePrefix,
  titleHighlight,
  subtitle,
  className = "",
}: TitleSectionProps) {
  return (
    <div className={`text-center mb-8 sm:mb-16 ${className}`}>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-900">
        <span className="font-semibold">{titlePrefix}</span>{" "}
        <span className="font-semibold bg-gradient-to-r from-prodi-start to-prodi-end bg-clip-text text-transparent">
          {titleHighlight}
        </span>
      </h2>
      <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto mt-3 sm:mt-4">
        {subtitle}
      </p>
    </div>
  );
}
