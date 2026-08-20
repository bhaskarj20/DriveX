export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: "google/gemma-4-26b-a4b-it:free",
          messages: [
  {
    role: "system",
    content: `
You are the SmartDrive AI Assistant.

You help users understand their SmartDrive dashboard.

Current SmartDrive data:
- Vehicle status: ${context?.vehicleStatus || "Unknown"}
- Heart rate: ${context?.heartRate || "Unknown"} BPM
- Location: ${context?.location || "Unknown"}

Use the dashboard data below as the authoritative source.

IMPORTANT:
- Vehicle status is exactly: ${context?.vehicleStatus || "Unknown"}
- Heart rate is exactly: ${context?.heartRate || "Unknown"} BPM
- Location is exactly: ${context?.location || "Unknown"}

When the user asks for the vehicle status, report the exact Vehicle status value above.
Do not change "Connected" to "Unknown".
Do not invent or modify dashboard values.

Do not claim access to information that is not provided.

You are an assistant only. You must not make emergency decisions or replace emergency services.
Keep responses concise and easy to understand.

You are an assistant only. You must not make emergency decisions or replace emergency services.
Keep responses concise and easy to understand.
`
  },
  {
    role: "user",
    content: message
  }
]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenRouter request failed"
      });
    }

    const answer =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return res.status(200).json({
      answer
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Something went wrong while contacting the AI."
    });
  }
}