import { useState } from "react";

function AIAssistant({ vehicleStatus, heartRate, location }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I'm the SmartDrive Assistant. How can I help you?"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim() || loading) return;

    const userQuestion = question.trim();

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userQuestion
      }
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
  message: userQuestion,
  context: {
    vehicleStatus,
    heartRate,
    location
  }
})
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.answer
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `AI Error: ${error.message}`
        }
      ]);

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h2>🤖 SmartDrive Assistant</h2>
        <span>AI</span>
      </div>

      <div className="ai-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`ai-message ${message.sender}`}
          >
            {message.text}
          </div>
        ))}

        {loading && (
          <div className="ai-message ai">
            Thinking... 🤔
          </div>
        )}
      </div>

      <div className="ai-input">
        <input
          type="text"
          placeholder="Ask something..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />

        <button onClick={handleSend} disabled={loading}>
          {loading ? "..." : "➤"}
        </button>
      </div>
    </div>
  );
}

export default AIAssistant;