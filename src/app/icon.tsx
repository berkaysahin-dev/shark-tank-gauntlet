import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          color: "#000000",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
        }}
      >
        b
        <span style={{ color: "#0071e3", marginLeft: 0 }}>.</span>
      </div>
    ),
    { ...size }
  );
}
