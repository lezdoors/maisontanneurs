import { CartProvider } from "@/components/store/CartProvider";
import Navbar from "@/components/store/Navbar";
import CartDrawer from "@/components/store/CartDrawer";
import Footer from "@/components/store/Footer";
import LoadingScreen from "@/components/store/LoadingScreen";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <LoadingScreen />
      <Navbar />
      <CartDrawer />
      {children}
      <Footer />
    </CartProvider>
  );
}
