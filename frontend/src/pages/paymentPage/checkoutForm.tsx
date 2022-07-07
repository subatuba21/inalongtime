import {CardElement} from '@stripe/react-stripe-js';

export const CheckoutForm = () => {
  return (
    <form>
      <CardElement />
      <button>Submit</button>
    </form>
  );
};
