// server.js
const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const app = express();

const stripe = Stripe(
  "sk_test_51R8dizE7OlZnWYDz9jpL7pvOupbuBk2FOhJTau8WTg4lv6pUPKOcxe12RpFYbpozyf7JY0GEgGQLgpoRFQjU6n4F008OzJiYPT"
); // 🔴 Replace with your Stripe Secret Key

app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { amount, currency, email, fullName } = req.body;
  console.log(currency);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "Donation",
            },
            unit_amount: amount * 100, // convert dollars to cents
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        fullName, // Pass the full name to Stripe as metadata
      },
      success_url: "http://localhost:5173/thankyou",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/geting", async (req, res) => {
  res.json("we are on right path");
});

app.listen(4242, () => console.log("Server running on port 4242"));
