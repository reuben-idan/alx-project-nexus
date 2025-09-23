import React from 'react';

const VerifyEmailNotice: React.FC<{ email?: string }> = ({ email }) => (
  <div className="glass-card p-4 rounded-xl text-center text-glass-700">
    <h3 className="text-lg font-bold mb-2">Verify Your Email</h3>
    <p>
      {email ? `A verification link has been sent to ${email}.` : 'A verification link has been sent to your email address.'}
      <br />
      Please check your inbox and follow the instructions to activate your account.
    </p>
  </div>
);

export default VerifyEmailNotice;
