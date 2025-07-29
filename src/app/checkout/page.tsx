import CheckoutForm from "@/components/CheckoutForm";
import Navbar from "@/components/Navbar";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
