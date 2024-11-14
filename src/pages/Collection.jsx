import React from "react";
import Products from "./Products";

const Collection = () => {
  return (
    <div>
      <Products></Products>
      <button className="add-to-cart-buttonH" onClick={handleAddToCart}>
        Add to Cart
      </button>

    </div>
  );
};

export default Collection;
