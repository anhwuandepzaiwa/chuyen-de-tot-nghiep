document.addEventListener('DOMContentLoaded', () => {
    const productId = getCookie('productId'); // Lấy productId từ cookie hoặc một nguồn khác
    console.log(productId);

    if (!productId) {
        console.error('Không tìm thấy productId trong cookie');
        return;
    }

    // Thiết lập yêu cầu fetch
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow'
    };

    fetch(`http://localhost:8080/api/product-details?productId=${productId}`, requestOptions)
        .then(response => response.json())
        .then(product => {
            // Hiển thị thông tin sản phẩm
            document.getElementById('product-name').textContent = product.data.productName;
            document.getElementById('product-price').textContent = `$${product.data.discountedPrice || product.data.originalPrice}`;
            document.getElementById('product-price-old').textContent = `$${product.data.originalPrice}`;
            document.getElementById('product-sold-count').textContent = product.data.soldCount;
            document.getElementById('product-description').textContent = product.data.description.introduction;
            document.getElementById('product-usageInstructions').innerHTML = "Cách sử dụng: <br>" + product.data.description.usageInstructions;
            document.getElementById('product-ingredients').textContent = "Thành phần: " + product.data.description.ingredients;
            document.getElementById('product-basicInfo').textContent = product.data.description.basicInfo;
            document.getElementById('product-originInfo').textContent =  product.data.description.originInfo;
            document.getElementById('product-brandInfo').textContent =  product.data.description.brandInfo;
            document.getElementById('product-giftItems').textContent =  product.data.giftItems;
            
            // Hiển thị màu sắc
            const colorsContainer = document.getElementById('product-colors');
            product.data.availableColors.forEach(color => {
                const button = document.createElement('button');
                button.className = 'mau-cart-btn';
                button.textContent = color;
                colorsContainer.appendChild(button);
                console.log(color);
            });
            

            // Hiển thị ảnh sản phẩm
            document.getElementById('main-product-image').src = product.data.productImage[0] || '';
            document.getElementById('product-image-1').src = product.data.productImage[1] || '';
            document.getElementById('product-image-2').src = product.data.productImage[2] || '';
            document.getElementById('product-image-3').src = product.data.productImage[3] || '';
            document.getElementById('product-image-4').src = product.data.productImage[4] || '';
            document.getElementById('product-image-5').src = product.data.productImage[5] || '';
        })
        .catch(error => {
            console.error('Lỗi khi fetch dữ liệu:', error);
        });
});

// Hàm lấy cookie (giống như bạn đã viết)
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}
