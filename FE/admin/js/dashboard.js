async function getProducts() {
    const myHeaders = new Headers();

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch("http://localhost:8080/api/getProductFromUser?new=true&page=1&limit=5", requestOptions);
        
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

            // Get the containers
            const productListContainer = document.getElementById('new-product');
            const productListContainer2 = document.getElementById('new-product2');

            // Check if the containers exist
            if (!productListContainer || !productListContainer2) {
                console.error("Product containers not found on the page!");
                return;
            }


            // Loop through the products and create HTML for each one
            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('new-product');
                productElement.classList.add('new-product2');

                // Use product fields from API response
                const productImage = product.productImage.length > 0 ? product.productImage[0] : '../img/default-product.png';  // Default image if no product image
                const productName = product.productName;
                const originalPrice = product.originalPrice;
                const discountedPrice = product.discountedPrice;
                const discountPercentage = product.discountPercentage;

                productElement.innerHTML = `
                    <div class="sp-product">
                        <img src="${productImage}" alt="${productName}">
                        <div class="name-product">
                            <strong>${productName}</strong>
                            <p class="color-options">+6 màu sắc</p>
                        </div>
                        <div class="price-product">
                            <div>
                                <p style="color: #F7ADBA;">${discountedPrice}đ</p>
                                <p style="text-decoration: line-through; opacity: 0.5; font-size: 18px;">
                                    ${originalPrice}đ
                                </p>
                            </div>
                            <div class="voucher">
                                <p class="discount">-${discountPercentage.toFixed(0)}%</p>
                            </div>
                        </div>
                        <div class="cart-product">
                            <img src="../img/giohang.png" class="cart-icon" alt="">
                            <p class="cart-text">Thêm vào giỏ hàng</p>
                        </div>
                    </div>
                `;

                // Add product to both containers
                const productClone1 = productElement.cloneNode(true);  // Clone for the first container
                const productClone2 = productElement.cloneNode(true);  // Clone for the second container

                productListContainer.appendChild(productClone1);
                productListContainer2.appendChild(productClone2);
            });
        } else {
            console.error('Data is not an array or is missing');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
    // Hàm này hiển thị category và thay đổi màu nền của nút đã chọn
    function showCategory(category) {

        // Bỏ màu nền cho tất cả các nút
        const buttons = document.querySelectorAll('.td2 button');
        buttons.forEach(function(button) {
            button.classList.remove('selected');
        });


        // Thêm màu nền cho nút đã chọn
        const selectedButton = document.getElementById('link-' + category);
        if (selectedButton) {
            selectedButton.classList.add('selected');
        }
    }


// Call the getProducts function when the page loads
window.onload = getProducts;
