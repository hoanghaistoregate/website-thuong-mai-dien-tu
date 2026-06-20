import "./Sidebar.css";

// Định nghĩa menu với ID để cuộn tới
const menu = [
  {
    title: "PC Gamming New",
    children: [
      { name: "PC gaming", id: "PC-gaming" },
      { name: "PC văn phòng", id: "PC-van-phong" },
      { name: "PC đồ họa", id: "PC-do-hoa" },
    ],
  },
  {
    title: "LaTop Gamming ",
    children: [
      { name: "LapTop New", id: "LapTop-new" },
      { name: "LapTop Văn Phòng", id: "LapTop-van-phong" },
      { name: "LapTop Giá Ưu Đãi", id: "LapTop-gia-uu-dai" },
    ],
  },
  {
    title: "Linh Kiện Sản Phẩm ",
    children: [
      { name: "CARD ĐỒ HỌA", id: "card-section" },
      { name: "CPU - BỘ XỬ LÝ", id: "cpu-section" },
      { name: "MAINBOARD", id: "mainboard-section" },
      { name: "Ổ CỨNG HDD", id: "ssd-section" },
      { name: "PSU - NGUỒN", id: "gpu-section" },
      { name: "RAM - BỘ NHỚ TRONG", id: "ram-section" },
    ],
  },
  {
    title: "Dịch Vụ Sản Phẩm",
    children: [
      { name: "Dịch Vụ Mọi Nơi", id: "dich-vu" },
      { name: "Chi Tiết Liên Hệ", id: "chi-tiet" },
    ],
  },
];

const Sidebar = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {menu.map((item, index) => (
          <li key={index} className="sidebar-item">
            <span>{item.title}</span>
            <span className="arrow">›</span>
            <div className="submenu">
              {item.children.map((sub, i) => (
                <div
                  key={i}
                  className="submenu-item"
                  onClick={() => scrollToSection(sub.id)}
                >
                  {sub.name}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
