import sharp from "sharp";

export const defaultSharpOptions = {
  fit: "cover" as const,
  position: "center" as const,
};

export const supportedFormats = ["jpeg", "png", "webp", "avif"] as const;

export type SupportedFormat = (typeof supportedFormats)[number];

export { sharp };
