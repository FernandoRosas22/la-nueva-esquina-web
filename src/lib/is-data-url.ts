/** true si la imagen es una data URL base64 (subida desde el panel admin sin Storage). */
export function isDataUrl(src: string): boolean {
  return src.startsWith("data:");
}
