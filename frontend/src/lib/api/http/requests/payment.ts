import { postRequest } from '../index.ts';

export const paymentRequest = () => {
  return postRequest('/users/payment');
};
