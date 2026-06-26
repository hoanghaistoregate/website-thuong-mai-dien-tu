import { useState, useEffect } from "react";
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

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/reviews?productId=${productId}`,
      );
      const data = await res.json();
      setReviews(data.filter((item) => item.collection === collectionName));
    } catch (err) {
      console.error("Lỗi lấy bình luận:", err);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId, collectionName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để đánh giá!");
      return;
    }

    const newReview = {
      productId: String(productId),
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
        <div className="reviews-list-panel">
          {reviews.length === 0 ? (
            <div className="reviews-empty">
              <div className="empty-icon">💬</div>
              <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
            </div>
          ) : (
            reviews.map((rv) => (
              <div key={rv.id} className="review-card">
                <div className="review-avatar">{getInitials(rv.userName)}</div>
                <div className="review-body">
                  <div className="review-meta">
                    <span className="review-author">{rv.userName}</span>
                    <StarDisplay rating={rv.rating} />
                    <span className="review-date">
                      {formatDate(rv.createdAt)}
                    </span>
                  </div>
                  <p className="review-comment">{rv.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
