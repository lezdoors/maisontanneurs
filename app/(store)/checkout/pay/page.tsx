import CheckoutShell from "@/components/checkout/CheckoutShell";

export const metadata = {
  title: "Checkout — Kechken",
  description:
    "Complete your Kechken order. Made to order and shipped within three to five business days.",
};

export default function CheckoutPayPage() {
  return (
    <main className="min-h-screen px-6 md:px-10 py-14 md:py-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="eye mb-3">Checkout</p>
          <h1 className="disp text-[clamp(36px,5vw,56px)] leading-[1.02]">
            Complete your order.
          </h1>
          <p className="font-serif italic text-graphite text-[clamp(15px,1.3vw,18px)] leading-relaxed mt-4 max-w-[640px]">
            Made to order and shipped within three to five business days.
            Tracking included. Returns within thirty days.
          </p>
        </div>

        <CheckoutShell />
      </div>
    </main>
  );
}
