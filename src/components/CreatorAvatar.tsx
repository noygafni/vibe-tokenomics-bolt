import React from "react";
// import { generateColor } from '../lib/utils';

interface CreatorAvatarProps {
  creator: {
    id: string;
    first_name: string;
    avatar_url: string | null;
  };
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "w-6 h-6 text-xs", // Reduced from w-8 h-8
  md: "w-10 h-10 text-base", // Reduced from w-12 h-12
  lg: "w-14 h-14 text-xl", // Reduced from w-16 h-16
  xl: "w-16 h-16 text-2xl", // Reduced from w-20 h-20
};

export function CreatorAvatar({ creator, size = "md" }: CreatorAvatarProps) {
  const borderColor = "black"; // generateColor(creator.id);

  return (
    <div
      className={`relative rounded-full ${sizes[size]} p-[3px]`} // Reduced padding from 4px to 3px
      style={{ backgroundColor: borderColor }}
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-[#FF5D3A] flex items-center justify-center text-white">
        {creator.avatar_url ? (
          <img
            src={creator.avatar_url}
            alt={creator.first_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className={
              size === "sm"
                ? "text-xs"
                : size === "md"
                ? "text-base"
                : size === "lg"
                ? "text-xl"
                : "text-2xl"
            }
          >
            {creator.first_name[0].toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}
