import { Handle, Position } from "reactflow";

function InputNode({ data }) {
  const charCount = (data.prompt || "").length;

  return (
    <div style={{
      background: "#ffffff",
      border: "1.5px solid #e0e7ff",
      borderRadius: "16px",
      padding: "18px",
      width: "290px",
      boxShadow: "0 4px 24px rgba(99,102,241,0.12), 0 1px 4px rgba(0,0,0,0.04)",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      transition: "box-shadow 0.2s",
      position: "relative",
    }}>

      <style>{`
        @keyframes labelPulse {
          0%,100% { opacity:1; } 50% { opacity:0.7; }
        }
        .input-textarea:focus {
          border-color: #a5b4fc !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important;
        }
        .input-textarea::placeholder { color: #c7d2fe; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Icon */}
          <div style={{
            width: "28px", height: "28px",
            background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid #c7d2fe",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#3730a3", letterSpacing: "-0.1px" }}>
              Input Node
            </div>
            <div style={{ fontSize: "10px", color: "#a5b4fc", fontWeight: "500" }}>
              Type your prompt
            </div>
          </div>
        </div>

        {/* Node number badge */}
        <div style={{
          background: "#eef2ff",
          border: "1px solid #c7d2fe",
          borderRadius: "6px",
          padding: "2px 8px",
          fontSize: "11px",
          fontWeight: "700",
          color: "#6366f1",
        }}>
          01
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, #e0e7ff, transparent)", marginBottom: "12px" }} />

      {/* Textarea */}
      <textarea
        className="input-textarea"
        value={data.prompt}
        onChange={(e) => data.onPromptChange(e.target.value)}
        placeholder="What would you like to ask AI? ✨"
        rows={4}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          background: "#fafbff",
          color: "#1e1b4b",
          border: "1.5px solid #e0e7ff",
          borderRadius: "10px",
          padding: "10px 12px",
          fontSize: "13px",
          resize: "none",
          outline: "none",
          boxSizing: "border-box",
          cursor: "text",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          lineHeight: "1.6",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />

      {/* Footer: char count */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
        <span style={{
          fontSize: "10.5px",
          color: charCount > 0 ? "#818cf8" : "#c7d2fe",
          fontWeight: "500",
          transition: "color 0.2s",
        }}>
          {charCount} chars
        </span>
      </div>

      {/* Connection handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "#6366f1",
          width: "12px",
          height: "12px",
          border: "2px solid #fff",
          boxShadow: "0 0 0 2px #6366f1",
          right: "-7px",
        }}
      />
    </div>
  );
}

export default InputNode;