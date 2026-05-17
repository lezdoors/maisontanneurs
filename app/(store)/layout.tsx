import { CartProvider } from "@/components/store/CartProvider";
import Navbar from "@/components/store/Navbar";
import CartDrawer from "@/components/store/CartDrawer";
import Footer from "@/components/store/Footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />
      {children}
      <Footer />
    </CartProvider>
  );
}
