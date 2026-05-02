export function Footer() {
  return (
    <footer>
      <h2
        className="indigo"
        style={{ marginBottom: "15px", fontSize: "1.5rem", fontWeight: 800 }}
      >
        Ready to collaborate?
      </h2>
      <p style={{ color: "var(--text-dim)", fontWeight: 500 }}>
        © {new Date().getFullYear()} KAYES DEV
      </p>
    </footer>
  );
}
