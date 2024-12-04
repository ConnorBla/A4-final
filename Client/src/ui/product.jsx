import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './product.css';

export default function Product(props) {
  const [item, setItem] = useState(null);
  const id = props.id;
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
    let cart = cookies.cart ? (cookies.cart + "").split(',') : [];
    cart.push(`${id}`);
    setCookie('cart', cart.join(','), { path: '/' });
    alert('Product added to cart!');
  };


  if (!item) {
    return (
      <div className="card">
        <div className="card-body">Loading...</div>
      </div>
    );
  }

  return (
    <div className="card h-100">
      <Link to={`/Details/${id}`} className="text-decoration-none">
        <img src={imageURLBase + item.imageFileName} alt={`picture of ${item.name}`} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
        <div className="card-body">
          <h5 className="card-title text-muted">{item.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{item.price}</h6>
          <p className="card-text text-muted">{item.description}</p>
        </div>
      </Link>
      <div className="card-footer">
        <button className="btn btn-primary w-100" onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
}