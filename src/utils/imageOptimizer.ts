export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  crop?: "limit" | "fill" | "scale" | "fit" | "thumb" | "pad";
  quality?: "auto" | "auto:best" | "auto:good" | "auto:eco" | "auto:low" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  gravity?: "auto" | "face" | "center";
}

/**
 * Checks whether the given string is a Cloudinary image URL.
 */
export function isCloudinaryUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  return /^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(url);
}

/**
 * Injects transformation parameters (f_auto, q_auto, width, height, crop) into a Cloudinary URL.
 * Handles URLs with or without existing versioning (e.g. /upload/v1234/...) or existing transformations.
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  options: ImageOptimizationOptions = {}
): string {
  if (!url || typeof url !== "string") return "";
  if (!isCloudinaryUrl(url)) return url;

  const {
    width,
    height,
    crop = width || height ? "limit" : undefined,
    quality = "auto",
    format = "auto",
    gravity,
  } = options;

  const transforms: string[] = [];

  if (format) transforms.push(`f_${format}`);
  if (quality) transforms.push(`q_${quality}`);
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  if (gravity) transforms.push(`g_${gravity}`);

  const transformString = transforms.join(",");
  if (!transformString) return url;

  // Cloudinary URL format:
  // https://res.cloudinary.com/<cloud_name>/image/upload/[optional_transforms/][v<version>/]<public_id>.<ext>
  const uploadRegex = /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?:([a-zA-Z0-9_,:]+)\/)?(v\d+\/.*|[^/]+.*)$/;
  const match = url.match(uploadRegex);

  if (match) {
    const [, base, existingTransforms, rest] = match;
    // If existing transforms exist and don't contain conflicting flags, or if replacing
    if (existingTransforms && !existingTransforms.startsWith("v")) {
      // Cleanly prepend or merge transform string
      return `${base}${transformString}/${rest}`;
    }
    return `${base}${transformString}/${existingTransforms ? existingTransforms + "/" : ""}${rest}`;
  }

  // Fallback string replacement if regex didn't match cleanly
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex !== -1) {
    const prefix = url.substring(0, uploadIndex + 8);
    const suffix = url.substring(uploadIndex + 8);
    return `${prefix}${transformString}/${suffix}`;
  }

  return url;
}

/**
 * Generates a responsive srcset string for a Cloudinary image URL across specified widths.
 */
export function getCloudinarySrcSet(
  url: string | null | undefined,
  widths: number[] = [360, 480, 640, 768, 1024, 1280]
): string | undefined {
  if (!url || !isCloudinaryUrl(url)) return undefined;

  return widths
    .map(w => {
      const optimizedUrl = getOptimizedImageUrl(url, {
        width: w,
        crop: "limit",
        quality: "auto",
        format: "auto",
      });
      return `${optimizedUrl} ${w}w`;
    })
    .join(", ");
}

/**
 * Helper to resolve the string URL from a string or Astro ImageMetadata object.
 */
export function resolveImageUrl(image: any): string | undefined {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  if (typeof image === "object" && "src" in image && typeof image.src === "string") {
    return image.src;
  }
  return undefined;
}
