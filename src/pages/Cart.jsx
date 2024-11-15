import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const Cart = () => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [totalPrice, setTotalPrice] = useState(0);

  
  // Calculate total dynamically when cart items change
  useEffect(() => {
    const total = calculateTotal(cartItems); // Using the calculateTotal function
    console.log("Total calculated:", total); // Debugging log
    setTotalPrice(total);
  }, [cartItems]);
  

  useEffect(() => {
    setTotalPrice(calculateTotal(cartItems));
    localStorage.setItem("cart", JSON.stringify(cartItems)); // Sync cart to local storage
  }, [cartItems]);

  const handleCheckout = () => {
    alert("Proceeding to checkout...");
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
  };

  return (
    <div className="cart-container">
      <h2>Jewelry Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} removeFromCart={removeFromCart} />
          ))}
          <div className="cart-summary">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button onClick={handleCheckout} className="checkout-button">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Function to calculate the total price of all items in the cart
const calculateTotal = (cartItems) => {
  return cartItems.reduce((sum, item) => {
    const itemTotal = item.price * item.quantityInCart; // Calculate price for each item
    console.log(
      `Item: ${item.name}, Price: ${item.price}, Quantity: ${item.quantityInCart}, Total: ${itemTotal}`
    ); // Debugging log
    return sum + itemTotal; // Add it to the total sum
  }, 0);
};

const CartItem = ({ item }) => {
  const totalPricePerItem = item.price * item.quantityInCart; // Calculate total for this item

  return (
    <div className="cart-item">
      <h4>
        {item.name} - {item.model}
      </h4>
      <p>
        <strong>Price per Unit:</strong> ${item.price.toFixed(2)}
      </p>
      <p>
        <strong>Quantity in Cart:</strong> {item.quantityInCart}
      </p>
      <p>
        <strong>Stock Left:</strong> {item.stockQuantity}
      </p>
      <p>
        <strong>Description:</strong> {item.description}
      </p>
      <p>
        <strong>Carat:</strong> {item.carat} ct
      </p>
      <p>
        <strong>Metal:</strong> {item.metal}
      </p>
      <p>
        <strong>Gemstone:</strong> {item.gemstone}
      </p>
      <p>
        <strong>Warranty:</strong> {item.warrantyStatus}
      </p>
      <p>
        <strong>Distributor:</strong> {item.distributorInformation}
      </p>
      <p>
        <strong>Total Price for this Item:</strong> $
        {totalPricePerItem.toFixed(2)}
      </p>
      <button
        onClick={() => removeFromCart(item.id)}
        className="remove-from-cart-button"
      >
        Remove from Cart
      </button>
    </div>
  );
};

export default Cart;
