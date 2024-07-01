import axios from "axios";

function Payment() {
	const initPayment = (data) => {
		const options = {
			key: "rzp_test_Gj1HHlsQFVyVat",
			amount: data.amount,
			currency: data.currency,
			description: "Test Transaction",
			order_id: data.id,
			handler: async (response) => {
				try {
					const verifyUrl = "https://gog-backend-t01u.onrender.com/api/payment/verify";
					const { data } = await axios.post(verifyUrl, response);
					console.log(data);
				} catch (error) {
					console.log(error);
				}
			},
			theme: {
				color: "#3399cc",
			},
		};
		const rzp1 = new window.Razorpay(options);
		rzp1.open();
	};

	const handlePayment = async () => {
		try {
			const orderUrl = "https://gog-backend-t01u.onrender.com/api/payment/orders";
			const { data } = await axios.post(orderUrl, { amount: 250 });
			console.log(data);
			initPayment(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="App">
				<button onClick={handlePayment} className="buy_btn">
					buy now
				</button>

		</div>
	);
}

export default Payment;
