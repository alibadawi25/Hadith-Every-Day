import React from "react";

function HadithItem({ content, lang = "ltr" }) {
  if (
    content &&
    typeof content === "object" &&
    ("narrator" in content || "text" in content)
  ) {
    return (
      <div style={{ marginBottom: "1.5rem", direction: lang }}>
        {content.narrator && (
          <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
            {content.narrator}
          </div>
        )}
        {content.text && (
          <div style={{ whiteSpace: "pre-wrap" }}>{content.text}</div>
        )}
      </div>
    );
  }

  if (typeof content === "object") {
    const textContent = Object.values(content).join(" ");
    return (
      <div
        style={{
          whiteSpace: "pre-wrap",
          direction: lang,
          marginBottom: "1.5rem",
        }}
      >
        {textContent}
      </div>
    );
  }

  return (
    <div
      style={{
        whiteSpace: "pre-wrap",
        direction: lang,
        marginBottom: "1.5rem",
      }}
    >
      {content}
    </div>
  );
}

export default HadithItem;
