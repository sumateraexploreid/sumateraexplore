/**
 * WhatsApp helper utilities for consistent wa.me link generation
 */

/**
 * Normalize phone number to international format (62xxx without +)
 * Handles: 08xx, +628xx, 628xx, 62 8xx, etc.
 */
export function normalizeWaPhone(raw: string): string {
  if (!raw) return "";
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  // Convert local Indonesian format (08xx) to international (628xx)
  if (digits.startsWith("0")) {
    digits = `62${digits.slice(1)}`;
  }
  // If already starts with 62, keep as is
  // If starts with country code like 60 (Malaysia), keep as is
  return digits;
}

/**
 * Generate a wa.me URL with prefilled message
 * @param phone - Phone number in any format (will be normalized)
 * @param message - Message text (will be URL encoded)
 * @returns Complete wa.me URL
 */
export function formatWaLink(phone: string, message: string): string {
  const normalizedPhone = normalizeWaPhone(phone);
  const encodedMessage = encodeURIComponent(message);

  if (normalizedPhone) {
    return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
  }
  // Fallback to business WhatsApp if no phone provided
  return `https://wa.me/?text=${encodedMessage}`;
}

/**
 * Generate booking confirmation WhatsApp message
 */
export function buildBookingMessage(params: {
  guestName: string;
  bookingCode: string;
  packageName: string;
  estimatedTotal: number;
  currency: string;
  dpAmount: number;
  vehicleType?: string;
}): string {
  const { guestName, bookingCode, packageName, estimatedTotal, currency, dpAmount, vehicleType } = params;
  const balance = Math.max(0, estimatedTotal - dpAmount);

  return [
    `Halo ${guestName}, kami dari Sumatera Explore (${bookingCode}) untuk ${packageName}.`,
    `Estimasi total: ${currency} ${estimatedTotal.toLocaleString("en-US")}`,
    `DP tercatat: ${currency} ${dpAmount.toLocaleString("en-US")}`,
    `Baki pelunasan di Bandara KNO: ${currency} ${balance.toLocaleString("en-US")}`,
    vehicleType ? `Armada: ${vehicleType}` : "",
  ].filter(Boolean).join("\n");
}

/**
 * Build package inquiry WhatsApp message (from package detail page)
 */
export function buildPackageInquiryMessage(params: {
  packageName: string;
  adults: number;
  children: number;
  vehicle: string;
  estimatedTotal: string;
  currency: string;
}): string {
  const { packageName, adults, children, vehicle, estimatedTotal, currency } = params;

  return `Halo Sumatera Explore, saya ingin memesan paket ${packageName} (Harga Weekday) untuk ${adults} Dewasa dan ${children} Anak (${vehicle}, estimasi ${estimatedTotal}). Mohon info konfirmasi DP & jadwal.`;
}

/**
 * Build receipt WhatsApp message
 */
export function buildReceiptMessage(params: {
  receiptNumber: string;
  guestName: string;
  packageName: string;
  totalAmount: number;
  dpAmount: number;
  currency: string;
  paymentMethod: string;
  remainingAmount: number;
}): string {
  const { receiptNumber, guestName, packageName, totalAmount, dpAmount, currency, paymentMethod, remainingAmount } = params;

  return [
    `*KWITANSI RESMI - ${receiptNumber}*`,
    `Tamu: ${guestName}`,
    `Paket: ${packageName}`,
    `Total: ${currency} ${totalAmount.toLocaleString("en-US")}`,
    `DP (${paymentMethod}): ${currency} ${dpAmount.toLocaleString("en-US")}`,
    `Sisa: ${currency} ${remainingAmount.toLocaleString("en-US")}`,
    "",
    "Terima kasih telah mempercayai Sumatera Explore!",
  ].join("\n");
}