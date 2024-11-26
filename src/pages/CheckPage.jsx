import React from 'react'

import ProductRatingAndComment from './ProductRatingAndComment';

const CheckPage = () => {
  const productId = 1; // Replace with actual product ID
  const userId = 123; // Replace with actual user ID
  const isDelivered = true; // Replace with actual delivery status

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <ProductRatingAndComment
          productId={productId}
          userId={userId}
          isDelivered={isDelivered}
        />
      </div>
    </div>
  );
};

export default CheckPage;
