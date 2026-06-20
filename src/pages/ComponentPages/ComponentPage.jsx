import { useEffect, useState } from "react";
import { useParams, Link, Links } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/FooterUser";
import "./ComponentPage.css";
import { FaShippingFast, FaAddressCard, FaCcApplePay } from "react-icons/fa";
import { MdCurrencyExchange } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
// import { TiTickOutline } from "react-icons/ti";
import { FaGift } from "react-icons/fa6";
import InstallmentModal from "../../pages/InstallmentModal";
import SpecsModal from "../../pages/SpecsModal";
import Sevicer from "../../components/Sevicer/Sevicer";
import { getImageUrl } from "../../utils/imageUtils";

const ComponentPage = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // Danh sách 5 sản phẩm ngẫu nhiên
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  useEffect(() => {
    setLoading(true);

    // 1. Tìm thông tin chi tiết sản phẩm đang click xem
    fetch(`http://localhost:3000/eventList/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy laptop");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        console.error(err);
        setProduct(null);
      });

    // 2. Lấy dữ liệu từ bảng catenogies để làm sản phẩm tương tự
    Promise.all([
      fetch("http://localhost:3000/eventList").then((res) =>
        res.json().catch(() => []),
      ),
    ])
      .then(([laptopData]) => {
        const allProducts = [...laptopData];
        const industryProducts = allProducts.filter(
          (item) => String(item.id) !== String(id),
        );
        const shuffled = [...industryProducts].sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffled.slice(0, 5));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy sản phẩm ngẫu nhiên:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <div className="loading-box">Đang tải thông tin sản phẩm...</div>;
  if (!product)
    return <div className="loading-box">Không tìm thấy sản phẩm này!</div>;

  return (
    <div className="product-detail-page">
      <Header />

      {/* 1. Thanh điều hướng */}
      <div className="bread-bar">
        <div className="inner-bread">
          <Link to="/">
            <span>Trang chủ </span>
          </Link>
          <Link to="/">
            <span>Linh Kiện</span>
          </Link>
        </div>
      </div>

      {/* 2. Khung nội dung chi tiết */}
      <main className="product-detail-container">
        <h1 className="product-main-title">{product.name}</h1>

        <div className="product-detail-layout">
          <div className="detail-left-gallery">
            <div className="main-image-wrapper">
              <img
                src={getImageUrl(product?.image)}
                alt={product?.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getImageUrl(undefined);
                }}
              />
            </div>
          </div>

          <div className="detail-center-info">
            <div className="upgrade-options-box">
              <label>
                <input type="radio" name="vga" defaultChecked /> NÂNG CẤP LÊN
                VGA RTX 3060 CŨ + 2.400.000đ
              </label>
              <label>
                <input type="radio" name="vga" /> NÂNG CẤP LÊN VGA RTX 3060TI CŨ
                + 3.400.000đ
              </label>
              <label>
                <input type="radio" name="vga" /> NÂNG CẤP LÊN VGA RTX 3070TI CŨ
                + 7.900.000đ
              </label>
            </div>

            <div className="price-display-section">
              <span className="old-price">
                {(product.price * 1.06).toLocaleString("vi-VN")}đ
              </span>
              <span className="live-price">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
            </div>

            <div className="gift-bonus-box">
              <div className="gift-title">
                <span className="gift-icons">
                  <FaGift />
                </span>
                Quà tặng / Khuyến mãi
              </div>
              <ul className="gift-list">
                <li>
                  <strong>CHUỘT GAMING DAREU EM908 USB LED RGB GIÁ 350K</strong>
                </li>
                <li>BÀN PHÍM GAMING DAREU EK810 USB LED GIÁ 690K</li>
                <li>TAI NGHE GAMING DAREU EH469 USB LED RGB GIÁ 450K</li>
                <li>LÓT CHUỘT DAREU ESP109 FULL SIZE 90X40 GIÁ 160K</li>
              </ul>
            </div>

            <div className="purchase-actions-group">
              <button className="btn-add-to-cart-big">
                <strong>THÊM VÀO GIỎ HÀNG</strong>
                <span>THÊM VÀO GIỎ ĐỂ CHỌN TIẾP</span>
              </button>

              <div className="sub-buy-buttons-row">
                <button className="btn-buy-now-split">
                  <strong>MUA NGAY</strong>
                  <span>Giao tận nơi hoặc trực tiếp</span>
                </button>

                <button
                  className="btn-installment-split"
                  onClick={() => setIsModalOpen(true)}
                >
                  <strong>MUA TRẢ GÓP</strong>
                  <span>Thủ tục đơn giản, xét duyệt nhanh</span>
                </button>
              </div>
            </div>
          </div>

          <div className="detail-right-policies">
            <h3>CHÍNH SÁCH KHÁCH HÀNG</h3>
            <div className="policy-item-row">
              <span className="policy-icon-blue">
                <FaShippingFast />
              </span>
              <p>Giao hàng miễn phí (chỉ áp dụng khu vực nội thành)</p>
            </div>
            <div className="policy-item-row">
              <span className="policy-icon-blue">
                <FaAddressCard />
              </span>
              <p>
                Hỗ trợ trả góp lãi suất thấp cho các sản phẩm thông qua các đơn
                vị tài chính
              </p>
            </div>
            <div className="policy-item-row">
              <span className="policy-icon-blue">
                <FaCcApplePay />
              </span>
              <p>
                Trả góp lãi suất 0% qua thẻ tín dụng Visa, Master, JCB (áp dụng
                một số mặt hàng nhất định)
              </p>
            </div>
            <div className="policy-item-row">
              <span className="policy-icon-blue">
                <MdCurrencyExchange />
              </span>
              <p>Đổi mới trong vòng 7 ngày nếu lỗi do Nhà Sản Xuất</p>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Khối Mô tả & Thông số chi tiết */}
      <div className="product-description-section">
        <div className="description-layout-container">
          <div className="description-left-content">
            <div className="tab-header-title">
              <h2>MÔ TẢ</h2>
            </div>
            <div className="main-specs-body">
              <h3>THÔNG SỐ CHI TIẾT MÁY :</h3>
              <p className="review-text">
                Đánh giá máy :{" "}
                <strong>
                  Hỗ trợ tốt trong công việc đồ họa , sử dụng games online
                  offline rất tốt với cấu hình high setting
                </strong>
              </p>

              <table className="specs-table-detail">
                {/* Đã ép sát toàn bộ các cặp thẻ <tr><td> liền kề trên cùng 1 dòng nhằm triệt tiêu hoàn toàn khoảng trắng thừa sinh Hydration Error */}
                <tbody>
                  {product.name &&
                  (product.name.includes("I5 12400F") ||
                    product.name.includes("MSI FORGE")) ? (
                    <>
                      <tr>
                        <td>
                          <strong>MAIN</strong>
                        </td>
                        <td className="blue-text-link">ASROCK B660M PRO RS</td>
                        <td>36TH</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>CPU</strong>
                        </td>
                        <td>I5 12400F TRAY</td>
                        <td>36TH</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>RAM</strong>
                        </td>
                        <td className="blue-text-link">
                          16G DDR4 3200 ( 16GX1 )
                        </td>
                        <td>36TH</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>SSD</strong>
                        </td>
                        <td>256G M2 NVME</td>
                        <td>36TH</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>VGA</strong>
                        </td>
                        <td className="blue-text-link">
                          GEFORCE RTX 2060 6G DDR6
                        </td>
                        <td>3TH</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <td>
                          <strong>THIẾT BỊ</strong>
                        </td>
                        <td>{product?.name || "Thiết bị chính hãng"}</td>
                        <td>12TH</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>MÀN HÌNH</strong>
                        </td>
                        <td>Độ phân giải tiêu chuẩn cao</td>
                        <td>12TH</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>CẤU HÌNH</strong>
                        </td>
                        <td className="blue-text-link">
                          Xem chi tiết ở mục thông số kỹ thuật
                        </td>
                        <td>36TH</td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td>
                      <strong>PHỤ KIỆN</strong>
                    </td>
                    <td className="blue-text-link">
                      Dây nguồn tiêu chuẩn kèm theo vỏ hộp
                    </td>
                    <td>12TH</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="description-right-sidebar">
            <div className="widget-spec-box">
              <h3>Thông số kỹ thuật</h3>
              <div className="mini-table-container">
                <table className="mini-specs-table">
                  <thead>
                    <tr>
                      <th>LINH KIỆN</th>
                      <th>SẢN PHẨM</th>
                      <th>BẢO HÀNH</th>
                    </tr>
                  </thead>
                  {/* Ép sát dòng dữ liệu bảng phụ */}
                  <tbody>
                    {product.name &&
                    (product.name.includes("I5 12400F") ||
                      product.name.includes("MSI FORGE")) ? (
                      <>
                        <tr>
                          <td>MAIN</td>
                          <td className="blue-text-link">
                            ASROCK B660M PRO RS
                          </td>
                          <td>36TH</td>
                        </tr>
                        <tr>
                          <td>CPU</td>
                          <td>I5 12400F TRAY</td>
                          <td>36TH</td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr>
                          <td>THIẾT BỊ</td>
                          <td>Theo máy</td>
                          <td>12TH</td>
                        </tr>
                        <tr>
                          <td>CẤU HÌNH</td>
                          <td>Theo thông số chung</td>
                          <td>36TH</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              <button
                className="btn-view-all-specs"
                onClick={() => setIsSpecsOpen(true)}
              >
                Xem đầy đủ thông số kỹ thuật
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Khối SẢN PHẨM TƯƠNG TỰ */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="related-inner-container">
            <h2 className="related-section-title">SẢN PHẨM TƯƠNG TỰ</h2>
            <div className="related-products-grid">
              {relatedProducts.map((item, index) => (
                <Link
                  to={`/component/${item.id}`}
                  key={`${item.id}-${index}`}
                  className="related-card-link"
                >
                  <div className="related-product-card">
                    <div className="related-card-img-wrapper">
                      <img
                        src={getImageUrl(item?.image)}
                        alt={item?.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getImageUrl(undefined);
                        }}
                      />
                    </div>
                    <div className="related-card-info-content">
                      <h4>{item.name}</h4>
                      <div className="related-price-row">
                        <span className="related-price-current">
                          {item.price.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="related-price-old">
                          {(item.price * 1.15).toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                      <div className="related-status-stock">
                        <span>Xem Chi Tiết</span>
                      </div>
                      <button
                        className="btn-quick-cart-circle"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <AiOutlineShoppingCart />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <InstallmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
      <SpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
        product={product}
      />
      <Sevicer />
      <Footer />
    </div>
  );
};

export default ComponentPage;
