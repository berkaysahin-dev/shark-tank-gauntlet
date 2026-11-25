import { ImageResponse } from "next/og";

export const alt = "The Gauntlet — gauntlet.berkaysahin.net";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "sans-serif",
          color: "#fafafa",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#2997ff",
            }}
          />
          <span
            style={{
              fontSize: "18px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#a1a1aa",
            }}
          >
            gauntlet.berkaysahin.net
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            The Gauntlet
          </h1>
          <p
            style={{
              fontSize: "28px",
              color: "#a1a1aa",
              margin: 0,
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            Adversarial Founder Arena · Test Your Startup Pitch Against 5 Judges
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "30px",
            fontSize: "20px",
            color: "#71717a",
          }}
        >
          <span>Berkay ŞAHİN</span>
          <span>berkaysahin.net</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
