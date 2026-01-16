const express = require("express");
const Stripe = require("stripe");

const app = express();
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET);

app.post("/create-payment-intent", async (req, res) => {
  try {
    let { amount } = req.body;

    // Ensure amount is integer
    amount = parseInt(amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in paisa
      currency: "pkr",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log("Stripe Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
