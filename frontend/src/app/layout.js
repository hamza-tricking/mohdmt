import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata = {
  title: "DMT Art Designer | قطع ديكورية من الرزين",
  description:
    "قطع ديكورية مصنوعة يدوياً من الرزين، بتصاميم فنية وألوان مختلفة. التوصيل لجميع ولايات الجزائر والدفع عند الاستلام.",
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#fde7ee" };

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
