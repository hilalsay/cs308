import React from 'react';
import ProductRatingAndComment from './ProductRatingAndComment'; // Import the new component

const OrderDetails = ({ order, userId }) => {
  return (
    <div>
      <h2>Order #{order.id}</h2>
      {order.products.map((product) => (
        <div key={product.productId}>
          <h4>{product.name}</h4>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          
          {/* Pass productId, userId, and isDelivered flag to ProductRatingAndComment */}
          <ProductRatingAndComment
            productId={product.productId}
            userId={userId}
            isDelivered={order.status === 'DELIVERED'}
          />
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;
