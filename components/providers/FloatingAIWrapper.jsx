import React from "react";

export default function FloatingAIWrapper() {
  // ... existing state ...

  const formatResponse = (text) => {
    return text.split("\n").map((line, i) => {
      // Handle bullet points
      if (line.trim().startsWith("•")) {
        return (
          <li key={i} className="ml-4">
            {line.substring(1)}
          </li>
        );
      }
      // Handle numbered points
      if (/^\d+\./.test(line)) {
        return (
          <li key={i} className="ml-4">
            {line}
          </li>
        );
      }
      // Handle sections
      if (line.trim().length > 0) {
        return (
          <p key={i} className="mb-2">
            {line}
          </p>
        );
      }
      return null;
    });
  };

  return (
    <div className="...">
      {/* ... other UI elements ... */}
      <div className="messages">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.role === "assistant" ? (
              <div className="prose max-w-none">
                {formatResponse(msg.content)}
              </div>
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))}
      </div>
      {/* ... rest of the component ... */}
    </div>
  );
}
