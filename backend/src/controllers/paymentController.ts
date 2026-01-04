import catchAsync from '../utils/catchAsync';
import Stripe from 'stripe';
import { env } from '../utils/env';
import { AppError } from '../utils/appError';
import { User } from '../models/userModel';

const stripe = new Stripe(env.STRIPE_SECRET_KEY!);

export const createPaymentIntent = catchAsync(async (req, res, next) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: {
        userId: req.user.id,
        paymentIntent: 'paymentIntent500',
        stars: 500
      }
      // automatic_payment_methods: { enabled: true }
    });

    res.status(200).json({
      status: 'success',
      document: {
        clientSecret: paymentIntent.client_secret
      }
    });
  } catch (e) {
    return next(
      // @ts-ignore
      new AppError(`Payment failed: ${(e as unknown)?.message}`, 500)
    );
  }
});

export const webhookParser = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('webhookParser', event.type);

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent;

    const userId = intent.metadata.userId;
    const stars = Number(intent.metadata.stars);
    const paymentIntent = intent.metadata.paymentIntent;

    // 1) Find the user
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return res.status(200).json({ received: true });
    }

    if (foundUser.paidTransactions.includes(paymentIntent)) {
      return res.status(200).json({ received: true });
    }

    // 2) Grant stars
    foundUser.stars += stars;
    foundUser.paidTransactions = [...foundUser.paidTransactions, paymentIntent];

    // 3) Update user document
    await User.findByIdAndUpdate(userId, foundUser, {
      new: true,
      runValidators: true
    });
  }

  return res.status(200).json({ received: true });
});
