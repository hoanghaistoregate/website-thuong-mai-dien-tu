import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import "./ProductReviews.css";

const formatDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const StarDisplay = ({ rating }) => (
  <div className="review-stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={n <= rating ? "filled" : ""}>
        ★
      </span>
    ))}
  </div>
);

const StarSelector = ({ value, onChange }) => (
  <div className="star-selector">
    {[5, 4, 3, 2, 1].map((n) => (
      <label key={n} title={`${n} sao`}>
        <input
          type="radio"
          name="rating"
          value={n}
          checked={Number(value) === n}
          onChange={() => onChange(n)}
        />
        ★
      </label>
    ))}
  </div>
);

const ProductReviews = ({ productId, collectionName = "categories" }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const listRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isAdmin = currentUser?.role === "admin";

  const fetchReviews = async () => {
    try {
      // Nếu có productId thì lọc theo sản phẩm, không thì lấy bình luận
      // chung của cả khu (dùng cho trang trưng bày / không gắn sản phẩm cụ thể)
      const url = productId
        ? `http://localhost:3000/reviews?productId=${productId}`
        : `http://localhost:3000/reviews`;
      const res = await fetch(url);
      const data = await res.json();
      setReviews(
        data.filter((item) => {
          const sameCollection = item.collection === collectionName;
          const sameProduct = productId
            ? String(item.productId) === String(productId)
            : true;
          return sameCollection && sameProduct;
        }),
      );
    } catch (err) {
      console.error("Lỗi lấy bình luận:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, collectionName]);

  // Kiểm tra vị trí cuộn để ẩn/hiện nút lên - xuống
  const updateScrollButtons = () => {
    const el = listRef.current;
    if (!el) return;
    setShowScrollUp(el.scrollTop > 20);
    setShowScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 20);
  };

  useEffect(() => {
    updateScrollButtons();
  }, [reviews]);

  const scrollByAmount = (amount) => {
    listRef.current?.scrollBy({ top: amount, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để đánh giá!");
      return;
    }

    const newReview = {
      productId: productId !== undefined ? String(productId) : null,
      collection: collectionName,
      userId: currentUser.id,
      userName: currentUser.fullName,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
      id: Date.now().toString(),
    };

    try {
      const res = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      if (res.ok) {
        toast.success("Đã gửi đánh giá!");
        setComment("");
        setRating(5);
        fetchReviews();
      }
    } catch {
      toast.error("Không thể gửi bình luận!");
    }
  };

  const handleReplySubmit = async (reviewId) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reply: replyText,
          replyAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        toast.success("Đã gửi phản hồi!");
        setReplyingId(null);
        setReplyText("");
        fetchReviews();
      }
    } catch {
      toast.error("Không thể gửi phản hồi!");
    }
  };

  return (
    <div className="reviews-section">
      {/* Tiêu đề */}
      <div className="reviews-header">
        <h3>Đánh giá sản phẩm</h3>
        <span className="reviews-count-badge">{reviews.length}</span>
      </div>

      {/* 2 cột */}
      <div className="reviews-body">
        {/* CỘT TRÁI — form gửi */}
        <aside className="reviews-form-panel">
          <h4>Viết đánh giá</h4>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div className="form-label" style={{ marginBottom: 8 }}>
                  Số sao
                </div>
                <StarSelector value={rating} onChange={setRating} />
              </div>

              <div>
                <div className="form-label" style={{ marginBottom: 6 }}>
                  Nhận xét
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                  required
                />
              </div>

              <button type="submit">Gửi đánh giá</button>
            </div>
          </form>
        </aside>

        {/* CỘT PHẢI — danh sách */}
        <div className="reviews-list-wrapper">
          <div
            className="reviews-list-panel"
            ref={listRef}
            onScroll={updateScrollButtons}
          >
            {reviews.length === 0 ? (
              <div className="reviews-empty">
                <div className="empty-icon">💬</div>
                <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
              </div>
            ) : (
              reviews.map((rv) => (
                <div key={rv.id} className="review-card">
                  <div className="review-avatar">
                    {getInitials(rv.userName)}
                  </div>
                  <div className="review-body">
                    <div className="review-meta">
                      <span className="review-author">{rv.userName}</span>
                      <StarDisplay rating={rv.rating} />
                      <span className="review-date">
                        {formatDate(rv.createdAt)}
                      </span>
                    </div>
                    <p className="review-comment">{rv.comment}</p>

                    {rv.reply && (
                      <div className="review-reply">
                        <span className="review-reply-label">
                          Phản hồi từ shop
                        </span>
                        <p className="review-reply-text">{rv.reply}</p>
                        <span className="review-reply-date">
                          {formatDate(rv.replyAt)}
                        </span>
                      </div>
                    )}

                    {isAdmin && !rv.reply && (
                      <div className="review-reply-form">
                        {replyingId === rv.id ? (
                          <>
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Nhập phản hồi cho khách hàng..."
                            />
                            <div className="review-reply-actions">
                              <button
                                type="button"
                                className="reply-send-btn"
                                onClick={() => handleReplySubmit(rv.id)}
                              >
                                Gửi
                              </button>
                              <button
                                type="button"
                                className="reply-cancel-btn"
                                onClick={() => {
                                  setReplyingId(null);
                                  setReplyText("");
                                }}
                              >
                                Hủy
                              </button>
                            </div>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="reply-open-btn"
                            onClick={() => setReplyingId(rv.id)}
                          >
                            Phản hồi
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Nút cuộn lên / xuống */}
          {reviews.length > 0 && (
            <div className="scroll-controls">
              <button
                type="button"
                className={`scroll-btn${showScrollUp ? " is-visible" : ""}`}
                onClick={() => scrollByAmount(-200)}
                aria-label="Cuộn lên"
              >
                ↑
              </button>
              <button
                type="button"
                className={`scroll-btn${showScrollDown ? " is-visible" : ""}`}
                onClick={() => scrollByAmount(200)}
                aria-label="Cuộn xuống"
              >
                ↓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
