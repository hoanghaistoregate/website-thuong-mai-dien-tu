import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import FooterUser from "../../components/Footer/FooterUser";
import "./ProductPage.css";
import Sevicer from "../../components/Sevicer/Sevicer";

const ProductPage = () => {
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/ProductPagies")
      .then((res) => res.json())
      .then((data) => setProductsList(data));
  }, []);

  return (
    <div className="product-page">
      <Header />

      {/* 1. Thanh điều hướng */}
      <div className="bread-bar">
        <div className="inner-bread">
          <Link to="/">
            <span>Trang chủ </span>
          </Link>
          <Link to="/">
            <span>Máy tính </span>
          </Link>
          <Link to="/menu/1">
            <span>Phần Đặc Biệt </span>
          </Link>
        </div>
      </div>

      {/* 2. Lưới sản phẩm */}
      <div className="product-list-container">
        <div className="product-grid-1">
          {productsList.map((item) => (
            <div
              key={item.id}
              className="product-card-1"
              // CHUYỂN HƯỚNG SANG PRODUCT MENU KHI CLICK VÀO SẢN PHẨM
              onClick={() => navigate(`/menu/${item.id}`)}
            >
              <div className="img-wrapper">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="card-content">
                <h4 className="card-name">{item.name}</h4>
                <p className="card-price">
                  {Number(item.price || 0).toLocaleString()}đ
                </p>
                <div className="promo-tags">Trả góp 0%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Sevicer />

      <FooterUser />
    </div>
  );
};

export default ProductPage;
