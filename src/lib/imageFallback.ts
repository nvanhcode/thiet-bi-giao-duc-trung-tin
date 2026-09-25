import React from "react";

export const DEFAULT_IMAGE = "/placeholder.svg";

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = DEFAULT_IMAGE
) => {
  const target = e.currentTarget;
  target.onerror = null;
  target.src = fallbackSrc;
};
