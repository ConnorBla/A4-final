import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Details.css';

export default function Details() {
  const [item, setItem] = useState(null);
  const { id } = useParams();
  const apiURL = import.meta.env.VITE_PROD_GET_PROD_BY_ID;
  const imageURLBase = import.meta.env.VITE_PROD_IMAGE_URL;
  const [cookies, setCookie] = useCookies(['cart']);

  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(apiURL + id);
      const prod = await response.json();
      setItem(prod);
    }
    fetchProduct();
  }, [id, apiURL]);

  const addToCart = () => {
    let cart = cookies.cart ? String(cookies.cart).split(',') : [];
    cart.push(id);
    setCookie('cart', cart.join(','), { path: '/' });
    alert('Product added to cart!');
  };

  if (!item) {
    return (
      <div className="container text-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4 details-container">
      <a href='/Home' className="btn btn-secondary back-button">
        &larr; Back to Home
      </a>
      <div className="row details-content">
        <div className="col-md-6">
          <img src={imageURLBase + item.imageFileName} alt={`picture of ${item.name}`} className="img-fluid rounded border" />
        </div>
        <div className="col-md-6 d-flex flex-column">
          <h1 className="display-4">{item.name}</h1>
          <p className="lead">{item.description}</p>
          <div className="add-to-cart-container mt-auto">
            <span className="price">${item.price}</span>
            <button className="btn btn-primary btn-lg" onClick={addToCart}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}