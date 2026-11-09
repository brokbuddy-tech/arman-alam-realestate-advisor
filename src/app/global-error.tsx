"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", background: "#F6F6F4", textAlign: "center", padding: "10vh 24px" }}>
        <h1>Broker profile unavailable</h1>
        <p>We couldn’t load this broker’s public profile and listings. Please try again later.</p>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
