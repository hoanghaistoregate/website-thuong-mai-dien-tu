import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillCheckCircle } from "react-icons/ai";
import { PiShoppingCartDuotone } from "react-icons/pi";
import { toast } from "sonner";
import Header from "../../components/Header/Header";
import FooterUser from "../../components/Footer/FooterUser";
import "./FlashSalePage.css";

const FILTER_TABS = [
  { label: "Tất cả", value: "all" },
  { label: "Card đồ họa", value: "vga" },
  { label: "CPU", value: "cpu" },
  { label: "Laptop", value: "laptop" },
  { label: "RAM", value: "ram" },
  { label: "PSU - Nguồn", value: "psu" },
  { label: "Mainboard", value: "mainboard" },
];

const SORT_OPTIONS = [
  { label: "Mặc định", value: "default" },
  { label: "Giảm giá nhiều nhất", value: "discount-desc" },
  { label: "Giá thấp → cao", value: "price-asc" },
  { label: "Giá cao → thấp", value: "price-desc" },
];

const FlashSalePage = () => {
  const navigate = useNavigate();

  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sort, setSort] = useState("default");

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = sessionStorage.getItem("flashSaleEnd");
    if (saved) {
      const diff = Math.floor((Number(saved) - Date.now()) / 1000);
      return diff > 0 ? diff : 0;
    }
    const duration = 12 * 3600 + 45 * 60 + 30;
    sessionStorage.setItem("flashSaleEnd", Date.now() + duration * 1000);
    return duration;
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          sessionStorage.removeItem("flashSaleEnd");
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  useEffect(() => {
    setLoading(true);
    // Lấy tất cả sản phẩm có discount từ cả 2 nguồn
    Promise.all([
      fetch("http://localhost:3000/LaptopUser").then((r) => r.json()),
      fetch("http://localhost:3000/eventList").then((r) => r.json()),
    ])
      .then(([LaptopUser, eventList]) => {
        const all = [...LaptopUser, ...eventList];
        // Chỉ lấy sản phẩm có field discount > 0
        const saleItems = all.filter(
          (item) => item.discount && item.discount > 0,
        );
        setAllItems(Array.isArray(saleItems) ? saleItems : []);
      })
      .catch((err) => {
        console.error("Lỗi tải Flash Sale:", err);
        setAllItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate("/login");
      return;
    }
    toast.success(`Đã thêm "${item.name}" vào giỏ hàng!`);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const filtered =
    activeFilter === "all"
      ? allItems
      : allItems.filter((item) => item.category === activeFilter);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "discount-desc") return (b.discount || 0) - (a.discount || 0);
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  // Tính % thanh stock: nếu data không có soldCount thì mock ngẫu nhiên cố định theo id
  const getSoldPercent = (item) => {
    if (item.soldPercent) return item.soldPercent;
    // Dùng id để tạo số giả ổn định (không đổi mỗi render)
    const seed = item.id ? String(item.id).charCodeAt(0) : 50;
    return ((seed * 37) % 80) + 10;
  };

  const getStockLeft = (item) => {
    if (item.stockLeft) return item.stockLeft;
    const seed = item.id ? String(item.id).charCodeAt(0) : 20;
    return ((seed * 13) % 40) + 2;
  };

  return (
    <>
      <Header />
      <div className="fsp-page">
        {/* HERO */}
        <div className="fsp-hero">
          <div className="fsp-hero__glow" />
          <div className="fsp-hero__glow2" />
          <div className="fsp-hero__inner">
            <div className="fsp-hero__left">
              <div className="fsp-hero__eyebrow">
                <span className="fsp-badge">⚡ FLASH SALE</span>
                <span className="fsp-live">
                  <span className="fsp-live__dot" />
                  Đang diễn ra
                </span>
              </div>
              <h1 className="fsp-hero__title">
                Ưu đãi <span>chớp nhoáng</span>
                <br />
                Giá tốt mỗi ngày
              </h1>
              <p className="fsp-hero__sub">
                Số lượng có hạn · Kết thúc khi hết hàng
              </p>
            </div>
            <div className="fsp-hero__right">
              <div className="fsp-countdown">
                {[
                  { val: hours, label: "GIỜ" },
                  { val: minutes, label: "PHÚT" },
                  { val: seconds, label: "GIÂY" },
                ].map((unit, i) => (
                  <>
                    {i > 0 && (
                      <span key={`sep-${i}`} className="fsp-cd-sep">
                        :
                      </span>
                    )}
                    <div key={unit.label} className="fsp-cd-unit">
                      <div className="fsp-cd-box">
                        <div className="fsp-cd-num">{unit.val}</div>
                      </div>
                      <span className="fsp-cd-label">{unit.label}</span>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="fsp-filter-wrap">
          <div className="fsp-filter">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                className={`fsp-filter-btn ${activeFilter === tab.value ? "active" : ""}`}
                onClick={() => setActiveFilter(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="fsp-stats-wrap">
          <div className="fsp-stats">
            <div className="fsp-stat">
              <div className="fsp-stat__num">{allItems.length}+</div>
              <div className="fsp-stat__label">Sản phẩm sale</div>
            </div>
            <div className="fsp-stat">
              <div className="fsp-stat__num">Đến 50%</div>
              <div className="fsp-stat__label">Giảm tối đa</div>
            </div>
            <div className="fsp-stat">
              <div className="fsp-stat__num">2,481</div>
              <div className="fsp-stat__label">Đã bán hôm nay</div>
            </div>
            <div className="fsp-stat">
              <div className="fsp-stat__num">Miễn phí</div>
              <div className="fsp-stat__label">Vận chuyển toàn quốc</div>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="fsp-toolbar-wrap">
          <div className="fsp-toolbar">
            <div className="fsp-toolbar__left">
              <span className="fsp-toolbar__title">Sản phẩm Flash Sale</span>
              {!loading && (
                <span className="fsp-toolbar__count">
                  {sorted.length} sản phẩm
                </span>
              )}
            </div>
            <select
              className="fsp-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* GRID */}
        <div className="fsp-grid-wrap">
          {loading ? (
            <div className="fsp-loading">Đang tải sản phẩm...</div>
          ) : sorted.length === 0 ? (
            <div className="fsp-empty">
              Chưa có sản phẩm Flash Sale trong danh mục này.
            </div>
          ) : (
            <div className="fsp-grid">
              {sorted.map((item) => {
                const soldPct = getSoldPercent(item);
                const stockLeft = getStockLeft(item);
                return (
                  <div
                    key={`${item.id}-${item.name}`}
                    className="fsp-card"
                    onClick={() =>
                      navigate(
                        item.category === "laptop"
                          ? `/laptop-detail/${item.id}`
                          : `/component-category/${item.id}`,
                      )
                    }
                  >
                    {item.discount && (
                      <div className="fsp-card__badge">-{item.discount}%</div>
                    )}
                    <div className="fsp-card__img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="fsp-card__body">
                      <h4 className="fsp-card__name">{item.name}</h4>
                      <p className="fsp-card__status">
                        <AiFillCheckCircle className="fsp-card__status-icon" />
                        {item.status || "Còn hàng"}
                      </p>

                      {/* Thanh tiến độ đã bán */}
                      <div className="fsp-card__stock">
                        <div className="fsp-card__stock-label">
                          <span>Đã bán {soldPct}%</span>
                          <span>Còn {stockLeft}</span>
                        </div>
                        <div className="fsp-card__bar">
                          <div
                            className="fsp-card__bar-fill"
                            style={{ width: `${soldPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="fsp-card__price-row">
                        <div className="fsp-card__prices">
                          <span className="fsp-card__price">
                            {item.price?.toLocaleString()}đ
                          </span>
                          {item.oldPrice && (
                            <span className="fsp-card__old">
                              {item.oldPrice.toLocaleString()}đ
                            </span>
                          )}
                        </div>
                        <button
                          className="fsp-card__cart"
                          title="Thêm vào giỏ"
                          onClick={(e) => handleAddToCart(e, item)}
                        >
                          <PiShoppingCartDuotone />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <FooterUser />
    </>
  );
};

export default FlashSalePage;
