  import { useState } from "react";
  import { useEffect } from "react";
  import axios from "axios";

  const USD_TO_KGS = 87.85;

  function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(() => {
      return JSON.parse(localStorage.getItem("cart")) || [];
    });
    // const [favorites, setFavorites] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [favorites, setFavorites] = useState(() => {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    });

    const handleFavorite = (product) => {
      const exists = favorites.some((item) => item.id === product.id);

      let updated;

      if (exists) {
        updated = favorites.filter((item) => item.id !== product.id);
      } else {
        updated = [...favorites, product];
      }

      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://6a2fc982a7f8866418d5125a.mockapi.io/products"
        );
        if (response.status === 200) {
          setProducts(response.data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };

    useEffect(() => {
      fetchProducts();
    }, []);

    const categories = [
      "All",
      ...new Set(products.map((product) => product.category)),
    ];

    const handleAddToCart = (product) => {
      const existingProduct = cart.find((item) => item.id === product.id);

      let updatedCart;

      if (existingProduct) {
        updatedCart = cart.map((item) =>
          item.id === product.id
            ? { ...item, count: (Number(item.count) || 1) + 1 }
            : item
        );
      } else {
        updatedCart = [
          ...cart,
          {
            ...product,
            count: 1,
          },
        ];
      }

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // const handleFavorite = (product) => {
    //   const exists = favorites.some((item) => item.id === product.id);

    //   if (exists) {
    //     setFavorites(favorites.filter((item) => item.id !== product.id));
    //   } else {
    //     setFavorites([...favorites, product]);
    //   }
    // };

    const addToCart = async (product) => {
      console.log("Adding to cart:", product);
      const cartItem = {
        customerName: "test",
        customerPhone: "+99999999999",
        items: cart,
        address: "Ош",
        totalAmount: 25000,
        status: "confirmed",
        note: "test",
      };
      console.log("Cart item:", cartItem);

      try {
        const response = await axios.post(
          "https://6a2fc982a7f8866418d5125a.mockapi.io/orders",
          cartItem
        );
        if (response.status === 201) {
          console.log("Product added to cart successfully");
        } else {
          console.error("Failed to add product to cart");
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    };

    const filteredProducts = products.filter((product) => {
      const matchesSearch = product.description
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const matchesMin =
        minPrice === "" || Number(product.price) >= Number(minPrice);

      const matchesMax =
        maxPrice === "" || Number(product.price) <= Number(maxPrice);

      return matchesSearch && matchesCategory && matchesMin && matchesMax;
    });

   
    
return (
  <div
    className="min-vh-100 py-5"
    style={{ background: "#F1F5FB" }}
  >
    <div className="container">

      {/* User Account */}
      <div
        className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-4 mb-4 rounded-4 shadow"
        style={{
          background: "linear-gradient(120deg, #0B1F3A, #174477)",
          color: "white"
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <i className="bi bi-person-circle fs-1 text-info"></i>
          <div>
            <small className="text-info">Welcome back</small>
            <h5 className="fw-bold mb-0">You are logged in as</h5>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-4">
          <span className="fw-bold">
            <i className="bi bi-person-fill me-2"></i>
            {user.name}
          </span>
          <span>
            <i className="bi bi-envelope-fill me-2"></i>
            {user.email}
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-5">
        <div>
          <h1 className="fw-bold mb-1" style={{ color: "#0B1F3A" }}>
            <i className="bi bi-bag-heart-fill me-2"></i>
            Product Store
          </h1>
          <p className="text-secondary mb-0">
            Discover your favorite products
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <a href="/orders" className="btn text-white rounded-pill px-3"
            style={{ background: "#0B1F3A" }}>
            <i className="bi bi-receipt me-2"></i>Orders
          </a>

          <a href="/inventory" className="btn text-white rounded-pill px-3"
            style={{ background: "#174477" }}>
            <i className="bi bi-box-seam me-2"></i>Inventory
          </a>

          <a href="/PickupPointsList" className="btn text-white rounded-pill px-3"
            style={{ background: "#2563A6" }}>
            <i className="bi bi-geo-alt me-2"></i>Pickup Points
          </a>
        </div>
      </div>

      {/* Statistics */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-secondary mb-1">Products</p>
                <h3 className="fw-bold mb-0" style={{ color: "#0B1F3A" }}>
                  {products.length}
                </h3>
              </div>
              <i className="bi bi-box-seam fs-1 text-primary"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-secondary mb-1">Favorites</p>
                <h3 className="fw-bold text-danger mb-0">
                  {favorites.length}
                </h3>
              </div>
              <i className="bi bi-heart-fill fs-1 text-danger"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-secondary mb-1">Shopping Cart</p>
                <h3 className="fw-bold mb-0" style={{ color: "#0B1F3A" }}>
                  {cart.length}
                </h3>
              </div>
              <i className="bi bi-cart-fill fs-1 text-primary"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Shopping Cart */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h4 className="fw-bold mb-2" style={{ color: "#0B1F3A" }}>
                <i className="bi bi-cart3 me-2"></i>
                Shopping Cart ({cart.length})
              </h4>

              {cart.length === 0 ? (
                <p className="text-secondary mb-0">
                  Your shopping cart is empty
                </p>
              ) : (
                <ul className="list-group mt-3">
                  {cart.map((product, index) => (
                    <li
                      key={`${product.id}-${index}`}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span className="fw-semibold">
                        {product.title || product.name || product.description}
                      </span>
                      <span className="badge rounded-pill text-white"
                        style={{ background: "#174477" }}>
                        {Number(product.price).toLocaleString("ru-RU")} сом
                        {" / "}$
                        {(Number(product.price) / USD_TO_KGS).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <a
              href="/checkout"
              className="btn text-white rounded-pill px-4 py-3 fw-bold"
              style={{ background: "#0B1F3A" }}
            >
              Checkout <i className="bi bi-arrow-right ms-2"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Favorites */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0" style={{ color: "#0B1F3A" }}>
              <i className="bi bi-heart-fill text-danger me-2"></i>
              Favorite Products
            </h4>

            <a href="/favorites" className="btn btn-outline-danger rounded-pill">
              View All
            </a>
          </div>

          {favorites.length === 0 ? (
            <p className="text-secondary mb-0">No favorite products yet</p>
          ) : (
            <ul className="list-group">
              {favorites.map((product) => (
                <li
                  key={product.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{product.name}</strong>
                    <br />
                    <small className="text-secondary">${product.price}</small>
                  </div>

                  <button
                    className="btn btn-outline-danger btn-sm rounded-pill px-3"
                    onClick={() => handleFavorite(product)}
                  >
                    <i className="bi bi-trash me-1"></i> Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center my-4">
          <div
            className="spinner-border"
            style={{ color: "#174477" }}
          ></div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <h4 className="fw-bold mb-3" style={{ color: "#0B1F3A" }}>
            <i className="bi bi-search me-2"></i>
            Find Products
          </h4>

          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control rounded-3 py-2"
                placeholder="🔍 Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <input
                type="number"
                className="form-control rounded-3 py-2"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <input
                type="number"
                className="form-control rounded-3 py-2"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select rounded-3 py-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold mb-0" style={{ color: "#0B1F3A" }}>
          <i className="bi bi-grid-fill me-2"></i>
          Our Products
        </h3>
        <span className="badge rounded-pill px-3 py-2 text-white"
          style={{ background: "#174477" }}>
          {filteredProducts.length} Products
        </span>
      </div>

      <div className="row g-4">
        {filteredProducts.map((product) => (
          <div className="col-sm-6 col-lg-4" key={product.id}>
            <div
              className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden"
              style={{
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-7px)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(11,31,58,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center p-3"
                style={{ background: "#F8FAFD" }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    height: "240px",
                    width: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>

              <div className="card-body d-flex flex-column p-4">
                <span className="badge rounded-pill align-self-start mb-3"
                  style={{
                    background: "#E4EDF8",
                    color: "#174477"
                  }}>
                  {product.category}
                </span>

                <h5 className="fw-bold" style={{ color: "#0B1F3A" }}>
                  {product.title}
                </h5>

                <p className="text-secondary">
                  {product.description}
                </p>

                <div className="mt-auto">
                  <h3 className="fw-bold mb-0" style={{ color: "#174477" }}>
                    {Number(product.price).toLocaleString("ru-RU")} сом
                  </h3>

                  <p className="text-secondary small mb-3">
                    ${(Number(product.price) / USD_TO_KGS).toFixed(2)}
                  </p>

                  <button
                    className="btn w-100 text-white rounded-pill fw-bold py-2 mb-2"
                    style={{ background: "#0B1F3A" }}
                    onClick={() => handleAddToCart(product)}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Add to Cart
                  </button>

                  <button
                    className={`btn w-100 rounded-pill ${
                      favorites.some((item) => item.id === product.id)
                        ? "btn-danger"
                        : "btn-outline-danger"
                    }`}
                    onClick={() => handleFavorite(product)}
                  >
                    <i className="bi bi-heart-fill me-2"></i>
                    {favorites.some((item) => item.id === product.id)
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
);

  }

  export default Products;
