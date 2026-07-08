import { useRef } from "react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PaystackCheckout = ({ order, email }) => {
  // Memoize reference so it doesn't regenerate on every re-render
  const referenceRef = useRef(new Date().getTime().toString());
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  const config = {
    reference: referenceRef.current,
    email,
    amount: order?.totalAmount * 100,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    metadata: {
      orderId: order?._id,
    },
  };

  const handleSuccess = async (paystackRef) => {
    console.log("Payment successful:", paystackRef);

    try {
      const res = await fetch("http://localhost:5000/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reference: paystackRef.reference,
          orderId: order._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Payment verified on backend:", data);
        // Navigate to the OrderSuccess page and pass the order data in state
        navigate("/success", { state: { order } });
      } else {
        console.error("Payment verification failed:", data);
        alert("Payment verification failed. Please contact support.");
      }
    } catch (err) {
      console.error("Verification network error:", err);
      alert("Could not verify payment. Please contact support.");
    }
  };

  const handleClose = () => {
    console.log("Payment closed");
  };

  return (
    <PaystackButton
      {...config}
      text="Pay with Paystack"
      onSuccess={handleSuccess}
      onClose={handleClose}
      className="w-full h-12 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm tracking-wider uppercase"
    />
  );
};

export default PaystackCheckout;