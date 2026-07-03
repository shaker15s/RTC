'use client';

export default function Error({ error, reset }) {
  return (
    <main className="content-section" style={{ padding: '120px 60px', textAlign: 'center' }}>
      <h1 className="main-title">Something went wrong.</h1>
      <p className="main-title__sub" style={{ marginTop: 12, marginBottom: 28 }}>
        {error?.message || 'Unexpected error'}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="apply-cta__btn"
        style={{ cursor: 'pointer', border: 'none' }}
      >
        Try again
      </button>
    </main>
  );
}
