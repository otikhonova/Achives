"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import "./FeedbackForm.css"

interface Feedback {
  id: string
  colleagueName: string
  category: string
  message: string
  timestamp: number
}

const categories = ["Hard Skills", "Communication (Soft Skills)", "English Proficiency"]

export default function GiveKudosPage() {
  const navigate = useNavigate()
  const [colleagueName, setColleagueName] = useState("")
  const [category, setCategory] = useState("")
  const [message, setMessage] = useState("")
  const [pendingFeedback, setPendingFeedback] = useState<Feedback[]>([])
  const [generating, setGenerating] = useState(false)

  // Load from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("pendingFeedback")
    if (saved) {
      try {
        setPendingFeedback(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to parse saved feedback:", error)
      }
    }
  }, [])

  // Save to sessionStorage whenever pendingFeedback changes
  useEffect(() => {
    sessionStorage.setItem("pendingFeedback", JSON.stringify(pendingFeedback))
  }, [pendingFeedback])

  const handleAddFeedback = () => {
    if (!colleagueName.trim() || !category || !message.trim()) {
      return
    }

    const newFeedback: Feedback = {
      id: Date.now().toString(),
      colleagueName: colleagueName.trim(),
      category,
      message: message.trim(),
      timestamp: Date.now(),
    }

    setPendingFeedback((prev: Feedback[]) => [...prev, newFeedback])

    // Reset form
    setColleagueName("")
    setCategory("")
    setMessage("")
  }

  const handleRemoveFeedback = (id: string) => {
    setPendingFeedback((prev: Feedback[]) => prev.filter((feedback: Feedback) => feedback.id !== id))
  }

  const handleGenerateBadge = async () => {
    if (pendingFeedback.length === 0 || generating) return;
    setGenerating(true);
    const employeeName = pendingFeedback[0].colleagueName;
    // Only send category and message to the server
    const feedback = pendingFeedback.map(fb => ({
      category: fb.category,
      message: fb.message
    }));
    try {
      const res = await fetch('/api/badge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: employeeName, feedback })
      });
      const data = await res.json();
      if (data && data.id) {
        navigate(`/badge/${data.id}`);
      } else {
        alert('Failed to generate badge.');
      }
    } catch (err) {
      alert('Error generating badge.');
    } finally {
      setGenerating(false);
    }
  }

  const isFormValid = colleagueName.trim() && category && message.trim()

  return (
    <div className="kudos-page">
      <div className="kudos-container">
        <div className="kudos-header">
          <h1 className="kudos-title">Give Kudos</h1>
          <p className="kudos-description">Recognize your colleagues' achievements and contributions</p>
        </div>

        <div className="kudos-grid">
          {/* Form Section */}
          <div className="kudos-card">
            <div className="kudos-card-header">
              <h2 className="kudos-card-title">Add New Feedback</h2>
              <p className="kudos-card-description">Share positive feedback about your colleague's performance</p>
            </div>
            <div className="kudos-card-content">
              <div className="form-space">
                <div className="form-group">
                  <label htmlFor="colleague-name" className="form-label">
                    Colleague Name
                  </label>
                  <input
                    id="colleague-name"
                    type="text"
                    className="form-input"
                    placeholder="Enter colleague's name"
                    value={colleagueName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColleagueName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    id="category"
                    className="form-select"
                    value={category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="feedback-message" className="form-label">
                    Feedback Message
                  </label>
                  <textarea
                    id="feedback-message"
                    className="form-textarea"
                    placeholder="Write your positive feedback here..."
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                  />
                </div>

                <button className="btn btn-secondary btn-full" onClick={handleAddFeedback} disabled={!isFormValid}>
                  Add feedback
                </button>
              </div>
            </div>
          </div>

          {/* Pending Feedback Section */}
          <div className="pending-section">
            <div className="kudos-card">
              <div className="kudos-card-header">
                <h2 className="kudos-card-title">Pending Feedback</h2>
                <p className="kudos-card-description">
                  {pendingFeedback.length === 0
                    ? "No pending feedback yet"
                    : `${pendingFeedback.length} feedback${pendingFeedback.length === 1 ? "" : "s"} ready`}
                </p>
              </div>
              <div className="kudos-card-content">
                {pendingFeedback.length === 0 ? (
                  <div className="pending-empty">
                    <p>Add some feedback to get started!</p>
                  </div>
                ) : (
                  <div className="pending-list">
                    {pendingFeedback.map((feedback) => (
                      <div key={feedback.id} className="feedback-card">
                        <div className="feedback-content">
                          <div className="feedback-details">
                            <div className="feedback-header">
                              <h4 className="feedback-name">{feedback.colleagueName}</h4>
                              <span className="feedback-badge">{feedback.category}</span>
                            </div>
                            <p className="feedback-message">{feedback.message}</p>
                          </div>
                          <button
                            className="btn btn-ghost remove-btn"
                            onClick={() => handleRemoveFeedback(feedback.id)}
                            title="Remove feedback"
                          >
                            <X className="icon" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              className="btn btn-primary btn-full btn-large"
              onClick={handleGenerateBadge}
              disabled={pendingFeedback.length === 0 || generating}
              style={{ position: 'relative', minHeight: '44px' }}
            >
              {generating ? (
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
                  Generating...
                </span>
              ) : (
                "Generate badge"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
