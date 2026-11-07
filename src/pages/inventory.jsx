import axios from "axios";
import { useEffect, useState } from "react";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      const response = await axios.get(
        "https://6a2fc982a7f8866418d5125a.mockapi.io/products"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке товаров:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const updateProduct = async (product) => {
    try {
      await axios.put(
        `https://6a2fc982a7f8866418d5125a.mockapi.io/products/${product.id}`,
        product
      );
    } catch (error) {
      console.error("Ошибка при обновлении товара:", error);
      getProducts();
    }
  };

  const changeProduct = (product, changes) => {
    const updated = { ...product, ...changes };

    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));

    updateProduct(updated);
  };

  const increase = (product) => {
    const quantity = (Number(product.quantity) || 0) + 1;

    changeProduct(product, {
      quantity,
      inStock: true,
    });
  };

  const decrease = (product) => {
    const quantity = Math.max(0, (Number(product.quantity) || 0) - 1);

    changeProduct(product, {
      quantity,
      inStock: quantity > 0,
    });
  };

  const toggleStock = (product) => {
    changeProduct(product, {
      inStock: !product.inStock,
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "inStock" && product.inStock === true) ||
      (filter === "outOfStock" && product.inStock === false);

    const matchesSearch = (product.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.inStock === true).length;
  const unavailableProducts = products.filter(
    (p) => p.inStock === false
  ).length;
  const totalQuantity = products.reduce(
    (sum, p) => sum + (Number(p.quantity) || 0),
    0
  );

  return (
    <div className="inventory-page py-5">
      <div className="container">
        {/* Заголовок */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <span className="text-primary fw-semibold small">
              УПРАВЛЕНИЕ СКЛАДОМ
            </span>
            <h2 className="fw-bold mt-2 mb-1">Склад товаров</h2>
            <p className="text-secondary mb-0">
              Управляйте запасами и контролируйте наличие товаров
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0">
            <a href="/products">
              <button className="btn btn-primary"> Products</button>
            </a>

            <button
              className="btn btn-primary rounded-3 px-4 py-2"
              onClick={getProducts}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Обновить данные
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stat-card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="text-secondary mb-2">Всего товаров</p>
                    <h3 className="fw-bold mb-0">{totalProducts}</h3>
                  </div>
                  <div className="stat-icon bg-primary-subtle text-primary">
                    <i className="bi bi-box-seam"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stat-card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="text-secondary mb-2">В наличии</p>
                    <h3 className="fw-bold text-success mb-0">
                      {availableProducts}
                    </h3>
                  </div>
                  <div className="stat-icon bg-success-subtle text-success">
                    <i className="bi bi-check-circle"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stat-card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="text-secondary mb-2">Нет в наличии</p>
                    <h3 className="fw-bold text-danger mb-0">
                      {unavailableProducts}
                    </h3>
                  </div>
                  <div className="stat-icon bg-danger-subtle text-danger">
                    <i className="bi bi-exclamation-circle"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stat-card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="text-secondary mb-2">Общее количество</p>
                    <h3 className="fw-bold mb-0">{totalQuantity}</h3>
                  </div>
                  <div className="stat-icon bg-warning-subtle text-warning">
                    <i className="bi bi-layers"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Основная таблица */}
        <div className="card border-0 shadow-sm inventory-card">
          <div className="card-body p-3 p-md-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
              <div>
                <h5 className="fw-bold mb-1">Список товаров</h5>
                <small className="text-secondary">
                  Контроль количества и статуса товаров
                </small>
              </div>

              <div className="search-box">
                <i className="bi bi-search text-secondary"></i>
                <input
                  type="text"
                  className="form-control border-0 shadow-none"
                  placeholder="Поиск товара..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Фильтры */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              <button
                className={`btn rounded-pill px-3 ${
                  filter === "all" ? "btn-primary" : "btn-light"
                }`}
                onClick={() => setFilter("all")}
              >
                Все товары
              </button>

              <button
                className={`btn rounded-pill px-3 ${
                  filter === "inStock" ? "btn-success" : "btn-light"
                }`}
                onClick={() => setFilter("inStock")}
              >
                <i className="bi bi-check-circle me-1"></i>В наличии
              </button>

              <button
                className={`btn rounded-pill px-3 ${
                  filter === "outOfStock" ? "btn-danger" : "btn-light"
                }`}
                onClick={() => setFilter("outOfStock")}
              >
                <i className="bi bi-x-circle me-1"></i>
                Нет в наличии
              </button>
            </div>

            {/* Таблица */}
            <div className="table-responsive">
              <table className="table inventory-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>ТОВАР</th>
                    <th>КОЛИЧЕСТВО</th>
                    <th>СТАТУС</th>
                    <th className="text-center">УПРАВЛЕНИЕ</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div className="spinner-border text-primary"></div>
                        <p className="text-secondary mt-2 mb-0">
                          Загрузка товаров...
                        </p>
                      </td>
                    </tr>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="product-image"
                            />
                            <div>
                              <div className="fw-semibold">{product.title}</div>
                              {/* <small className="text-secondary">
                                ID: #{product.id}
                              </small> */}
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="quantity-badge">
                            {product.quantity || 0} шт.
                          </span>
                        </td>

                        <td>
                          {product.inStock ? (
                            <span className="status-badge status-success">
                              <span className="status-dot"></span>В наличии
                            </span>
                          ) : (
                            <span className="status-badge status-danger">
                              <span className="status-dot"></span>
                              Нет в наличии
                            </span>
                          )}
                        </td>

                        <td>
                          <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                            <button
                              className="btn btn-sm btn-outline-success action-btn"
                              onClick={() => increase(product)}
                              title="Увеличить количество"
                            >
                              <i className="bi bi-plus-lg"></i>+
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger action-btn"
                              onClick={() => decrease(product)}
                              disabled={(Number(product.quantity) || 0) === 0}
                              title="Уменьшить количество"
                            >
                              <i className="bi bi-dash-lg"></i>-
                            </button>

                            <button
                              className="btn btn-sm btn-outline-primary rounded-3"
                              onClick={() => toggleStock(product)}
                            >
                              <i className="bi bi-arrow-repeat me-1"></i>
                              Изменить статус
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <i className="bi bi-inbox empty-icon"></i>
                        <h6 className="fw-semibold mt-3">Товары не найдены</h6>
                        <p className="text-secondary mb-0">
                          Попробуйте изменить поиск или фильтр
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Нижняя часть */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mt-4 gap-2">
              <span className="text-secondary small">
                Показано товаров:{" "}
                <strong className="text-dark">{filteredProducts.length}</strong>{" "}
                из {totalProducts}
              </span>

              <span className="text-secondary small">
                <i className="bi bi-database-check me-1 text-success"></i>
                Данные синхронизируются с сервером
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
