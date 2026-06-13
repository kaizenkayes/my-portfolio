export function Footer() {
  return (
    <footer className="border-t border-[var(--footer-border)] bg-[var(--bg-light)] px-[10%] py-20 text-center transition-[background,border-color] duration-300">
      <h2 className="mb-[15px] text-2xl font-extrabold text-[var(--accent-indigo)]">
        Ready to collaborate?
      </h2>
      <p className="font-medium text-[var(--text-dim)]">
        © {new Date().getFullYear()} KAYES DEV
      </p>
    </footer>
  );
}
