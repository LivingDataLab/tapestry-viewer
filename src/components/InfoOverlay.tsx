interface LocationData {
  city: string;
  latitude: number;
  longitude: number;
  distanceToDetroit: number;
}

interface InfoOverlayProps {
  data: LocationData;
}

const InfoOverlay = ({ data }: InfoOverlayProps) => {
  const latDir = data.latitude >= 0 ? "N" : "S";
  const lonDir = data.longitude <= 0 ? "W" : "E";
  const latDisplay = Math.abs(data.latitude).toFixed(2);
  const lonDisplay = Math.abs(data.longitude).toFixed(2);
  const distDisplay = data.distanceToDetroit.toFixed(2);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {/* Top info bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* City name area with rounded top */}
        <div
          style={{
            background: "#000",
            borderRadius: "0 0 0 0",
            padding: "30px 100px 10px",
            position: "relative",
          }}
        >
          {/* Rounded top cap */}
          <div
            style={{
              position: "absolute",
              top: "-70px",
              left: "0",
              right: "0",
              height: "80px",
              background: "#000",
              borderRadius: "20px 20px 0 0",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "78px",
              color: "hsl(var(--foreground))",
              position: "relative",
              zIndex: 1,
              whiteSpace: "nowrap",
            }}
          >
            {data.city}
          </span>
        </div>

        {/* Bottom tabs: lat/long left, distance right */}
        <div style={{ display: "flex", width: "100%" }}>
          {/* Left tab - coordinates */}
          <div
            style={{
              background: "var(--info-bar-left)",
              padding: "12px 40px",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "29px",
                color: "hsl(var(--foreground))",
              }}
            >
              {latDisplay}°{latDir}, {lonDisplay}°{lonDir}
            </span>
          </div>
          {/* Right tab - distance */}
          <div
            style={{
              background: "var(--info-bar-right)",
              padding: "12px 40px",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "29px",
                color: "hsl(var(--foreground))",
              }}
            >
              {distDisplay} miles to Detroit
            </span>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "17%",
          background: "var(--bottom-fade)",
        }}
      />
    </div>
  );
};

export default InfoOverlay;
export type { LocationData };
