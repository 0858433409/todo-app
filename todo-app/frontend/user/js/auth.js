document.addEventListener("DOMContentLoaded", () => {
  // LOGIN
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("https://todo-backend2-41uh.onrender.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        console.log("Login response:", data);

        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          localStorage.setItem("user_id", data.user_id);
          window.location.href = "../../index.html";
        } else {
          const errorMsg = data?.error || "Đăng nhập thất bại";
          document.getElementById("loginError").textContent = errorMsg;
        }
      } catch (err) {
        if (err instanceof TypeError) {
          document.getElementById("loginError").textContent =
            "Không thể kết nối đến server.";
        } else {
          document.getElementById("loginError").textContent =
            err.message || "Đã xảy ra lỗi.";
        }
      }
    });
  }

  // REGISTER
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("https://todo-backend2-41uh.onrender.com/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Đăng ký thành công! Vui lòng đăng nhập.");
          window.location.href = "../login.html";
        } else {
          document.getElementById("registerError").textContent =
            data.error || "Đăng ký thất bại";
        }
      } catch (err) {
        document.getElementById("registerError").textContent =
          "Lỗi kết nối đến server.";
      }
    });
  }

  // LOGOUT
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "../login.html";
    });
  }
});
