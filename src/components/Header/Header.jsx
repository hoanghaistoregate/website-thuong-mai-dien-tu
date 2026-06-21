import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoLogoDesignernews } from "react-icons/io";
import "./Header.css";
import { MdOutlineSupportAgent } from "react-icons/md";
import { MdDiscount } from "react-icons/md";
import { AiOutlineFileProtect } from "react-icons/ai";
import { FaShippingFast } from "react-icons/fa";
import { MdOutlineAddIcCall } from "react-icons/md";
import { PiShoppingCartDuotone } from "react-icons/pi";
import { IoSearch } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";

const Header = (props) => {
  // Trạng thái lưu tên modal đang mở (null, "HỖ TRỢ TRẢ GÓP", "GIÁ ƯU ĐÃI NHẤT", hoặc "HOTLINE")
  const [activeModal, setActiveModal] = useState(null);
  // Trạng thái mở/đóng menu thả xuống của Tài khoản
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  // GIẢ ĐỊNH TRẠNG THÁI ĐĂNG NHẬP (Bạn sẽ thay thế bằng logic Auth thực tế của bạn sau này)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // Giả định tài khoản là Admin
  // Trạng thái lưu thông tin form đăng ký (dành cho Trả góp / Ưu đãi)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  // Khóa cuộn trang khi có bất kỳ Modal nào mở
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeModal]);
  // Đóng menu tài khoản khi click ra ngoài tự do
  useEffect(() => {
    const handleCloseMenu = () => setShowAccountMenu(false);
    window.addEventListener("click", handleCloseMenu);
    return () => window.removeEventListener("click", handleCloseMenu);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Xác nhận yêu cầu [${activeModal}] thành công! Chúng tôi sẽ liên hệ lại sớm nhất.`,
    );
    setFormData({ fullName: "", email: "", phone: "", message: "" });
    setActiveModal(null);
  };

  const getPlaceholderMessage = () => {
    if (activeModal === "HỖ TRỢ TRẢ GÓP") {
      return "Nhập sản phẩm bạn muốn mua trả góp hoặc số tiền dự định trả trước...";
    }
    if (activeModal === "GIÁ ƯU ĐÃI NHẤT") {
      return "Nhập sản phẩm bạn đang quan tâm để nhận báo giá chiết khấu tốt nhất...";
    }
    return "Nhập lời nhắn của bạn...";
  };

  // Hàm xử lý Đăng xuất giả định
  const handleLogout = () => {
    setIsLoggedIn(false);
    alert("Đã đăng xuất thành công!");
  };

  return (
    <header className="header">
      {/* Header - top */}
      <div className="container">
        <div className="header-top">
          <div className="header-logo">
            <Link to="/">
              <IoLogoDesignernews style={{ cursor: "pointer" }} />
            </Link>
          </div>
          <nav className="header-nav">
            <ul className="header-menu">
              <li
                className="header-item clickable-item"
                onClick={() => setActiveModal("HỖ TRỢ TRẢ GÓP")}
              >
                <MdOutlineSupportAgent />
                Hỗ Trợ Trả Góp
              </li>
              <li
                className="header-item clickable-item"
                onClick={() => setActiveModal("GIÁ ƯU ĐÃI NHẤT")}
              >
                <MdDiscount />
                Giá Ưu Đãi Nhất
              </li>
              <li className="header-item">
                <AiOutlineFileProtect />
                Bảo Hành Tận Nhà
              </li>
              <li className="header-item">
                <FaShippingFast />
                Miễn Phí Vận Chuyển
              </li>
              {/* KÍCH HOẠT SỰ KIỆN CLICK CHO HOTLINE */}
              <li
                className="header-item clickable-item"
                onClick={() => setActiveModal("HOTLINE")}
              >
                <MdOutlineAddIcCall />
                HOTLINE
              </li>
              <li className="header-item">
                <PiShoppingCartDuotone />
                Giỏ Hàng
              </li>

              {/* PHẦN THÊM MỚI: TÀI KHOẢN DROPDOWN */}
              <li
                className="header-item clickable-item account-dropdown-wrapper"
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài làm đóng menu ngay lập tức
                  setShowAccountMenu(!showAccountMenu);
                }}
              >
                <VscAccount />
                <span>Tài khoản</span>

                {/* Menu con hiển thị khi click vào */}
                {showAccountMenu && (
                  <ul className="account-dropdown-menu">
                    {!isLoggedIn ? (
                      <>
                        <li>
                          <Link to="/login">Đăng nhập</Link>
                        </li>
                        <li>
                          <Link to="/Register">Đăng ký</Link>
                        </li>
                      </>
                    ) : (
                      <>
                        {isAdmin && (
                          <li>
                            <Link to="/admin">Trang Admin</Link>
                          </li>
                        )}
                        <li>
                          <Link to="/profile">Thông tin cá nhân</Link>
                        </li>
                        <li onClick={handleLogout} className="logout-item">
                          Đăng xuất
                        </li>
                      </>
                    )}
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </div>

        {/* Header - Bottom */}
        <div className="header-bottom">
          <div
            className="container"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              width: "100%",
            }}
          >
            <button className="category-btn">Danh Mục Sản Phẩm</button>
            <div className="search-box">
              <select className="category-select">
                <option>Danh Mục</option>
                <option>Laptop</option>
                <option>PC</option>
                <option>Con Chuột</option>
              </select>
              <input
                className="search-input"
                type="text"
                placeholder="Bạn cần tìm gì..."
              />
              <button className="search-btn" type="submit">
                <IoSearch />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GIAO DIỆN HIỂN THỊ CÁC MODAL */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div
            className="modal-content-custom"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ... Nội dung modal giữ nguyên như cũ của bạn ... */}
            <div
              className={`modal-header-blue ${activeModal === "HOTLINE" ? "bg-red" : ""}`}
            >
              <h3 className="modal-title-white">
                {activeModal === "HOTLINE"
                  ? "LIÊN HỆ KHẨN CẤP"
                  : "LIÊN HỆ VỚI CHÚNG TÔI"}
              </h3>
              <button
                className="modal-close-btn-white"
                onClick={() => setActiveModal(null)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body-content">
              {activeModal === "HOTLINE" ? (
                <>
                  <p className="modal-subtitle">
                    Vui lòng gọi trực tiếp cho các tổng đài viên dưới đây để
                    được xử lý sự cố lập tức!
                  </p>
                  <div className="hotline-list">
                    <div className="hotline-card">
                      <div className="hotline-info">
                        <span className="hotline-name">Quách Hoàng Hải</span>
                        <span className="hotline-role">
                          Hỗ trợ kỹ thuật phần cứng
                        </span>
                      </div>
                      <a href="tel:0911108133" className="hotline-call-btn">
                        0911.108.133
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="modal-subtitle">
                    <span className="highlight-text">{activeModal}</span>. Vui
                    lòng để lại thông tin cá nhân dưới đây!
                  </p>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Họ và tên *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="example@gmail.com"
                      />
                    </div>
                    <div className="form-group">
                      <label>Số điện thoại *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    <div className="form-group">
                      <label>Nội dung chi tiết</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder={getPlaceholderMessage()}
                      ></textarea>
                    </div>
                    <button type="submit" className="modal-submit-btn">
                      Xác nhận
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
