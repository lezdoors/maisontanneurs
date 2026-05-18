import { CartProvider } from "@/components/store/CartProvider";
import Navbar from "@/components/store/Navbar";
import CartDrawer from "@/components/store/CartDrawer";
import Footer from "@/components/store/Footer";
import ScrollRevealProvider from "@/components/store/ScrollRevealProvider";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <ScrollRevealProvider />
      <Navbar />
      <CartDrawer />
      {children}
      <Footer />
    </CartProvider>
  );
}
