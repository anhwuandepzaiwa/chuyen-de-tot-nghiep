// Hàm chuyển đổi giữa các panel Đăng nhập và Đăng ký
function showLoginPanel() {
    // Ẩn panel đăng ký và hiển thị panel đăng nhập
    document.getElementById("register-panel").style.display = "none";
    document.getElementById("login-panel").style.display = "block";

    // Cập nhật trạng thái active cho tab
    // document.getElementById("login-tab").classList.add("active");
    // document.getElementById("register-tab").classList.remove("active");
}

function showRegisterPanel() {
    // Ẩn panel đăng nhập và hiển thị panel đăng ký
    document.getElementById("login-panel").style.display = "none";
    document.getElementById("register-panel").style.display = "block";

    // Cập nhật trạng thái active cho tab
    document.getElementById("register-tab").classList.add("active");
    document.getElementById("login-tab").classList.remove("active");
}

function showLoginPanel() {
    document.getElementById('login-panel').style.display = 'block';
    document.getElementById('register-panel').style.display = 'none';
    document.getElementById('forgot-password-panel').style.display = 'none';
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('register-tab').classList.remove('active');
}

function showRegisterPanel() {
    document.getElementById('login-panel').style.display = 'none';
    document.getElementById('register-panel').style.display = 'block';
    document.getElementById('forgot-password-panel').style.display = 'none';
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('register-tab').classList.add('active');
}

function showForgotPasswordPanel() {
    document.getElementById('login-panel').style.display = 'none';
    document.getElementById('register-panel').style.display = 'none';
    document.getElementById('forgot-password-panel').style.display = 'block';
}
// });
    // Gửi yêu cầu đăng ký
    function register() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('sign-up-email').value;
        const password = document.getElementById('sign-up-password').value;
        const cfpassword = document.getElementById('cfpassword').value;
    
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const raw = JSON.stringify({
            name: name,
            email: email,
            password: password,
            confirmPassword: cfpassword,
        });
    
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
    
        fetch("http://localhost:8080/api/signup", requestOptions)
            .then((response) => response.json()) // Sử dụng .json() để parse JSON trực tiếp
            .then((result) => {
                if (result.success) {  // Kiểm tra xem kết quả có thành công không
                    alert('Đăng ký thành công');
                    console.log(result.data);
    
                    // Chuyển hướng đến trang đăng nhập (hoặc trang bạn muốn)
                    // showLoginPanel(); // Thay "/login" bằng đường dẫn thực tế của bạn
                } else {
                    // Nếu không thành công, hiển thị thông báo lỗi
                    alert(result.message);
                }
            })
            .catch((error) => {
                console.error("Có lỗi xảy ra:", error);
                alert("Đã xảy ra lỗi khi kết nối đến API.");
            });
    }
    

// Đăng nhập người dùng
    function login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(email);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const raw = JSON.stringify({
            email: email,
            password: password
        });
    
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
    
        fetch("http://localhost:8080/api/signin", requestOptions)
            .then((response) => response.json()) // Parse the response as JSON
            .then((result) => {
                if (result.success) {
                    console.log(result.data.isConfirmed);
                    console.log(result.data);
    
                    // Kiểm tra xem email đã xác thực chưa
                    if (result.data.isConfirmed) { 
                        const token = result.data.token;  // Lấy token từ kết quả trả về
                        const name = result.data.name; 
                        // Lưu token vào cookies (ví dụ: với thời gian hết hạn 7 ngày)
                        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60};`; // Token sẽ hết hạn sau 7 ngày
                        document.cookie = `name=${name}; path=/; max-age=${7 * 24 * 60 * 60};`; // Lưu tên người dùng vào cookie
                        alert("Đăng nhập thành công");
                        window.location.href = "/chuyen-de-tot-nghiep/FE/layout/home.html"; // Chuyển trang nếu email đã được xác thực
                    }
                } else {
                    alert('Đăng nhập thất bại: ' + result.message);
                }
            })
            .catch((error) => console.error('Error:', error)); // Log the error if fetch fails
    }

 // gửi otp 
 function send_otp() {
    const forgot_email = document.getElementById("forgot_email").value;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        email: forgot_email,
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://localhost:8080/api/forgot-password", requestOptions)
        .then((response) => response.json())  // Change to response.json() to parse the response as JSON
        .then((result) => {
            if(result.success){
                alert (result.message);
            }else {
                alert("Đăng nhập thất bại"  + result.message);
            }
        })
        .catch((error) => console.error('Error:', error));
}
    // Xác thực otp vào nút đăng nhập
    function confirm() {
        const forgot_email = document.getElementById("forgot_email").value;
        const otp = document.getElementById("otp").value;
        const new_password = document.getElementById("new_password").value;
        const confirm_new_password = document.getElementById("confirm_new_password").value;

    
        // Tiến hành gửi yêu cầu nếu mọi thứ hợp lệ
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        const raw = JSON.stringify({
          email: forgot_email,
          otp: otp,
          newPassword: new_password,
          confirmPassword: confirm_new_password
        });
        
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };
        
        fetch("http://localhost:8080/api/reset-password", requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
    }
    
    
    


