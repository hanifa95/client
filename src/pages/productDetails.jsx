import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`https://6a2fc982a7f8866418d5125a.mockapi.io/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((error) => {
        console.log(error);
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (!product) {
    return <p>Заказ не найден</p>;
  }

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-5">Product Details</h2>

      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="row g-0">
          {/* Product Image */}
          <div className="col-md-6 bg-light d-flex align-items-center justify-content-center p-4">
            <img
              src={product.image}
              alt={product.category}
              className="img-fluid rounded-3"
              style={{
                maxHeight: "450px",
                width: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Product Information */}
          <div className="col-md-6">
            <div className="card-body p-4 p-lg-5">
              <span className="badge bg-primary mb-3 px-3 py-2">
                {product.category}
              </span>

              <h2 className="fw-bold mb-3">{product.category}</h2>

              <h3 className="text-success fw-bold mb-4">{product.price} Som</h3>

              <hr />

              <h5 className="fw-bold mb-3">Product Information</h5>

              <p className="text-secondary lh-lg">{product.description}</p>

              <div className="bg-light rounded-3 p-3 mb-4">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Weight:</span>
                  <strong>
                    {product.weight} {product.measurement}
                  </strong>
                </div>
              </div>

              <a href="/products">
                <button className="btn btn-primary btn-lg w-100 rounded-3">
                  <i className="bi bi-cart-plus me-2"></i>
                  Products
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
