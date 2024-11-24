function loadCart() {
    const token = getCookie('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Log để debug
    console.log("Token:", token);

    fetch("http://localhost:8080/api/view-card-product", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Log để debug
        console.log("Cart Data:", data);

        if (data && Array.isArray(data.products) && data.products.length > 0) {
            // Giả sử API trả về data.products là mảng các sản phẩm
            displayCartItems(data.products);
            updateCartSummary(data.products);
            updateShippingProgress(data.products);
            updateCartCount(data.products);
        } else {
            displayEmptyCart();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
        displayEmptyCart();
    });
}

function displayCartItems(products) {
    const cartContainer = document.getElementById('cart-items');
    
    let cartHTML = '';
    products.forEach(item => {
        // Log từng item để debug
        console.log("Processing item:", item);

        cartHTML += `
            <div class="cart-item mb-4">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.product.image}" alt="${item.product.name}" class="img-fluid rounded">
                    </div>
                    
                    <div class="col-md-4">
                        <h6 class="product-name mb-1">${item.product.name}</h6>
                        <p class="text-muted mb-0">Mã SP: ${item.product.code || 'N/A'}</p>
                        ${item.product.size ? `<p class="text-muted mb-0">Size: ${item.product.size}</p>` : ''}
                        ${item.product.color ? `<p class="text-muted mb-0">Màu: ${item.product.color}</p>` : ''}
                    </div>
                    
                    <div class="col-md-2">
                        <div class="price-section">
                            <span class="current-price">${formatPrice(item.product.price)}</span>
                            ${item.product.originalPrice ? `
                                <br><span class="original-price text-muted text-decoration-line-through">
                                    ${formatPrice(item.product.originalPrice)}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="col-md-2">
                        <div class="quantity-controls d-flex align-items-center">
                            <button class="btn btn-outline-secondary btn-sm" 
                                onclick="updateQuantity('${item.product._id}', ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-outline-secondary btn-sm" 
                                onclick="updateQuantity('${item.product._id}', ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="col-md-2">
                        <div class="d-flex flex-column align-items-end">
                            <span class="fw-bold mb-2">${formatPrice(item.product.price * item.quantity)}</span>
                            <button class="btn btn-link text-danger p-0" 
                                onclick="removeFromCart('${item.product._id}')">
                                <i class="fas fa-trash-alt"></i> Xóa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    cartContainer.innerHTML = cartHTML;
}

function updateCartSummary(products) {
    const subtotal = products.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shippingFee = subtotal >= 499000 ? 0 : 15000;
    const discount = 0; // Thêm logic giảm giá nếu cần
    const total = subtotal + shippingFee - discount;

    document.querySelector('.subtotal').textContent = formatPrice(subtotal);
    document.querySelector('.shipping-fee').textContent = formatPrice(shippingFee);
    document.querySelector('.discount').textContent = formatPrice(discount);
    document.querySelector('.total-price').textContent = formatPrice(total);
}

function updateShippingProgress(products) {
    const subtotal = products.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const progressContainer = document.getElementById('shipping-progress');
    const freeShippingThreshold = 499000;
    
    if (subtotal < freeShippingThreshold) {
        const remaining = freeShippingThreshold - subtotal;
        const percentage = (subtotal / freeShippingThreshold) * 100;
        
        progressContainer.innerHTML = `
            <div class="alert alert-info">
                <p class="mb-2">Mua thêm <strong>${formatPrice(remaining)}</strong> để được miễn phí vận chuyển</p>
                <div class="progress" style="height: 10px;">
                    <div class="progress-bar" role="progressbar" 
                        style="width: ${percentage}%" 
                        aria-valuenow="${percentage}" 
                        aria-valuemin="0" 
                        aria-valuemax="100">
                    </div>
                </div>
            </div>
        `;
    } else {
        progressContainer.innerHTML = `
            <div class="alert alert-success">
                <p class="mb-0">🎉 Đơn hàng của bạn được miễn phí vận chuyển!</p>
            </div>
        `;
    }
}