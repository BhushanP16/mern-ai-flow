import { Handle, Position } from "reactflow";

function ResultNode({ data }) {
  const wordCount = data.response
    ? data.response.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div style={{
      background: "#ffffff",
      border: "1.5px solid #d1fae5",
      borderRadius: "16px",
      padding: "18px",
      width: "330px",
      boxShadow: "0 4px 24px rgba(16,185,129,0.1), 0 1px 4px rgba(0,0,0,0.04)",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: "relative",
    }}>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingBlink {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }
        .result-text { animation: fadeIn 0.4s ease both; }
        .typing-cursor {
          display: inline-block;
          width: 2px; height: 14px;
          background: #10b981;
          margin-left: 3px;
          vertical-align: middle;
          animation: typingBlink 0.9s ease infinite;
        }
      `}</style>

      {/* Handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "#10b981",
          width: "12px",
          height: "12px",
          border: "2px solid #fff",
          boxShadow: "0 0 0 2px #10b981",
          left: "-7px",
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Icon */}
          <div style={{
            width: "28px", height: "28px",
            background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid #a7f3d0",
          }}>
            {data.loading ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            )}
          </div>
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#065f46", letterSpacing: "-0.1px" }}>
              AI Result Node
            </div>
            <div style={{ fontSize: "10px", color: "#6ee7b7", fontWeight: "500" }}>
              {data.loading ? "Thinking…" : data.response ? "Response ready" : "Waiting for input"}
            </div>
          </div>
        </div>

        {/* Node badge */}
        <div style={{
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          borderRadius: "6px",
          padding: "2px 8px",
          fontSize: "11px",
          fontWeight: "700",
          color: "#059669",
        }}>
          02
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, #d1fae5, transparent)", marginBottom: "12px" }} />

      {/* Response area */}
      <div style={{
        background: "#f9fffe",
        border: "1.5px solid #d1fae5",
        borderRadius: "10px",
        padding: "12px",
        minHeight: "90px",
        maxHeight: "200px",
        overflowY: "auto",
        fontSize: "13px",
        lineHeight: "1.7",
        position: "relative",
      }}>
        {data.loading ? (
          // Skeleton loading
          <div>
            {[90, 100, 75, 85, 60].map((w, i) => (
              <div key={i} style={{
                height: "11px",
                borderRadius: "6px",
                marginBottom: "8px",
                width: `${w}%`,
                background: "linear-gradient(90deg, #d1fae5 25%, #ecfdf5 50%, #d1fae5 75%)",
                backgroundSize: "600px 100%",
                animation: `shimmer 1.4s ease infinite`,
                animationDelay: `${i * 0.1}s`,
              }} />
            ))}
          </div>
        ) : data.response ? (
          <div
            className="result-text"
            style={{ color: "#1a2e1a", whiteSpace: "pre-wrap" }}
          >
            {data.response}
          </div>
        ) : (
          <div style={{
            color: "#a7f3d0",
            fontSize: "12.5px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "60px",
            gap: "6px",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a7f3d0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4m0 4h.01"/>
            </svg>
            AI response will appear here...
          </div>
        )}
      </div>

      {/* Footer: word count */}
      {data.response && !data.loading && (
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "7px",
          gap: "10px",
        }}>
          <span style={{ fontSize: "10.5px", color: "#6ee7b7", fontWeight: "500" }}>
            ✓ {wordCount} words
          </span>
        </div>
      )}
    </div>
  );
}

export default ResultNode;