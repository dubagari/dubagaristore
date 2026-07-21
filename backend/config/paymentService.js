export const initializePayment = async (paymentData) => {
  const response = await fetch(
    "import.meta/api/payments/initialize",
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
    `import.meta.env.VITE_API_URL/api/payments/verify/${reference}`
  );

  return response.json();
};