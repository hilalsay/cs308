import React, { useState, useEffect } from "react";
import "./Cart.css";

const sampleCartItems = [
  {
    id: "5e6cfa9e-d568-4fb0-a5b4-8c4337d8cf16",
    name: "Platinum Engagement Ring",
    model: "ER-1024",
    serialNumber: "SN998877",
    description:
      "A stunning platinum engagement ring with a 2-carat round brilliant diamond.",
    stockQuantity: 20,
    quantityInCart: 1,
    price: 4999.99,
    warrantyStatus: "Active",
    distributorInformation: "Lux Gem Jewelry",
    carat: 2,
    metal: "Platinum",
    gemstone: "Diamond",
  },
  {
    id: "b45735b8-56c2-4b29-80a4-9c987bfcb21f",
    name: "18K Gold Sapphire Earrings",
    model: "E-1001",
    serialNumber: "SN223344",
    description:
      "A pair of 18K gold earrings featuring exquisite blue sapphires set in a classic prong setting.",
    stockQuantity: 15,
    quantityInCart: 2,
    price: 799.99,
    warrantyStatus: "Active",
    distributorInformation: "Sapphire World Jewelers",
    carat: 1.5,
    metal: "18K Gold",
    gemstone: "Sapphire",
  },
  {
    id: "f67cfea1-e748-4ff1-9a34-5b7b2f3a25b7",
    name: "Diamond Tennis Bracelet",
    model: "DB-TB456",
    serialNumber: "SN556677",
    description:
      "An elegant diamond tennis bracelet crafted from 14K white gold with 1.25 carats of diamonds.",
    stockQuantity: 10,
    quantityInCart: 1,
    price: 2499.99,
    warrantyStatus: "Active",
    distributorInformation: "Diamond Spark Jewelers",
    carat: 1.25,
    metal: "14K White Gold",
    gemstone: "Diamond",
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(sampleCartItems);
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate total dynamically when cart items change
  useEffect(() => {
    const total = calculateTotal(cartItems); // Using the calculateTotal function
    console.log("Total calculated:", total); // Debugging log
    setTotalPrice(total);
  }, [cartItems]);

  const handleCheckout = () => {
    alert("Proceeding to checkout...");
  };

  return (
    <div className="cart-container">
      <h2>Jewelry Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
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
    </div>
  );
};

export default Cart;
