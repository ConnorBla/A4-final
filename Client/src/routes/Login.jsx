import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [apiError, setApiError] = useState('');
  const { setIsLoggedIn } = useOutletContext();

  const onSubmit = async data => {
    try {
      const response = await fetch(`${import.meta.env.VITE_USER_API}login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });

      let result = await response.json();

      if (!response.ok) {
        setApiError(result.error);
      } else {
        setIsLoggedIn(true);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error:', error);
      setApiError('Connection error. Please try again.');
    }
  };

  return (
    <div className="container mt-5 p-5">
      <h1 className="text-center">Login</h1>
      {apiError && (
        <div className="alert alert-danger" role="alert">
          {apiError}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="text"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            id="password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}