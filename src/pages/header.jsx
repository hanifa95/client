

import React from "react";

const Header = () => {
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Ошибка при чтении пользователя:", error);
  }

  return (
    <>
 

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow rounded-4 mt-2">
        <div className="container-fluid px-4">

          <a className="navbar-brand fw-bold fs-4 ps-5" href="/">
            Products
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">

            <ul className="navbar-nav mx-auto gap-lg-2">
              <li className="nav-item">
                <a className="nav-link px-3" href="/orders">
                  Orders
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link px-3" href="/inventory">
                  Inventory
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link px-3" href="/courier">
                  Couriers
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link px-3" href="/pickupPoint">
                  Pickup Points
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link px-3" href="/products">
                  Products
                </a>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">

              <button className="btn btn-outline-light border-0">
                <i className="fa-solid fa-bell fs-5"></i>
              </button>

              <button className="btn btn-outline-light border-0">
                <i className="fa-solid fa-cart-shopping fs-5"></i>
              </button>

              <div className="vr bg-secondary mx-2"></div>

              <div className="d-flex align-items-center text-white">
                <div
                  className="rounded-circle bg-primary d-flex justify-content-center align-items-center me-2"
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className="fa-solid fa-user"></i>
                </div>

                <div>
                  <small className="text-light d-block">
                    Logged in as
                  </small>

                  <span className="fw-semibold">
                    {user ? user.email : "No user logged in"}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
