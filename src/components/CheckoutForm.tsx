"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { addOrder } from "@/lib/firebase-services";
import { Trash2, Minus, Plus } from "lucide-react";

export default function CheckoutForm() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await addOrder({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        items: state.items,
        totalAmount: state.total,
        status: "pending",
      });

      setSuccess(true);
      clearCart();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to place order";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We&apos;ll contact you soon with order
            confirmation and delivery details.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some products to your cart before checkout.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Order Summary
          </h2>

          <div className="space-y-4">
            {state.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ₹{item.product.price.toFixed(2)} × {item.quantity}
                  </p>
                  {(item.selectedSize || item.selectedColor) && (
                    <p className="text-xs text-gray-400">
                      {item.selectedSize && `Size: ${item.selectedSize}`}
                      {item.selectedSize && item.selectedColor && " • "}
                      {item.selectedColor && `Color: ${item.selectedColor}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-900 w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex justify-between text-lg font-semibold text-gray-900">
              <span>Total:</span>
              <span>₹{state.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Contact Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="customerName"
                required
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="customerEmail"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="customerEmail"
                required
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label
                htmlFor="customerPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="customerPhone"
                required
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label
                htmlFor="customerAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Delivery Address *
              </label>
              <textarea
                id="customerAddress"
                rows={4}
                required
                value={formData.customerAddress}
                onChange={(e) =>
                  setFormData({ ...formData, customerAddress: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your complete delivery address"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Placing Order..."
                : `Place Order - ₹${state.total.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
