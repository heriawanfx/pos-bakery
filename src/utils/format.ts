export function formatRupiah(value: number): string {
  if (isNaN(value)) return "";
  return "Rp " + value.toLocaleString("id-ID");
}

export function parseRupiah(str: string): number {
  // Hilangkan "Rp", spasi, titik
  const cleaned = str.replace(/[Rp\s.]/g, "");
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
}
