
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import "./BadgePage.css";


interface Badge {
  id: string;
  name: string;
  feedback: { category: string; message: string }[];
  imageB64: string;
}

export default function BadgePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [badge, setBadge] = useState<Badge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/badge/${id}`)
      .then(res => res.json())
      .then(data => {
        setBadge(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="badge-page">
        <div className="badge-card">
          <div className="loading-container">
            <Loader2 className="spinner" />
          </div>
        </div>
      </main>
    );
  }

  if (!badge) {
    return (
      <main className="badge-page">
        <div className="badge-card">
          <div className="loading-container">
            <p>Badge not found.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="badge-page">
      <div className="badge-card">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft className="back-icon" />
        </button>
        <div className="badge-display">
          <img
            alt="badge"
            src={`data:image/png;base64,${badge.imageB64}`}
            className="badge-image"
          />
          <h2 className="badge-employee-name">{badge.name}</h2>
        </div>
        <div className="badge-feedback-list">
          <h3>Feedback</h3>
          <ul>
            {badge.feedback.map((fb, idx) => (
              <li key={idx}><b>{fb.category}:</b> {fb.message}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
