"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const ALLOWED_HOSTS = new Set([
  "images.pexels.com",
  "example.com",
  "res.cloudinary.com",
  "homepage-related.s3.us-west-1.amazonaws.com",
  "image-store-api.onrender.com",
  "gallery.cyanli.com",
  "gallery-api-o5vw.onrender.com",
  "7cepehhnii.execute-api.us-west-1.amazonaws.com",
]);

const FALLBACK_IMAGE = "/ico.png";

function safeSource(source) {
  if (typeof source !== "string" || !source.trim()) return FALLBACK_IMAGE;
  const value = source.trim();
  if (value.startsWith("/")) return value;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && ALLOWED_HOSTS.has(url.hostname)
      ? value
      : FALLBACK_IMAGE;
  } catch {
    return FALLBACK_IMAGE;
  }
}

export default function PostImage({ src, alt = "", ...props }) {
  const [imageSource, setImageSource] = useState(() => safeSource(src));

  useEffect(() => {
    setImageSource(safeSource(src));
  }, [src]);

  return (
    <Image
      {...props}
      src={imageSource}
      alt={alt}
      onError={() => setImageSource(FALLBACK_IMAGE)}
    />
  );
}
