import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const { setIsLoggedIn } = useOutletContext();

  const onSubmit = async data => {
    try {
      const response = await fetch(`${import.meta.env.VITE_USER_API + "signup"}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        setApiErrors(result.errors);
      }
      else {
        setApiErrors({});
        const response = await fetch(`${import.meta.env.VITE_USER_API + "login"}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({"email ": data.email},{ "password": data.password}),
        });

        const result = await response.json();
        setIsLoggedIn(true);

        // Redirect to home page and do everything else that needs to be done after login
        window.location.href = '/';

      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mt-5 p-5">
      <h1 className="text-center">Signup</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input
            type="text"
            className={`form-control ${errors.firstName || apiErrors.firstName ? 'is-invalid' : ''}`}
            id="firstName"
            {...register('firstName', { required: 'First name is required' })}
          />
          {(errors.firstName || apiErrors.firstName) && <div className="invalid-feedback">{errors.firstName?.message || apiErrors.firstName}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input
            type="text"
            className={`form-control ${errors.lastName || apiErrors.lastName ? 'is-invalid' : ''}`}
            id="lastName"
            {...register('lastName', { required: 'Last name is required' })}
          />
          {(errors.lastName || apiErrors.lastName) && <div className="invalid-feedback">{errors.lastName?.message || apiErrors.lastName}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="text"
            className={`form-control ${errors.email || apiErrors.email ? 'is-invalid' : ''}`}
            id="email"
            {...register('email', { required: 'Email is required' })}
          />
          {(errors.email || apiErrors.email) && <div className="invalid-feedback">{errors.email?.message || apiErrors.email}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password || apiErrors.password ? 'is-invalid' : ''}`}
            id="password"
            {...register('password', { required: 'Password is required' })}
          />
          {(errors.password || apiErrors.password) && <div className="invalid-feedback">{errors.password?.message || apiErrors.password}</div>}
        </div>
        <button type="submit" className="btn btn-primary">Signup</button>
      </form>
    </div>
  );
}