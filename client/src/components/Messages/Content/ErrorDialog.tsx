import React, { useState, useEffect } from 'react';
import { Dialog, Label } from '~/components/ui/';
import DialogTemplate from '~/components/ui/DialogTemplate';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAuthContext } from '../../../hooks/AuthContext.tsx';

const stripePromise = loadStripe(
  'pk_live_51MwvEEHKD0byXXCl8IzAvUl0oZ7RE6vIz72lWUVYl5rW3zy0u3FiGtIAgsbmqSHbhkTJeZjs5VEbQMNStaaQL9xQ001pwxI3RP',
);

export default function ErrorDialog({ message }) {
  const { user } = useAuthContext();
  const userId = user?.id;
  const [processingTokenAmount, setProcessingTokenAmount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const title = 'Purchase Tokens';

  const fetchTokenBalance = async () => {
    try {
      const response = await fetch('/api/balance');
      const balance = await response.text();
      setTokenBalance(balance);
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  };

  const handlePurchase = async (tokens) => {
    setProcessingTokenAmount(tokens);
    let amount;
    switch (tokens) {
      case 100000:
        amount = 10;
        break;
      case 500000:
        amount = 35;
        break;
      case 1000000:
        amount = 50;
        break;
      case 10000000:
        amount = 250;
        break;
      default:
        console.error('Invalid token amount');
        return;
    }

    try {
      const res = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, userId: userId }),
      });
      const data = await res.json();
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      if (error) {
        console.error(error);
      } else {
        await fetchTokenBalance();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setProcessingTokenAmount(null);
    }
  };

  useEffect(() => {
    fetchTokenBalance(); // Fetch token balance on component mount
  }, []);

  return (
    <Dialog defaultOpen={true}>
      <DialogTemplate
        title={title}
        className="max-w-[450px]"
        main={
          <>
            <div className="flex w-full flex-col items-center gap-2">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="chatGptLabel" className="text-left text-sm font-medium">
                  {message}
                </Label>
                <Elements stripe={stripePromise}>
                  <button
                    onClick={() => handlePurchase(100000)}
                    disabled={processingTokenAmount !== null}
                    className="rounded bg-green-600 p-2 text-white hover:bg-green-700 dark:hover:bg-green-800"
                  >
                    {processingTokenAmount === 100000
                      ? 'Processing...'
                      : 'Purchase 100k Tokens for 10 RMB'}
                  </button>

                  <button
                    onClick={() => handlePurchase(500000)}
                    disabled={processingTokenAmount !== null}
                    className="rounded bg-green-600 p-2 text-white hover:bg-green-700 dark:hover:bg-green-800"
                  >
                    {processingTokenAmount === 500000
                      ? 'Processing...'
                      : 'Purchase 500k Tokens for 35 RMB'}
                  </button>

                  <button
                    onClick={() => handlePurchase(1000000)}
                    disabled={processingTokenAmount !== null}
                    className="rounded bg-green-600 p-2 text-white hover:bg-green-700 dark:hover:bg-green-800"
                  >
                    {processingTokenAmount === 1000000
                      ? 'Processing...'
                      : 'Purchase 1 Million Tokens for 50 RMB'}
                  </button>

                  <button
                    onClick={() => handlePurchase(10000000)}
                    disabled={processingTokenAmount !== null}
                    className="rounded bg-green-600 p-2 text-white hover:bg-green-700 dark:hover:bg-green-800"
                  >
                    {processingTokenAmount === 10000000
                      ? 'Processing...'
                      : 'Purchase 10 Million Tokens for 250 RMB'}
                  </button>
                </Elements>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-100">
              Please Note! WeChat and Alipay valid only with a Chinese National ID-linked account
            </div>
          </>
        }
      />
    </Dialog>
  );
}
