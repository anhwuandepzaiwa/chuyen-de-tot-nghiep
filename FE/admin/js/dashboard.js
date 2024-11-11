async function getProducts() {
    try {
        const response = await fetch('http://localhost:8080/api/get-product?page=1&limit=5'); // Địa chỉ API trả về dữ liệu sản phẩm
        const jsonResponse = await response.json();

        console.log(jsonResponse); // Kiểm tra cấu trúc dữ liệu trả về

        // Kiểm tra nếu thuộc tính 'data' là mảng
        const products = jsonResponse.data;
        if (Array.isArray(products)) {
            const productListContainer = document.getElementById('new-product');
            const productListContainer2 = document.getElementById('new-product2');

            // Duyệt qua danh sách sản phẩm và tạo HTML cho mỗi sản phẩm
            products.forEach(product => {
                // Tạo phần tử mới cho mỗi sản phẩm
                const productElement = document.createElement('div');
                productElement.classList.add('new-product');
                productElement.classList.add('new-product2');

                // Sử dụng các trường dữ liệu từ API
                const productImage = product.productImage.length > 0 ? product.productImage[0] : '../img/default-product.png'; // Kiểm tra nếu có ảnh, nếu không thì dùng ảnh mặc định
                const productName = product.productName;
                const originalPrice = product.originalPrice;
                const discountedPrice = product.discountedPrice;
                const  discountPercentage = product. discountPercentage;
                const id = product._id;
                console.log(id);
                
                // const price = product.price;
                // const discountPercentage = ((price - sellingPrice) / price) * 100;
                console.log(productName);
                console.log(originalPrice);
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
                                <p class="discount">-${ discountPercentage.toFixed(0)}%</p>
                            </div>
                        </div>
                        <div class="cart-product">
                            <img src="../img/giohang.png" class="cart-icon" alt="">
                            <p class="cart-text">Thêm vào giỏ hàng</p>
                        </div>
                    </div>
                `;

                // Thêm sản phẩm vào cả hai container
                const productClone1 = productElement.cloneNode(true); // Tạo bản sao cho container đầu tiên
                const productClone2 = productElement.cloneNode(true); // Tạo bản sao cho container thứ hai

                productListContainer.appendChild(productClone1);
                productListContainer2.appendChild(productClone2);
            });
        } else {
            console.error('Dữ liệu không phải là mảng');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Gọi hàm getProducts khi trang web được tải
window.onload = getProducts;
