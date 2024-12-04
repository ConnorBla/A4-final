import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { useHref } from "react-router-dom";

export default function Cart() {
  const [cookies] = useCookies(['cart']);
  const [cartItems, setCartItems] = useState([]);


  useEffect(() => {
    const fetchCartItems = async () => {
      if (cookies.cart) {
        const productIds = cookies.cart.split(',');
        const productCountMap = new Map();

        // Count the occurrences of each product ID
        productIds.forEach(id => {
          if (productCountMap.has(id)) {
            productCountMap.set(id, productCountMap.get(id) + 1);
          } else {
            productCountMap.set(id, 1);
          }
        });

        // Fetch the product details for each unique product ID
        const productDetails = await Promise.all([...productCountMap.keys()].map(async (id) => {
          const response = await fetch(`${import.meta.env.VITE_PROD_GET_PROD_BY_ID}${id}`);
          const product = await response.json();
          return {
            ...product,
            quantity: productCountMap.get(id)
          };
        }));

        setCartItems(productDetails);
      }
    };


    fetchCartItems();
  }, [cookies.cart]);

  const removeFromCart = (id) => {
    const newCart = cookies.cart.split(',').filter(productId => productId !== id);
    document.cookie = `cart=${newCart.join(',')}; path=/`;
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container my-10">
      <h1>Cart</h1>
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div>
          <div className="row">
            {cartItems.map((item) => (
              <div key={item.id} className="col-12 mb-4">
                <div className="row align-items-center">
                  <div className="col-3 col-md-2 mw-30">
                    <img src={`${import.meta.env.VITE_PROD_IMAGE_URL}${item.imageFileName}`} alt={`picture of ${item.name}`} className="img-fluid rounded border" />
                  </div>
                  <div className="col-5 col-md-6">
                    <h5>{item.name}</h5>
                    <p>{item.description}</p>
                    <h6 className="text-muted">${item.price}</h6>
                  </div>
                  <div className="col-4 col-md-4 mt-2 mt-md-0 d-flex flex-column align-items-end">
                    <p>Quantity: {item.quantity}</p>
                    <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                    <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>
                      remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row justify-content-end">
              <div className="col-12 col-md-4 d-flex flex-column align-items-end">
                <h2 className="text-right">Grand Total: ${calculateTotal().toFixed(2)}</h2>
                <div className="d-flex justify-content-between w-100">
                  <a href="/Home" className="btn btn-primary mt-2 ml-2">
                    Continue Shopping
                  </a>
                  <a href="/checkout" className="btn btn-primary mt-2 ml-2">
                    Proceed to Checkout
                  </a>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  )
}
