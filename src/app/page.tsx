export default function Page() {
  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ padding: "2rem", border: "1px solid #27272a", borderRadius: "1rem", background: "#18181b" }}>
        <h1 style={{ color: "#ff6a00", margin: "0 0 0.5rem 0", fontSize: "1.5rem" }}>Partsly System Purged</h1>
        <p style={{ color: "#a1a1aa", margin: 0, fontSize: "0.875rem" }}>
          Application, database, and repository reset complete. Waiting for new instructions.
        </p>
      </div>
    </div>
  );
}
