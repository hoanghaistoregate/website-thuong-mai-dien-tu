import { useState, useEffect } from "react";
import "./Sevicer.css";
import {
  MdLocalShipping,
  MdCached,
  MdSupportAgent,
  MdCreditCard,
} from "react-icons/md";

const Sevicer = () => {
  // Thay đổi: Lưu tiêu đề dịch vụ đang chọn (null tức là đang đóng modal)
  const [activeService, setActiveService] = useState(null);

  // Trạng thái lưu thông tin form
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  // Mảng danh sách dịch vụ (đã thêm placeholder riêng cho từng thằng)
  const services = [
    {
      icon: <MdLocalShipping />,
      title: "GIAO HÀNG MIỄN PHÍ",
      desc: "Cho mọi đơn hàng từ 2 triệu",
      placeholder: "Nhập địa chỉ nhận hàng của bạn...",
    },
    {
      icon: <MdCached />,
      title: "ĐỔI TRẢ DỄ DÀNG",
      desc: "Trong vòng 7 ngày đầu tiên nếu lỗi",
      placeholder: "Nhập tên sản phẩm cần đổi trả và lý do lỗi...",
    },
    {
      icon: <MdSupportAgent />,
      title: "HỖ TRỢ TRỰC TUYẾN 24/7",
      desc: "Giải đáp mọi thắc mắc của bạn",
      placeholder: "Nhập câu hỏi hoặc vấn đề bạn đang cần tư vấn gấp...",
    },
    {
      icon: <MdCreditCard />,
      title: "TRẢ GÓP LÃI SUẤT 0%",
      desc: "Thủ tục nhanh chóng trong 5 phút",
      placeholder:
        "Nhập sản phẩm bạn muốn trả góp (ví dụ: PC Gaming, Laptop...)",
    },
  ];

  // Xử lý khi thay đổi dữ liệu trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý khi bấm nút Xác nhận gửi form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Thay đổi: Gửi kèm tên dịch vụ khách hàng đang chọn
    console.log(`Thông tin khách hàng đăng ký [${activeService}]:`, formData);
    alert(
      `Xác nhận yêu cầu [${activeService}] thành công! Chúng tôi sẽ liên hệ lại sớm nhất.`,
    );

    // Reset form và đóng modal
    setFormData({ fullName: "", email: "", phone: "", message: "" });
    setActiveService(null);
  };

  // Khóa hoặc mở cuộn trang dựa trên activeService
  useEffect(() => {
    if (activeService) {
      document.body.style.overflow = "hidden"; // Khóa cuộn trang
    } else {
      document.body.style.overflow = "unset"; // Mở cuộn trang bình thường
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeService]);

  // Tìm đối tượng dịch vụ hiện tại để lấy placeholder tương ứng
  const currentService = services.find((s) => s.title === activeService);

  return (
    <section className="sevicer-section">
      <div className="service-container">
        {services.map((ser, index) => (
          <div
            // Thay đổi: Tất cả dịch vụ giờ đều có class 'clickable' và nhấn được
            className="service-item clickable"
            key={index}
            onClick={() => setActiveService(ser.title)}
          >
            <div className="service-icon">{ser.icon}</div>
            <div className="service-info">
              <h5>{ser.title}</h5>
              <p>{ser.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cấu trúc của MODAL POPUP DÙNG CHUNG */}
      {activeService && (
        <div className="modal-overlay" onClick={() => setActiveService(null)}>
          <div className="modal-contents" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setActiveService(null)}
            >
              &times;
            </button>

            {/* Thay đổi: Tiêu đề tự động nhảy theo dịch vụ được chọn */}
            <h3>{activeService}</h3>
            <p className="modal-subtitle">
              Vui Lòng Nhập Thông Tin Của Bạn Để Được Ưu Đãi Nhé
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
                <label>Lời nhắn / Chi tiết yêu cầu</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="3"
                  // Thay đổi: Placeholder tự động đổi thông minh theo dịch vụ
                  placeholder={
                    currentService?.placeholder || "Nhập lời nhắn của bạn..."
                  }
                ></textarea>
              </div>

              <button type="submit" className="modal-submit-btn">
                Xác nhận
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Sevicer;
