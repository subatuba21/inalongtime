import {Navbar} from '../../components/navbars/Navbar';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {CheckoutForm} from './checkoutForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// eslint-disable-next-line max-len
const stripePromise = loadStripe('pk_test_51LEh4FF1IICh0j2EV4ziKndA0Yugde8UbOrehWMLsRDWC6QfiZfQVAcJBRhxEQnS1uqRDy9vpubuDMJi6oVXfdhW00u8ykqTbu');


export const PaymentPage = () => {
  return <div className="fillPage">
    <Navbar></Navbar>
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  </div>;
};
