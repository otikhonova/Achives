"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Loader2 } from "lucide-react"
import "./BadgePage.css"

interface Badge {
  id: string
  employeeName: string
  title: string
  svg: string
  color: string
}

interface Stats {
  "Hard Skills": number
  Communication: number
  English: number
}

// Mock data - in a real app, this would come from an API
const mockBadges: Record<string, Badge> = {
  "1": {
    id: "1",
    employeeName: "John Doe",
    title: "Excellence in Development",
    svg: "/placeholder.svg?height=256&width=256",
    color: "#3B82F6",
  },
  "2": {
    id: "2",
    employeeName: "Jane Smith",
    title: "Outstanding Communication",
    svg: "/placeholder.svg?height=256&width=256",
    color: "#44BE8D",
  },
}

const mockStats: Record<string, Stats> = {
  "1": {
    "Hard Skills": 85,
    Communication: 78,
    English: 92,
  },
  "2": {
    "Hard Skills": 72,
    Communication: 95,
    English: 88,
  },
}

const colorOptions = [
  { hex: "#3B82F6", class: "color-blue" },
  { hex: "#44BE8D", class: "color-green" },
  { hex: "#E24C4B", class: "color-red" },
  { hex: "#F59E0B", class: "color-yellow" },
  { hex: "#8B5CF6", class: "color-purple" },
]

export default function BadgePage() {
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id as string

  const [badge, setBadge] = useState<Badge | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load badge data based on ID
    let badgeData = mockBadges[id]
    let statsData = mockStats[id]

    // If no mock data exists, create badge from pending feedback in sessionStorage
    if (!badgeData || !statsData) {
      const savedFeedback = sessionStorage.getItem("pendingFeedback")
      if (savedFeedback) {
        try {
          const pendingFeedback = JSON.parse(savedFeedback)
          if (pendingFeedback.length > 0) {
            // Create badge from first feedback entry
            const firstFeedback = pendingFeedback[0]
            badgeData = {
              id: id,
              employeeName: firstFeedback.colleagueName,
              title: `Excellence in ${firstFeedback.category}`,
              svg: "/placeholder.svg?height=256&width=256",
              color: "#3B82F6",
            }

            // Create mock stats
            statsData = {
              "Hard Skills": Math.floor(Math.random() * 20) + 80,
              Communication: Math.floor(Math.random() * 20) + 80,
              English: Math.floor(Math.random() * 20) + 80,
            }
          }
        } catch (error) {
          console.error("Failed to parse saved feedback:", error)
        }
      }
    }

    if (badgeData && statsData) {
      setBadge(badgeData)
      setStats(statsData)
    }
  }, [id])

  const updateColor = (hex: string) => {
    if (badge) {
      setBadge({ ...badge, color: hex })
    }
  }

  const applyPrompt = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)

    // Simulate API call to apply prompt changes
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock response - in a real app, this would process the prompt
      console.log("Applying prompt:", prompt)

      // Clear prompt after successful application
      setPrompt("")
    } catch (error) {
      console.error("Error applying prompt:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getColorClass = (hex: string) => {
    const colorOption = colorOptions.find((option) => option.hex === hex)
    return colorOption ? colorOption.class : "color-blue"
  }

  const getHueRotation = (hex: string): number => {
    const colorMap: Record<string, number> = {
      "#3B82F6": 0, // Blue - no rotation
      "#44BE8D": 120, // Green
      "#E24C4B": -30, // Red
      "#F59E0B": 45, // Yellow
      "#8B5CF6": 270, // Purple
    }
    return colorMap[hex] || 0
  }

  if (!badge || !stats) {
    return (
      <main className="badge-page">
        <div className="badge-card">
          <div className="loading-container">
            <Loader2 className="spinner" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="badge-page">
      <div className="badge-card">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft className="back-icon" />
        </button>

        {/* Badge */}
        <div className="badge-display">
          <img
            alt="badge"
            src={badge.svg || "/placeholder.svg"}
            className="badge-image"
            style={{ filter: `hue-rotate(${getHueRotation(badge.color)}deg)` }}
          />
          <h2 className="badge-employee-name">{badge.employeeName}</h2>
          <p className="badge-title">{badge.title}</p>
        </div>

        {/* Stats */}
        <div className="stats-container">
          {(["Hard Skills", "Communication", "English"] as const).map((cat) => (
            <div key={cat} className="stat-row">
              <span className="stat-label">{cat}</span>
              <div className="stat-bar-container">
                <div className={`stat-bar ${getColorClass(badge.color)}`} style={{ width: `${stats[cat]}%` }} />
              </div>
              <span className="stat-value">{stats[cat]}%</span>
            </div>
          ))}
        </div>

        {/* Color picker */}
        <div className="color-picker">
          {colorOptions.map(({ hex }) => (
            <button
              key={hex}
              className={`color-button ${badge.color === hex ? "selected" : ""}`}
              style={{ backgroundColor: hex }}
              onClick={() => updateColor(hex)}
              aria-label={`Select color ${hex}`}
            />
          ))}
        </div>

        {/* Prompt area */}
        <textarea
          rows={2}
          placeholder="Describe changes..."
          value={prompt}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
          className="prompt-textarea"
        />

        <button onClick={applyPrompt} disabled={!prompt.trim() || isLoading} className="apply-button">
          {isLoading ? (
            <span className="loading-text">
              <Loader2 className="loading-icon" />
              Applying...
            </span>
          ) : (
            "Apply prompt"
          )}
        </button>
      </div>
    </main>
  )
}
