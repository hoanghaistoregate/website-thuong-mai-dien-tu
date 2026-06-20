import "./Catenogy.css";
import { AiFillCheckCircle } from "react-icons/ai";
import { PiShoppingCartDuotone } from "react-icons/pi";
import { Link } from "react-router-dom";

const Catenogy = ({ catenogies }) => {
  const displayItems = catenogies || [];

  const items = [
    "TOP PC BÁN CHẠY",
    "TOP PC CỰC KHỦNG",
    "GIẢI NHIỆT PC",
    "MÀN HÌNH ĐỒ HOẠ",
  ];

  return (
    <div className="catenogy-section">
      <div className="catenogy-container">
        {/* Thanh tab */}
        <div className="catenogy-tabs-bar">
          <nav className="catenogy-nav">
            {items.map((tab, index) => (
              <span
                key={index}
                className={`catenogy-item ${index === 0 ? "active" : ""}`}
              >
                {tab}
              </span>
            ))}
          </nav>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="catenogy-menu">
          {displayItems.map((item) => (
            <Link
              to={`/product/${item.id}`}
              className="catenogy-link"
              key={item.id}
            >
              <div className="catenogy-card">
                {item.discount && (
                  <div className="badge-sale">-{item.discount}%</div>
                )}

                <div className="catenogy-card-img">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="catenogy-card-info">
                  <h4>{item.name}</h4>

                  <p className="sta-stock">
                    <AiFillCheckCircle className="icon-stock" />
                    {item.status || "Còn hàng"}
                  </p>

                  <div className="price-nav">
                    <div className="price-bar">
                      <span className="container-price">
                        {item.price ? item.price.toLocaleString() : 0} đ
                      </span>

                      {item.oldPrice && (
                        <span className="right-price">
                          {item.oldPrice.toLocaleString()} đ
                        </span>
                      )}
                    </div>

                    <button className="cart-btn-circle" title="Thêm vào giỏ">
                      <PiShoppingCartDuotone />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catenogy;
