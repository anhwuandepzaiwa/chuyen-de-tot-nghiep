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
        // Check if the 'data' property exists and is an array
        if (jsonResponse && Array.isArray(jsonResponse.data)) {
            const products = jsonResponse.data;

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
                        <img src="${productImage}" alt="${productName}" style="width: 300px; height: 250px;">
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
                            <p class="cart-text" onclick="add_to_cart('${product._id}">Thêm vào giỏ hàng</p>
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
let currentPage = 1;  // Mặc định là trang đầu tiên
let currentCategory = 'Trang ';  // Mặc định là danh mục Trang điểm

// Fetch sản phẩm từ API
function fetchProducts(category, page = 1) {
    const myHeaders = new Headers();
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch(`http://localhost:8080/api/getProductFromUser?subcategory=${category}&new=true&page=${page}&limit=8`, requestOptions)
        .then(response => response.json())  // Parse JSON response
        .then(result => {
            console.log(result.data); // Log sản phẩm vào console
            console.log(category);
            displayProducts(result.data); // Hiển thị sản phẩm
            updatePagination(result.totalPages); // Cập nhật phân trang
        })
        .catch(error => console.error("Error fetching products:", error));
}

// Hiển thị sản phẩm trong HTML
function displayProducts(products) {
    // Tạo 2 div để chứa các sản phẩm
    const firstContainer = document.createElement('div');  // Để chứa 4 sản phẩm đầu tiên
    const secondContainer = document.createElement('div'); // Để chứa 4 sản phẩm tiếp theo

    firstContainer.classList.add('dm-sp'); // Class cho khối 1
    secondContainer.classList.add('dm-sp'); // Class cho khối 2

    // Duyệt qua các sản phẩm và chia thành 2 nhóm (4 sản phẩm mỗi nhóm)
    products.forEach((product, index) => {
        // Tạo phần tử sản phẩm
        const productElement = `
            <div class="sp-product" style="cursor: pointer; width: 250px;">
                <img src="${product.productImage[0] || '../img/default.png'}" alt="${product.productName}" onclick="detail_product('${product._id}')" style="width: 300px; height: 250px;">
                <div class="name-product">
                    <strong onclick="detail_product('${product._id}')" >${product.productName}</strong>
                    <p class="color-options">+${product.availableColors.length} màu sắc</p>
                </div>
                <div class="price-product">
                    <div>
                        <p style="color: #F7ADBA;">${product.discountedPrice ? product.discountedPrice : product.originalPrice}đ</p>
                        <p style="text-decoration: line-through; opacity: 0.5; font-size: 18px;">${product.originalPrice}đ</p>
                    </div>
                    <div class="voucher">
                        <p class="discount">-${product.discountPercentage}%</p>
                    </div>
                </div>
                <div class="cart-product">
                    <img src="../img/giohang.png" class="cart-icon" alt="Thêm vào giỏ hàng" onclick = "add_to_cart('${product._id}')">
                    <p class="cart-text" onclick = "add_to_cart('${product._id}')" style="cursor: pointer; font-size: 14px;">Thêm vào giỏ hàng</p>
                </div>
            </div>
        `;

        // Nếu sản phẩm là trong 4 sản phẩm đầu tiên
        if (index < 4) {
            firstContainer.innerHTML += productElement; // Thêm vào firstContainer
        } else if (index >= 4) {
            secondContainer.innerHTML += productElement; // Thêm vào secondContainer
        }
    });

    // Lấy phần tử chứa sản phẩm trên trang (ví dụ: .dm-sp)
    const productContainer = document.querySelector('.dm-sp');
    productContainer.innerHTML = '';  // Xóa sản phẩm cũ

    // Thêm 2 khối div (mỗi khối chứa 4 sản phẩm)
    productContainer.appendChild(firstContainer);
    productContainer.appendChild(secondContainer);
}



// Cập nhật phân trang
function updatePagination(totalPages) {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';  // Xóa phân trang cũ

    // Nút "Trước"
    const prevButton = document.createElement('button');
    prevButton.innerText = 'Trước';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            fetchProducts(currentCategory, currentPage);
        }
    };
    paginationContainer.appendChild(prevButton);

    // Các nút trang
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.classList.toggle('active', i === currentPage);  // Đánh dấu trang hiện tại
        pageButton.onclick = () => {
            currentPage = i;
            fetchProducts(currentCategory, currentPage);
        };
        paginationContainer.appendChild(pageButton);
    }

    // Nút "Tiếp theo"
    const nextButton = document.createElement('button');
    nextButton.innerText = 'Tiếp theo';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchProducts(currentCategory, currentPage);
        }
    };
    paginationContainer.appendChild(nextButton);
}

// Lấy và hiển thị sản phẩm theo category
function showCategory(button) {
    const category = button.textContent;  // Lấy giá trị text của button và chuẩn hóa
    currentCategory = category;
    currentPage = 1;  // Quay lại trang đầu tiên khi thay đổi danh mục
    fetchProducts(currentCategory, currentPage);  // Lấy sản phẩm của category mới
}

// Fetch sản phẩm khi trang load
document.addEventListener('DOMContentLoaded', () => {
    // Lấy phần tử Xin chào và Đăng kí/Đăng nhập
    let textElement = document.getElementById('text_content');
    let greetingText = document.getElementById('greeting-text');
    const userInfo = document.getElementById('user-info');

    // Kiểm tra sự tồn tại của cookie "username"
    let username = getCookie('name'); // Lấy cookie username

    // Nếu cookie "username" tồn tại, hiển thị thông tin và nút Đăng xuất
    if (username) {
        // Thay đổi nội dung văn bản của phần tử Đăng kí/Đăng nhập thành "Xin chào [username]"
        greetingText.textContent = "Xin chào, " + username;
        // Ẩn liên kết Đăng kí/Đăng nhập
        textElement.style.display = 'none'; // Ẩn liên kết Đăng kí/Đăng nhập
        // Hiển thị phần tử chứa tên người dùng và Đăng xuất
        userInfo.style.display = 'block'; // Hiển thị thông tin người dùng
    } else {
        // Nếu không có cookie "username", vẫn giữ liên kết "Đăng kí/Đăng nhập"
        greetingText.textContent = "";
        userInfo.style.display = 'none'; // Ẩn phần tử chứa tên người dùng
    }
});

// Hàm lấy giá trị cookie
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null; // Nếu cookie tồn tại, trả về giá trị, nếu không trả về null
}

// Hàm xóa tất cả cookies
function deleteAllCookies() {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
        const cookieName = cookie.split('=')[0].trim();
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; // Đặt cookie với ngày hết hạn trong quá khứ
    });
}

// Hàm Đăng xuất
function sign_out() {
    deleteAllCookies(); // Xóa tất cả cookies
    window.location.href = "home.html"; // Chuyển hướng về trang chủ hoặc trang đăng nhập
}
function detail_product(productId){
    console.log(productId);
    document.cookie = `productId=${productId}; path=/; max-age=${7 * 24 * 60 * 60};`;
    location.href = "detail.html";
}

function add_to_cart(productId) {
    // Lấy token trực tiếp từ cookie 'token'
    console.log(productId);
    
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

    console.log('Token from cookie:', token);

    if (!token) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        return;
    }

    fetch("http://localhost:8080/api/addtocart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,  // Gửi token trong Authorization header
        },
        body: JSON.stringify({
            productId: productId,
            quantity: 1,
        }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
.then((result) => {
    console.log("Add to Cart Response:", result);
    alert('Sản phẩm đã được thêm vào giỏ hàng');
})
    .catch((error) => console.error("Add to Cart Error:", error));
}

// Call the getProducts function when the page loads
window.onload = getProducts;
