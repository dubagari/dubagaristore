export const initializePayment = async (paymentData) => {
  const response = await fetch(
    "http://localhost:5000/api/payments/initialize",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    }
  );

  return response.json();
};

export const verifyPayment = async (reference) => {
  const response = await fetch(
    `http://localhost:5000/api/payments/verify/${reference}`
  );

  return response.json();
};