import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import InstallmentModal from "./InstallmentModal";
import Header from "../components/Header/Header";
import FooterUser from "../components/Footer/FooterUser";
import Sevicer from "../components/Sevicer/Sevicer";
import { FaShippingFast, FaAddressCard, FaCcApplePay } from "react-icons/fa";
import { MdCurrencyExchange } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { FaRocketchat } from "react-icons/fa6";
import { FcShipped } from "react-icons/fc";

import "./ProductMenu.css";

const ProductMenu = () => {
  const { id } = useParams();
  const [showInstallment, setShowInstallment] = useState(false);

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    setLoading(true);

    fetch("http://localhost:3000/ProductMenus")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);

        const found = data.find((item) => String(item.id) === String(id));

        setProduct(found || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi fetch API:", err);
        setLoading(false);
      });
  }, [id]);

  // ================= SCROLL LOCK =================
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  // ================= LOADING =================
  if (loading) {
    return (
      <>
        <Header />
        <div style={{ padding: 40, textAlign: "center" }}>
          <h2>Đang tải dữ liệu...</h2>
        </div>
        <FooterUser />
      </>
    );
  }

  // ================= NOT FOUND =================
  if (!product) {
    return (
      <>
        <Header />
        <div style={{ padding: 40, textAlign: "center" }}>
          <h2>Không tìm thấy sản phẩm</h2>
        </div>
        <FooterUser />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bread-bar">
        <div className="inner-bread">
          <Link to="/">
            <span>Trang chủ </span>
          </Link>
          <Link to="/">
            <span>Máy tính mới</span>
          </Link>
          <Link to="/page/:id">
            <span>Sản Phẩm Mới</span>
          </Link>
        </div>
      </div>

      <div className="product-menu-page">
        <div className="container">
          <div className="product-wrapper">
            {/* ================= LEFT ================= */}
            <div className="product-detail">
              <div className="product-left">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="spec-box">
                  <h3>THÔNG SỐ KỸ THUẬT</h3>

                  {product.specs &&
                    Object.entries(product.specs).map(([key, value]) => (
                      <div className="spec-row" key={key}>
                        <span>{key}</span>
                        <span>{value}</span>
                      </div>
                    ))}
                </div>

                <div className="support-sidebar-box">
                  <h4>Hỗ trợ mua hàng</h4>
                  <div className="support-item">
                    <span className="icon">
                      <IoCall />
                    </span>
                    <p>
                      Tổng đài tư vấn: <strong>1900.1515</strong>
                    </p>
                  </div>
                  <div className="support-item">
                    <span className="icon">
                      <FaRocketchat />
                    </span>
                    <p>Chat trực tuyến với nhân viên hỗ trợ</p>
                  </div>
                  <div className="support-item">
                    <span className="icon">
                      <FcShipped />
                    </span>
                    <p>Giao hàng miễn phí nội thành 2h</p>
                  </div>
                  <button className="btn-zalo-contact">Gọi Ngay</button>
                </div>
              </div>

              {/* ================= CENTER ================= */}
              <div className="product-center">
                <h1>{product.name}</h1>

                <div className="product-meta">
                  <span>
                    <b>Thương hiệu:</b> {product.brand}
                  </span>
                  <span>
                    <b>Danh mục:</b> {product.category}
                  </span>
                  <span>
                    <b>Tình trạng:</b> {product.status}
                  </span>
                </div>

                <div className="price-box">
                  <span className="price">
                    {product.price?.toLocaleString()}đ
                  </span>

                  <span className="old-price">
                    {product.oldPrice?.toLocaleString()}đ
                  </span>
                </div>

                <div className="promotion-box">
                  <h3>🎁 Khuyến mãi</h3>
                  <ul>
                    {product.promotions?.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                {/* ACTION */}
                <div className="purchase-actions-groups">
                  <button className="btn-add-to-cart-bits">
                    THÊM VÀO GIỎ HÀNG
                  </button>

                  <div className="sub-buy-buttons-rows">
                    <button className="btn-buy-now-splits">MUA NGAY</button>

                    <button
                      className="btn-installment-splits"
                      onClick={() => setShowInstallment(true)}
                    >
                      TRẢ GÓP
                    </button>
                  </div>
                </div>

                <button
                  className="btn-show-description"
                  onClick={() => setShowModal(true)}
                >
                  Xem chi tiết
                </button>
              </div>

              {/* ================= RIGHT ================= */}
              <div className="detail-right-policie">
                <h3>CHÍNH SÁCH</h3>

                <div className="policy-item-rows">
                  <FaShippingFast /> Giao hàng nhanh
                </div>

                <div className="policy-item-rows">
                  <FaAddressCard /> Trả góp
                </div>

                <div className="policy-item-rows">
                  <FaCcApplePay /> Thanh toán
                </div>

                <div className="policy-item-rows">
                  <MdCurrencyExchange /> Đổi trả 7 ngày
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {(showModal || showInstallment) && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowModal(false)}>
              ×
            </button>

            <h2>{product.description?.title}</h2>

            {product.description?.content?.map((s, i) => (
              <div key={i}>
                <h3>{s.heading}</h3>
                <p>{s.text}</p>
                {s.image && <img src={s.image} alt="" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= RELATED ================= */}
      <section className="related-products">
        <h2>SẢN PHẨM LIÊN QUAN</h2>

        <div className="related-grid">
          {products
            .filter((p) => p.id !== product.id)
            .slice(0, 5)
            .map((item) => (
              <div key={item.id} className="related-card">
                <img src={item.image} alt={item.name} />
                <h4>{item.name}</h4>

                <p>{item.price?.toLocaleString()}đ</p>

                <Link to={`/menu/${item.id}`}>Xem chi tiết</Link>
              </div>
            ))}
        </div>
      </section>
      {product && (
        <InstallmentModal
          isOpen={showInstallment}
          onClose={() => setShowInstallment(false)}
          product={product}
        />
      )}

      <Sevicer />
      <FooterUser />
    </>
  );
};

export default ProductMenu;
