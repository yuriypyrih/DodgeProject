import { Box } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import styles from './styles.module.scss';
import { paymentRequest } from '../../lib/api/http/requests/payment.ts';
import { Elements } from '@stripe/react-stripe-js';
import PaymentModal from 'components/PaymentComponent/PaymentForm.tsx';
import EngineeringIcon from '@mui/icons-material/Engineering';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'redux/store.ts';
import { getMe } from 'redux/slices/authSlice.ts';

import { loadStripe } from '@stripe/stripe-js/pure';
loadStripe.setLoadParameters({ advancedFraudSignals: false });

const PaymentComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { paidTransactions } = useSelector((state: RootState) => state.authSlice.user);

  const [stripePromise, setStripePromise] = React.useState<any>(null);
  const [clientSecret, setClientSecret] = React.useState<string>('');
  const [wantsToPay, setWantsToPay] = React.useState<boolean>(false);

  const isBought = useMemo(() => paidTransactions.includes('paymentIntent500'), [paidTransactions]);

  useEffect(() => {
    paymentRequest().then(async (res) => {
      const secret = res?.data?.document?.clientSecret;
      if (!secret) {
        return;
      }
      setClientSecret(secret);
      const stripePromise = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      setStripePromise(stripePromise);
    });
  }, []);

  const handleWantsToPay = () => {
    if (!isBought) setWantsToPay(true);
  };

  const handleOnClose = () => {
    dispatch(getMe());
    setWantsToPay(false);
  };

  return (
    <Box className={styles.root}>
      <Box sx={{ display: 'flex', gap: 1, pb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            backgroundColor: 'black',
            borderRadius: 4,
            background: 'linear-gradient(180deg,transparent 0%, #1a1a1d 100%)',
          }}
        >
          <Box className={clsx(styles.promo, isBought && styles.promoDisabled)} onClick={handleWantsToPay}>
            <img alt={'get 500 stars promo'} src={'500.png'} />
          </Box>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            {isBought ? 'Already purchased' : 'One time offer so do not miss it!'}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
            flexDirection: 'column',
            backgroundColor: 'black',
            borderRadius: 4,
            width: 340,
            background: 'linear-gradient(180deg,transparent 0%, #1a1a1d 100%)',
            p: 2,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 120,
              backgroundColor: '#1a1a1d',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EngineeringIcon style={{ width: 48, height: 48, opacity: 0.5 }} />
          </Box>
          <Box sx={{ textAlign: 'center' }}>Future offers are coming</Box>
        </Box>
      </Box>

      {stripePromise && clientSecret && wantsToPay && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentModal open={wantsToPay} onClose={handleOnClose} />
        </Elements>
      )}
    </Box>
  );
};

export default PaymentComponent;
