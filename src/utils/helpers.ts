import path from "path";

export function getSafeFilename(filename: string): string {
  return path.basename(filename);
}

export function buildProcessedFilename(
  filename: string,
  suffix: string,
  extension: string,
): string {
  const name = path.parse(filename).name;

  return `${name}-${suffix}-${Date.now()}.${extension}`;
}

export function isValidDimension(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value > 0 &&
    value <= 5000
  );
}

export function isValidQuality(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 100
  );
}
