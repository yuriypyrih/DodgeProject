import React from 'react';
import { Box, Modal, Typography, Button, CircularProgress } from '@mui/material';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

type Props = {
  open: boolean;
  onClose: () => void;
};

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  maxHeight: 'calc(90vh - 20px)',
  overflow: 'auto',
  bgcolor: '#0b1f1e',
  borderRadius: 3,
  boxShadow: 24,
  p: 3,
  color: '#fff',
};

const PaymentModal: React.FC<Props> = ({ open, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    setLoading(false);

    if (error) {
      setError(error.message || 'Payment failed');
      return;
    }

    setSuccess(true);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {!success ? (
          <>
            <Typography variant="h6" fontWeight={700} mb={1}>
              Get 500 Stars
            </Typography>

            <Typography variant="body2" color="#ffffffAA" mb={2}>
              Thank you for your interest in purchasing stars, but this is just a demo and no charges will take place.
              <br />
              <br />
              To reward you for your attempt though, you can enter the dummy card below and receive the reward anyway.
            </Typography>

            <Box
              sx={{
                bgcolor: '#0f2f2c',
                p: 1.5,
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Typography variant="caption" color="#ffffffAA">
                Use demo card:
              </Typography>
              <Typography variant="caption" display="block">
                4242 4242 4242 4242
              </Typography>
              <Typography variant="caption" display="block">
                — any future expiration date
              </Typography>
              <Typography variant="caption" display="block">
                — any CVC
              </Typography>
            </Box>

            <PaymentElement />

            {error && (
              <Typography variant="body2" color="error" mt={1} mb={1}>
                {error}
              </Typography>
            )}

            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={!stripe || loading}
              onClick={handlePay}
              sx={{
                mt: 2,
                py: 1.2,
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2DD5C4 0%, #19b3a4 100%)',
                color: '#003833',
                '&:hover': {
                  background: 'linear-gradient(135deg, #33e0cf 0%, #1fc5b5 100%)',
                },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#003833' }} /> : 'Simulate Payment'}
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" fontWeight={700} mb={1}>
              Payment Successful
            </Typography>

            <Typography variant="body2" color="#ffffffAA" mb={2}>
              Your demo payment was successful and you have received your stars.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              onClick={onClose}
              sx={{
                mt: 1,
                py: 1.2,
                fontWeight: 700,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2DD5C4 0%, #19b3a4 100%)',
                color: '#003833',
              }}
            >
              CLOSE
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default PaymentModal;
