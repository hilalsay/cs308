import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CartContext from '../contexts/CartContext'; // Import CartContext

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext); // Get addToCart from context
  const [image,setImage] = useState("");


  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${productId}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error("Error fetching product details:", error));
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product); // Add product to the cart
      //alert(`${product.name} has been added to the cart!`);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return  (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/*product data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row"> 
         {/*product image 
         <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {product.image.map((item,index)=>(
              <img src={item} key={index} className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer" />
            ))
            }
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full height-auto"/>
          </div>
         </div>*/}
         

         {/*product info*/}
         <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{product.name}</h1>
          <p className="mt-5 text-3xl font-medium">${product.price}</p>
          <p className="my-5 text-gray-500 md:w-4/5">{product.description}</p>        
         </div>

         
      </div>
      <button className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700" onClick={handleAddToCart}>Add to Cart</button>
      
      </div>
  );
};

export default ProductDetails;
