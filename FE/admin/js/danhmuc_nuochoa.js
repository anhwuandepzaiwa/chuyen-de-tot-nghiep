async function getProducts() {
    const myHeaders = new Headers();

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        // Fetch only 10 products (limit=10)
        const response = await fetch("http://localhost:8080/api/getProductFromUser?category=Nước hoa&page=1&limit=8", requestOptions);

        // Check if the response is successful (status code 200)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        console.log("API Response:", jsonResponse); // Log the entire response to inspect it

        // Check if the 'data' property exists and is an array
        if (jsonResponse && Array.isArray(jsonResponse.data)) {
            const products = jsonResponse.data;
            console.log("Products array:", products); // Log the products array

            // Update category and total product count dynamically
            const categoryElement = document.querySelector('[data-category]'); // Find the element with data-category
            if (categoryElement) {
                categoryElement.textContent = jsonResponse.category || "Nước hoa"; // Replace with actual category name if available
                categoryElement.setAttribute('data-category', jsonResponse.category || "Nước hoa"); // Set the category data attribute
            }

            const totalProductsElement = document.querySelector('.totalProducts'); // Find the element with class totalProducts
            if (totalProductsElement) {
                totalProductsElement.textContent = `${jsonResponse.totalProducts || products.length} sản phẩm`; // Update with total product count
            }

            // Get the container where products will be displayed
            const productContainer = document.getElementById('product-container');
            let productRow = null; // Initialize a new row container

            // Loop through the products and create HTML for each one
            products.forEach((product, index) => {
                // Create a new row every 5 products
                if (index % 4 === 0) {
                    // If there's a previous row, append it to the container
                    if (productRow) {
                        productContainer.appendChild(productRow);
                    }
                    // Create a new row for the next set of 5 products
                    productRow = document.createElement('div');
                    productRow.classList.add('row', 'justify-content-center'); // Start a new row
                }

                const productElement = document.createElement('div');
                productElement.classList.add('col-md-3'); // Each product takes up 3 columns in a 12-column grid

                // Use product fields from API response
                const productImage = product.productImage && product.productImage.length > 0 ? product.productImage[0] : '../img/default-product.png';  // Default image if no product image
                const productName = product.productName;
                const originalPrice = product.originalPrice;
                const discountedPrice = product.discountedPrice;
                const discountPercentage = product.discountPercentage;

                // Construct the product card HTML
                productElement.innerHTML = `
                    <div class="card product-card">
                        <div class="image-container">
                            <img src="${productImage}" class="card-img-top" alt="${productName}">
                        </div>
                        <div class="card-body">
                            <div class="card-title" style="padding: 5px;">
                                <h5 style="font-size: 16px; text-align: left;">${productName}</h5>
                                <p style="text-align: left;">+6 màu sắc</p>
                            </div>
                            <div class="text" style="display: flex; justify-content: space-between;">
                                <div style="margin-top: -20px;">
                                    <p style="color: #EBB;font-weight: bold">${discountedPrice}đ</p>
                                    <p style="text-decoration: line-through; margin-top: -20px; color: #DBE2EB; font-weight: bold;">
                                        ${originalPrice}đ
                                    </p>
                                </div>
                                <p style="border: 1px solid #EBB; background: #EBB; border-radius: 10px;">-${discountPercentage.toFixed(0)}%</p>
                            </div>
                            <a href="#" class="btn btn-primary" style="background: #EBB; border: #EBB;">Thêm vào giỏ hàng</a>
                        </div>
                    </div>
                `;

                // Append the product to the current row
                productRow.appendChild(productElement);
            });

            // Append the last row if any
            if (productRow) {
                productContainer.appendChild(productRow);
            }

        } else {
            console.error('Data is not an array or is missing');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Call the getProducts function when the page loads
window.onload = getProducts;
