import "./LaptopUser.css";
import LaptopCard from "../ProductCard/LaptopCard"; // Đã import rất chuẩn

const LaptopUser = ({ laptopData }) => {
  const char = ["LAPTOP CŨ", "LAPTOP GAMING", "LAPTOP MỚI", "LAPTOP ĐỒ HỌA"];

  return (
    <section className="laptop-menu">
      <div className="laptop-list">
        <h2>LAPTOP</h2>

        <nav className="laptop-container">
          {char.map((item, index) => (
            <button
              key={index}
              className={`laptop-char ${index === 0 ? "active" : ""}`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* ✅ SỬA ĐOẠN NÀY: Thay <ProductGrid /> bằng vòng lặp map trực tiếp LaptopCard */}
      <div
        className="laptop-grid-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {laptopData && laptopData.length > 0 ? (
          laptopData.map((item) => <LaptopCard key={item.id} product={item} />)
        ) : (
          <p>Đang tải danh sách laptop...</p>
        )}
      </div>
    </section>
  );
};

export default LaptopUser;
