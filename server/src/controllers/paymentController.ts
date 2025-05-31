import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

class PaymentController {
  private stripe: Stripe;

  constructor() {
    console.log(process.env.STRIPE_SECRET_KEY);
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-05-28.basil",
    });
  }

  async createIntent(req: Request, res: Response): Promise<void> {
    try {
      const { amount, currency = "usd", productId, productName } = req.body;

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount,
        currency,
        metadata: {
          productId,
          productName,
          userId: req.cookies.userId,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error.message);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    const sig = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
}

export default PaymentController;
