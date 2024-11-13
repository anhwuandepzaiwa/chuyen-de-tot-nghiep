// Danh sách các sản phẩm với ảnh mặc định và ảnh hover tương ứng
const products = [
    { id: "productImage1", defaultSrc: "../img/image12.png", hoverSrc: "../img/a6.png" },
    { id: "productImage2", defaultSrc: "../img/a9.jpg", hoverSrc: "../img/a8.jpg" },
    { id: "productImage3", defaultSrc: "../img/a11.jpg", hoverSrc: "../img/a10.jpg" },
    { id: "productImage4", defaultSrc: "../img/a7.png", hoverSrc: "../img/a8.jpg" },
    { id: "productImage5", defaultSrc: "../img/product5.png", hoverSrc: "../img/product5-hover.png" }
];

// Duyệt qua từng sản phẩm và gán sự kiện hover
products.forEach(product => {
    const imgElement = document.getElementById(product.id);

    // Thay đổi ảnh khi hover
    imgElement.addEventListener('mouseover', () => {
        imgElement.src = product.hoverSrc;
    });

    // Đổi lại ảnh gốc khi rời chuột
    imgElement.addEventListener('mouseout', () => {
        imgElement.src = product.defaultSrc;
    });
});
