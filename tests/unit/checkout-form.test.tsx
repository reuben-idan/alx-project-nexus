import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useForm } from 'react-hook-form';

type FormData = {
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  paymentMethod?: 'credit-card' | 'paypal' | 'apple-pay';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
};

function TestCheckoutForm() {
  const { register, handleSubmit, formState: { errors }, trigger } = useForm<FormData>({ defaultValues: { paymentMethod: 'credit-card' } });
  const onSubmit = () => {};
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="email" placeholder="email" {...register('email', { required: 'Email is required' })} />
      {errors.email && <div role="alert">{errors.email.message}</div>}

      <input id="firstName" placeholder="first" {...register('firstName', { required: 'First name is required' })} />
      {errors.firstName && <div role="alert">{errors.firstName.message}</div>}

      <input id="cardNumber" placeholder="card" {...register('cardNumber', { required: 'Card required', pattern: { value: /^[0-9\s]{13,19}$/, message: 'Invalid card' } })} />
      {errors.cardNumber && <div role="alert">{errors.cardNumber.message}</div>}

      <button type="button" onClick={() => { trigger(['email','firstName']); }}>Validate Shipping</button>
      <button type="button" onClick={() => { trigger(['cardNumber']); }}>Validate Card</button>
    </form>
  );
}

describe('Checkout form validation (DOM)', () => {
  it('shows shipping validation messages when fields missing', async () => {
    render(<TestCheckoutForm />);
    fireEvent.click(screen.getByText('Validate Shipping'));
    // After trigger, error messages should appear
    expect(await screen.findByRole('alert')).toBeTruthy();
  });

  it('accepts valid card number pattern', async () => {
    render(<TestCheckoutForm />);
    const cardInput = screen.getByPlaceholderText('card') as HTMLInputElement;
    fireEvent.change(cardInput, { target: { value: '4242424242424242' } });
    fireEvent.click(screen.getByText('Validate Card'));
    // No error should be present for cardNumber
    const alerts = screen.queryAllByRole('alert');
    // The first alert may be from shipping, but card-specific should not show invalid card
    expect(alerts.some(a => a.textContent?.includes('Invalid card'))).toBeFalsy();
  });
});
