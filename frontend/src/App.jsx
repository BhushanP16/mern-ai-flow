import { useState, useCallback, useRef } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

import InputNode from "./nodes/InputNode";
import ResultNode from "./nodes/ResultNode";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://mern-ai-flow-backend.onrender.com";

const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [runCount, setRunCount] = useState(0);
  const promptRef = useRef(prompt);

  const handlePromptChange = useCallback((val) => {
    promptRef.current = val;
    setPrompt(val);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "1") {
          return { ...node, data: { ...node.data, prompt: val } };
        }
        return node;
      })
    );
  }, []);

  const initialNodes = [
    {
      id: "1",
      type: "inputNode",
      position: { x: 120, y: 180 },
      data: { prompt: "", onPromptChange: handlePromptChange },
    },
    {
      id: "2",
      type: "resultNode",
      position: { x: 560, y: 180 },
      data: { response: "", loading: false },
    },
  ];

  const initialEdges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2.5 },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const updateResultNode = useCallback(
    (newResponse, newLoading) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === "2") {
            return { ...node, data: { response: newResponse, loading: newLoading } };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const handleRunFlow = async () => {
    const currentPrompt = promptRef.current;
    if (!currentPrompt.trim()) {
      alert("Please enter a prompt first!");
      return;
    }
    setLoading(true);
    setResponse("");
    updateResultNode("", true);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/ask-ai`, { prompt: currentPrompt });
      const aiAnswer = res.data.answer;
      setResponse(aiAnswer);
      setLoading(false);
      setRunCount((c) => c + 1);
      updateResultNode(aiAnswer, false);
    } catch {
      setLoading(false);
      updateResultNode("❌ An error occurred! Please check if the backend is running.", false);
    }
  };

  const handleSave = async () => {
    const currentPrompt = promptRef.current;
    if (!currentPrompt || !response) {
      alert("Please run the flow first!");
      return;
    }
    try {
      await axios.post(`${BACKEND_URL}/api/save`, { prompt: currentPrompt, response });
      setSaveStatus("success");
      setSaveMessage("Saved to MongoDB!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch {
      setSaveStatus("error");
      setSaveMessage("Save failed!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#f5f7ff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.5); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.8) translateY(6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes gradientShift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }

        .navbar { animation: fadeSlideDown 0.5s cubic-bezier(.16,1,.3,1) both; }

        .run-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 10px 22px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: box-shadow 0.2s, transform 0.15s, opacity 0.2s;
          box-shadow: 0 4px 14px rgba(99,102,241,0.4);
          font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: -0.1px;
        }
        .run-btn:hover:not(:disabled) {
          box-shadow: 0 8px 24px rgba(99,102,241,0.5);
          transform: translateY(-2px);
        }
        .run-btn:active:not(:disabled) { transform: translateY(0); }
        .run-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .save-btn {
          background: #ffffff;
          color: #059669;
          border: 1.5px solid #a7f3d0;
          border-radius: 10px;
          padding: 9px 20px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: all 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .save-btn:hover {
          background: #ecfdf5;
          border-color: #6ee7b7;
          box-shadow: 0 4px 14px rgba(16,185,129,0.18);
          transform: translateY(-1px);
        }

        .toast {
          animation: popIn 0.3s cubic-bezier(.16,1,.3,1) both;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .toast.success { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
        .toast.error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
          display: inline-block;
          flex-shrink: 0;
        }

        .live-badge {
          display: flex; align-items: center; gap: 5px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 11.5px;
          font-weight: 600;
          color: #059669;
        }
        .live-dot {
          width: 6px; height: 6px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse-dot 1.4s ease infinite;
        }

        .run-badge {
          display: flex; align-items: center; gap: 5px;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 11.5px;
          font-weight: 600;
          color: #6366f1;
        }

        .react-flow__controls {
          border-radius: 10px !important;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08) !important;
          border: 1px solid #e0e7ff !important;
        }
        .react-flow__controls-button {
          background: #fff !important;
          border-bottom: 1px solid #f5f3ff !important;
          color: #6366f1 !important;
        }
        .react-flow__controls-button:hover { background: #eef2ff !important; }
        .react-flow__edge-path { filter: drop-shadow(0 0 3px rgba(99,102,241,0.3)); }
      `}</style>

      {/* ── NAVBAR ── */}
      <div className="navbar" style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99,102,241,0.1)",
        padding: "0 28px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 24px rgba(99,102,241,0.07)",
      }}>

        {/* Left: Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>

          {/* B Logo */}
          <div style={{
            width: "40px", height: "40px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            borderRadius: "11px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Shine overlay */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "50%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
              borderRadius: "11px 11px 0 0",
            }} />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {/* Bold B letter */}
              <text x="4" y="19" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="18" fill="white">B</text>
              {/* Circuit dots */}
              <circle cx="20" cy="6"  r="2"   fill="rgba(255,255,255,0.65)" />
              <circle cx="20" cy="12" r="1.5" fill="rgba(255,255,255,0.45)" />
              <circle cx="20" cy="18" r="1"   fill="rgba(255,255,255,0.3)" />
              <line x1="18" y1="6"  x2="16" y2="6"  stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
              <line x1="18" y1="12" x2="16" y2="12" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            </svg>
          </div>

          {/* Brand name */}
          <div>
            <div style={{ fontSize: "17px", fontWeight: "800", color: "#1e1b4b", letterSpacing: "-0.4px", lineHeight: "1.1" }}>
              MERNFlow
            </div>
            <div style={{ fontSize: "10px", fontWeight: "700", color: "#818cf8", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              AI Studio
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "28px", background: "#e0e7ff", margin: "0 4px" }} />

          {/* Live badge */}
          <div className="live-badge">
            <span className="live-dot" />
            Live
          </div>

          {runCount > 0 && (
            <div className="run-badge">
              ⚡ {runCount} {runCount === 1 ? "Run" : "Runs"}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {saveMessage && (
            <div className={`toast ${saveStatus}`}>
              {saveStatus === "success" ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              )}
              {saveMessage}
            </div>
          )}

          <button className="save-btn" onClick={handleSave}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Save
          </button>

          <button className="run-btn" onClick={handleRunFlow} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Running…
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Run Flow
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── CANVAS ── */}
      <div style={{ paddingTop: "64px", height: "100%", position: "relative" }}>

        {/* Decorative mesh bg */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          background: `
            radial-gradient(ellipse at 15% 60%, rgba(99,102,241,0.07) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 25%, rgba(139,92,246,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 90%, rgba(16,185,129,0.04) 0%, transparent 40%)
          `,
        }} />

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          style={{ background: "transparent" }}
        >
          <Background color="#c7d2fe" gap={26} size={1.3} style={{ opacity: 0.55 }} />
          <Controls style={{ bottom: 28, left: 28 }} />
        </ReactFlow>

        {/* Bottom hint pill */}
        <div style={{
          position: "absolute",
          bottom: "22px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid #e0e7ff",
          borderRadius: "22px",
          padding: "7px 20px",
          fontSize: "12px",
          color: "#6366f1",
          fontWeight: "500",
          display: "flex",
          gap: "14px",
          alignItems: "center",
          boxShadow: "0 2px 16px rgba(99,102,241,0.1)",
          zIndex: 10,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}>
          <span>✏️ Type in the Input Node</span>
          <span style={{ color: "#c7d2fe" }}>·</span>
          <span>▶ Click Run Flow</span>
          <span style={{ color: "#c7d2fe" }}>·</span>
          <span>💾 Save to MongoDB</span>
        </div>
      </div>
    </div>
  );
}

export default App;
