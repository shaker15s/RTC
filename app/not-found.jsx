export default function NotFound() {
  return (
    <main className="content-section" style={{ padding: '120px 60px', textAlign: 'center' }}>
      <h1 className="main-title">404 — Page not found.</h1>
      <p className="main-title__sub" style={{ marginTop: 12, marginBottom: 28 }}>
        This path is not part of Resala Training Center — Nasr City.
      </p>
      <a href="/" className="apply-cta__btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
        Back to home
      </a>
    </main>
  );
}
