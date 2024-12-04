import React, { useState, useEffect } from 'react';

function ProductApi() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null)

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await fetch("https://api.freeapi.app/api/v1/public/randomproducts");
            const result = await response.json();
            if(result.success){
                // pick a random joke from the array
                const randomProduct = result.data.data[
                    Math.floor(Math.random() * result.data.data.length)
                ];
                setProduct(randomProduct);
                setData(result.data.data)
            } else {
                setError(result.message || "Failed to fetch joke")
            }
        } catch (error) {
            setError("An error occurred while fetching joke");
        } finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct(); // fetch product when the component mounts
    },[]);

    if(loading) return <div>Loading...</div>
    if(error) return <div>Error : {error}</div>
    return (
        <>
        <div>
            { product && (
                <div>
                    <h2>  Title :{product.title}</h2>
                    <p>Description: {product.description}</p>
                    <p>Price:{product.price}</p>
                    <p>Brand :{product.brand}</p>
                    <p>Rating :{product.rating}⭐</p>
                    <img src={product.images} alt="" />
                </div>
            )

            }
            <button onClick={fetchProduct} >Show new Product</button>
        </div>
       
        </>
    );
}

export default ProductApi;