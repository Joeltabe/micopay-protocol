import { useState } from "react";

const EXPLORER = "https://stellar.expert/explorer/testnet";

// Real completed atomic swap from testnet
const REAL_SWAP = {
  id: "3960c267aa93024af477ca8d57ee92c0adea2ed43d46e1602709dc4824da1516",
  status: "completed",
  sell: "0.50 USDC",
  buy: "3.00 XLM",
  initiator: "GDKKW2WS...BJJK",
  counterparty: "GCRFPFSN...F3AA",
  contract_a: "CCDOUXIXSFXT2HTJAJGFNUJN6CKCYX2M6AL2BHHPEF6ISNHP2BGLS4KX",
  contract_b: "CBLCGG44QQILWEIVBXDSZSLH7NI7SGJQKXQ7WTKP3W3YSXOBTGMZKSNN",
  txs: {
    lock_a:    "5d2b1bd61adebe8946e1986d58560ca3d4379219afe3375b142e8c02b0b00bf6",
    lock_b:    "4123aadfe4b53f6fe9bbc60150cee7b0e06f2500ee276f114f2f833a0325b502",
    release_b: "4db1ba5520485b13aad5fe86537411a6a905424c3dd2066f6be9c78a7f34f0eb",
    release_a: "34057acde13d0117737ddbb141e9a6c6641418fc7cbfb6a35db6f00201f8ee64",
  },
  secret_hash: "35a57759fcf2fd9b9c27c5e9c0287453da4b677a34d98b730ab71340a2bb5823",
  started: "live on testnet",
};

interface Props { apiUrl: string }

const STATUS_COLORS: Record<string, string> = {
  completed: "#4ade80",
  locked:    "#facc15",
  executing: "#60a5fa",
  failed:    "#f87171",
};

export default function SwapStatus({ apiUrl }: Props) {
  const [swapId, setSwapId] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pollStatus = async () => {
    if (!swapId.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res  = await fetch(`${apiUrl}/api/v1/swaps/${swapId}/status`, {
        headers: { "x-payment": "mock:GAGENT_DEMO:0.0001" },
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const box: React.CSSProperties = {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    marginBottom: "1rem",
  };

  const txRow = (label: string, hash: string, color = "#a78bfa") => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
      <span style={{ fontSize: "0.7rem", color: "#4b5563", width: "80px", flexShrink: 0 }}>{label}</span>
      <a
        href={`${EXPLORER}/tx/${hash}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: "0.7rem", color, fontFamily: "monospace", textDecoration: "none" }}
      >
        {hash.slice(0, 12)}...{hash.slice(-6)} ↗
      </a>
    </div>
  );

  return (
    <div>
      {/* Lifecycle diagram */}
      <div style={box}>
        <h2 style={{ margin: "0 0 1rem", fontSize: "1.25rem", color: "white" }}>Atomic Swap Lifecycle</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[
            { label: "Intent",       color: "#4ade80", bg: "#14532d", border: "#166534" },
            { label: "Plan (Claude)", color: "#4ade80", bg: "#14532d", border: "#166534" },
            { label: "Lock A",       color: "#60a5fa", bg: "#1e3a5f", border: "#1d4ed8" },
            { label: "Lock B",       color: "#60a5fa", bg: "#1e3a5f", border: "#1d4ed8" },
            { label: "Release B",    color: "#c4b5fd", bg: "#3b0764", border: "#6d28d9" },
            { label: "Release A",    color: "#c4b5fd", bg: "#3b0764", border: "#6d28d9" },
            { label: "Complete",     color: "#4ade80", bg: "#052e16", border: "#15803d" },
          ].map(({ label, color, bg, border }, i, arr) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ padding: "0.25rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.7rem", background: bg, color, border: `1px solid ${border}` }}>
                {label}
              </div>
              {i < arr.length - 1 && <span style={{ color: "#4b5563" }}>→</span>}
            </div>
          ))}
        </div>

        {/* Real completed swap */}
        <h3 style={{ margin: "0 0 0.75rem", fontSize: "0.875rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Completed Swap — Live on Testnet
        </h3>

        <div style={{
          padding: "1rem",
          background: "#0f172a",
          borderRadius: "0.375rem",
          borderLeft: `3px solid ${STATUS_COLORS.completed}`,
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <div>
              <span style={{ fontSize: "1rem", color: "white", fontWeight: "bold" }}>
                {REAL_SWAP.sell} → {REAL_SWAP.buy}
              </span>
              <span style={{ marginLeft: "0.5rem", padding: "0.1rem 0.4rem", borderRadius: "0.25rem", fontSize: "0.7rem", background: "#1f2937", color: STATUS_COLORS.completed }}>
                {REAL_SWAP.status}
              </span>
            </div>
            <span style={{ fontSize: "0.7rem", color: "#4b5563" }}>{REAL_SWAP.started}</span>
          </div>

          {/* swap_id */}
          <div style={{ marginBottom: "0.75rem", fontSize: "0.7rem", color: "#4b5563" }}>
            swap_id:{" "}
            <code style={{ color: "#60a5fa", fontSize: "0.68rem" }}>
              {REAL_SWAP.id.slice(0, 16)}...{REAL_SWAP.id.slice(-8)}
            </code>
          </div>

          {/* Parties */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.7rem" }}>
              <span style={{ color: "#4b5563" }}>initiator: </span>
              <code style={{ color: "#60a5fa" }}>{REAL_SWAP.initiator}</code>
            </div>
            <div style={{ fontSize: "0.7rem" }}>
              <span style={{ color: "#4b5563" }}>counterparty: </span>
              <code style={{ color: "#60a5fa" }}>{REAL_SWAP.counterparty}</code>
            </div>
          </div>

          {/* Contracts */}
          <div style={{ marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.7rem", marginBottom: "0.2rem" }}>
              <span style={{ color: "#4b5563" }}>Contract A (USDC): </span>
              <a href={`${EXPLORER}/contract/${REAL_SWAP.contract_a}`} target="_blank" rel="noopener noreferrer" style={{ color: "#a78bfa", fontFamily: "monospace", fontSize: "0.68rem", textDecoration: "none" }}>
                {REAL_SWAP.contract_a.slice(0, 10)}...{REAL_SWAP.contract_a.slice(-6)} ↗
              </a>
            </div>
            <div style={{ fontSize: "0.7rem" }}>
              <span style={{ color: "#4b5563" }}>Contract B (XLM):  </span>
              <a href={`${EXPLORER}/contract/${REAL_SWAP.contract_b}`} target="_blank" rel="noopener noreferrer" style={{ color: "#a78bfa", fontFamily: "monospace", fontSize: "0.68rem", textDecoration: "none" }}>
                {REAL_SWAP.contract_b.slice(0, 10)}...{REAL_SWAP.contract_b.slice(-6)} ↗
              </a>
            </div>
          </div>

          {/* 4 transactions */}
          <div style={{ borderTop: "1px solid #1f2937", paddingTop: "0.75rem" }}>
            <div style={{ fontSize: "0.7rem", color: "#4b5563", marginBottom: "0.4rem" }}>On-chain transactions:</div>
            {txRow("1. Lock USDC", REAL_SWAP.txs.lock_a, "#60a5fa")}
            {txRow("2. Lock XLM",  REAL_SWAP.txs.lock_b, "#60a5fa")}
            {txRow("3. Release B", REAL_SWAP.txs.release_b, "#4ade80")}
            {txRow("4. Release A", REAL_SWAP.txs.release_a, "#4ade80")}
          </div>

          {/* Secret note */}
          <div style={{ marginTop: "0.75rem", padding: "0.5rem", background: "#052e16", borderRadius: "0.25rem", fontSize: "0.7rem", color: "#4ade80" }}>
            ✓ Secret revealed in tx #3 → used by counterparty in tx #4. Atomic by cryptography.
          </div>
        </div>
      </div>

      {/* Poll by ID */}
      <div style={box}>
        <h3 style={{ margin: "0 0 0.75rem", fontSize: "0.875rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Poll Swap Status
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <input
            value={swapId}
            onChange={(e) => setSwapId(e.target.value)}
            placeholder="swap_id..."
            style={{ flex: 1, padding: "0.5rem 0.75rem", background: "#0f172a", border: "1px solid #374151", borderRadius: "0.375rem", color: "white", fontSize: "0.875rem", fontFamily: "monospace" }}
          />
          <button
            onClick={pollStatus}
            disabled={loading}
            style={{ padding: "0.5rem 1rem", background: "#166534", border: "1px solid #15803d", borderRadius: "0.375rem", color: "#4ade80", fontSize: "0.875rem", cursor: "pointer", fontFamily: "monospace" }}
          >
            {loading ? "..." : "Poll"}
          </button>
        </div>
        {result && (
          <pre style={{ margin: 0, fontSize: "0.75rem", color: "#d1d5db", background: "#0f172a", padding: "0.75rem", borderRadius: "0.375rem", overflowX: "auto" }}>
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}
