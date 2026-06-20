import "./EventList.css";
// ✅ 1. Sửa dòng import: Xóa ProductGrid đi, thay bằng ComponentCard chuyên biệt cho linh kiện
import ComponentCard from "../ProductCard/ComponentCard";

const EventList = ({ eventList }) => {
  const tabs = [
    "CARD ĐỒ HỌA",
    "CPU - BỘ XỬ LÝ",
    "MAINBOARD",
    "Ổ CỨNG HDD",
    "PSU - NGUỒN",
    "RAM - BỘ NHỚ TRONG",
  ];

  return (
    <section className="event-list">
      <div className="event-header">
        <h2>Linh Kiện</h2>

        <nav className="event-tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`event-tab ${index === 0 ? "active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div
        className="component-grid-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {eventList && eventList.length > 0 ? (
          eventList.map((item) => (
            <ComponentCard key={item.id} product={item} />
          ))
        ) : (
          <p>Đang tải danh sách linh kiện...</p>
        )}
      </div>
    </section>
  );
};

export default EventList;
