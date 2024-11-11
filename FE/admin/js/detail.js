window.onload = async function() {
    await fetchProductDetails();
};

async function fetchProductDetails() {
    const prdname = document.getElementById('product-name');
    const prdPrice = document.getElementById('product-price');
    const prdOldPrice = document.getElementById('product-price-old');
    const prdDescription = document.getElementById('product-description');
    const soldCount = document.getElementById('sold-count-value');
    const quantityInput = document.getElementById('quantity');

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzI5NzNlZWJkYmJiNDhmYmM1ODg1MTUiLCJlbWFpbCI6InBoYXRkZW4xOTk4QGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTczMDc3MjE5MiwiZXhwIjoxNzMwODAwOTkyfQ.OEcHB7f2jS40NJShzv8dgd4QGu3qE-4RIjZzO-8SZNA");

    const raw = JSON.stringify({
        "productId": "67297d2d779adf2d167c2eba"
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch("http://localhost:8080/api/product-details", requestOptions);
        const result = await response.json(); // Parse response as JSON

        // Check if the request was successful
        if (result.success && result.data) {
            const product = result.data;
            
            // Update product details in HTML
            prdname.textContent = product.productName || "Product Name not available";
            prdPrice.textContent = `${product.sellingPrice} VND`; // Display selling price
            prdOldPrice.textContent = `${product.price} VND`; // Display original price
            
            prdDescription.textContent = product.description || "No product description available.";

            // Update sold count
            soldCount.textContent = product.soldCount || "0";

            // Optionally, set the stock value based on the product's stock level
            quantityInput.max = product.stock || 100;
            quantityInput.value = 1; // Default quantity to 1
        } else {
            console.error('Failed to fetch product details or product data is empty.');
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}
