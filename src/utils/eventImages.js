
const THEMES = {
  technology: {
    start: "#101827",
    end: "#4f46e5",
    accent: "#a5b4fc",
    symbol: "CODE",
    label: "TECHNOLOGY",
  },
  ai: {
    start: "#101d4a",
    end: "#7c3aed",
    accent: "#67e8f9",
    symbol: "AI",
    label: "FUTURE OF AI",
  },
  workshop: {
    start: "#064e3b",
    end: "#0f766e",
    accent: "#a7f3d0",
    symbol: "LAB",
    label: "WORKSHOP",
  },
  music: {
    start: "#4a044e",
    end: "#be185d",
    accent: "#fbcfe8",
    symbol: "MUSIC",
    label: "LIVE MUSIC",
  },
  conference: {
    start: "#172554",
    end: "#0369a1",
    accent: "#bae6fd",
    symbol: "EVENT",
    label: "CONNECT AND INSPIRE",
  },
};

function detectTheme(event = {}) {
  const text = [
    event.title,
    event.category,
    event.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/music|concert|festival|dj|singing/.test(text)) {
    return THEMES.music;
  }

  if (/artificial intelligence|\bai\b|machine learning|robot/.test(text)) {
    return THEMES.ai;
  }

  if (/workshop|training|bootcamp|learning/.test(text)) {
    return THEMES.workshop;
  }

  if (/technology|tech|coding|developer|software|programming|java/.test(text)) {
    return THEMES.technology;
  }

  return THEMES.conference;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function getBuiltInEventImage(event = {}) {
  const theme = detectTheme(event);
  const title = escapeXml(
    String(event.title || theme.label).slice(0, 42)
  );
  const symbol = escapeXml(theme.symbol);
  const label = escapeXml(theme.label);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="800" height="500" viewBox="0 0 800 500">
      <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${theme.start}"/>
          <stop offset="100%" stop-color="${theme.end}"/>
        </linearGradient>
      </defs>

      <rect width="800" height="500" fill="url(#background)"/>

      <circle cx="630" cy="175" r="170"
              fill="${theme.accent}" opacity=".10"/>
      <circle cx="630" cy="175" r="120"
              fill="${theme.accent}" opacity=".10"/>
      <circle cx="630" cy="175" r="70"
              fill="${theme.accent}" opacity=".12"/>

      <rect x="55" y="48" width="130" height="36" rx="18"
            fill="#ffffff" opacity=".18"/>

      <text x="120" y="71" text-anchor="middle"
            font-family="Arial,sans-serif" font-size="14"
            font-weight="bold" fill="#ffffff">EVENTLY</text>

      <text x="55" y="235"
            font-family="Arial,sans-serif" font-size="58"
            font-weight="bold" fill="#ffffff">${symbol}</text>

      <text x="55" y="292"
            font-family="Arial,sans-serif" font-size="27"
            font-weight="bold" fill="#ffffff">${title}</text>

      <rect x="55" y="318" width="85" height="5" rx="2.5"
            fill="${theme.accent}"/>

      <text x="55" y="360"
            font-family="Arial,sans-serif" font-size="16"
            font-weight="bold" fill="${theme.accent}">${label}</text>

      <text x="55" y="445"
            font-family="Arial,sans-serif" font-size="13"
            letter-spacing="2" fill="#ffffff">
        DISCOVER · EXPERIENCE · CONNECT
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
