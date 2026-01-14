import React from 'react';
import axios from 'axios';

const CheckoutButton = ({ planType, price, onSuccess, userEmail }) => {
    const [loading, setLoading] = React.useState(false);

    const handlePayment = async () => {
        if (loading) return;
        setLoading(true);
        console.log("💳 CheckoutButton clicked. Plan:", planType);

        if (!window.Razorpay) {
            console.error("❌ Razorpay SDK not loaded! window.Razorpay is undefined.");
            alert("Payment system not loaded. Please refresh the page.");
            return;
        }

        try {
            console.log("🚀 Initiating order creation...");
            // 1. Create Order
            const { data: order } = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, { planType }, {
                withCredentials: true
            });

            // 2. Initialize Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Antigravity Resume Roaster",
                description: planType === 'day_pass' ? "24h God Mode Access" : "Lifetime God Mode Access",
                image: "https://cdn-icons-png.flaticon.com/512/1048/1048927.png", // Generic flame icon or similar
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/verify-payment`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planType
                        }, {
                            withCredentials: true
                        });

                        if (verifyRes.data.success) {
                            alert("Payment Successful! God Mode Unlocked. 🔓");
                            if (onSuccess) onSuccess();
                        }
                    } catch (err) {
                        console.error("Verification Failed", err);
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    email: userEmail || ''
                },
                theme: {
                    color: "#ef4444" // Tailwind red-500
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
                console.error(response.error);
            });
            rzp1.open();

        } catch (error) {
            console.error("Payment Initiation Failed", error);
            if (error.response && error.response.status === 401) {
                alert("You must be logged in to purchase God Mode.");
            } else {
                alert("Could not initiate payment. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full relative px-6 py-3 font-mono text-sm font-bold border-2 transition-all duration-200 group overflow-hidden
                ${loading ? 'bg-gray-600 border-gray-600 cursor-wait' : 'bg-red-600 text-black border-red-500 hover:bg-red-500'}
            `}
        >
            {!loading && <div className="absolute inset-0 bg-black/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
            <span className="relative flex items-center justify-center gap-2 uppercase tracking-wider">
                {loading ? 'Processing...' : `${planType === 'day_pass' ? 'Buy Day Pass (v2)' : 'Get Lifetime Access (v2)'} - $${price}`}
            </span>
        </button>
    );
};

export default CheckoutButton;
