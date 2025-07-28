
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
  const [loading, setLoading] = useState(true); // for initial page load
  const [updating, setUpdating] = useState(false); // for PATCH update
  const [prompt, setPrompt] = useState<string>("");

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
            key={badge.id}
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

        {/* Additional prompt form */}
        <form
          style={{ marginTop: '2rem' }}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!prompt.trim() || !badge) return;
            setUpdating(true);
            try {
              const res = await fetch(`/api/badge/${badge.id}/prompt`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
              });
              const data = await res.json();
              if (res.ok && data && data.imageB64 && data.id) {
                setPrompt("");
                navigate(`/badge/${data.id}`);
              } else if (res.ok && data && data.imageB64) {
                setBadge({ ...badge, imageB64: data.imageB64 });
                setPrompt("");
              } else {
                let errorMsg = 'Failed to update badge image.';
                if (data?.error) errorMsg = data.error;
                if (data?.message) errorMsg += `\n${data.message}`;
                alert(errorMsg);
              }
            } catch (err) {
              alert('Error updating badge image.');
            } finally {
              setUpdating(false);
            }
          }}
        >
          <div className="form-group">
            <label htmlFor="prompt-textarea" className="form-label">
              Additional prompt for the picture:
            </label>
            <textarea
              id="prompt-textarea"
              className="form-textarea"
              placeholder="Describe changes or add details for the badge image..."
              rows={2}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '0.5rem', minWidth: '120px', minHeight: '36px', position: 'relative' }}
            disabled={updating}
          >
            {updating ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 50 50"
                  style={{ marginRight: '8px' }}
                  className="spinner"
                >
                  <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="5"
                    strokeDasharray="31.415, 31.415"
                    transform="rotate(72.0681 25 25)"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 25 25"
                      to="360 25 25"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
                Updating...
              </span>
            ) : (
              "Apply prompt"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
