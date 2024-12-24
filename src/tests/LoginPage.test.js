import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AuthContext } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import '@testing-library/jest-dom';

test('renders login form', () => {
  const mockContext = { login: jest.fn() };
  render(
    <AuthContext.Provider value={mockContext}>
      <LoginPage />
    </AuthContext.Provider>
  );

  const emailInput = screen.getByLabelText(/Email:/i);
  const passwordInput = screen.getByLabelText(/Password:/i);
  const button = screen.getByRole('button', { name: /Login/i });

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(button).toBeInTheDocument();

  fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
  fireEvent.change(passwordInput, { target: { value: '123456' } });
  fireEvent.click(button);

  expect(mockContext.login).toHaveBeenCalledWith('user@example.com', '123456');
});
