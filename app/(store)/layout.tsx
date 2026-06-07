import { CartProvider } from "@/components/store/CartProvider";
import Navbar from "@/components/store/Navbar";
import CartDrawer from "@/components/store/CartDrawer";
import Footer from "@/components/store/Footer";
import NavTransitionIndicator from "@/components/store/NavTransitionIndicator";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <NavTransitionIndicator />
      <Navbar />
      <CartDrawer />
      {children}
      <Footer />
    </CartProvider>
  );
}
