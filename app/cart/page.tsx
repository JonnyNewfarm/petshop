import type { Metadata } from "next";
import CartPage from "@/components/CartClient";
import ScrollSection from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Your Shopping Cart",
  description:
    "Review the items in your cart and proceed to secure checkout at Petsaco. Fast shipping and easy returns.",
  robots: {
    index: false,
    follow: false,
  },
};

const Cart = () => {
  return (
    <ScrollSection>
      <CartPage />
    </ScrollSection>
  );
};

export default Cart;
