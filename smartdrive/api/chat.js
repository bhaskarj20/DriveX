export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
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

Use the dashboard data above as the authoritative source.

IMPORTANT:
- Report the exact values provided.
- Do not invent dashboard information.
- Do not modify dashboard values.
- Do not claim access to information that is not provided.
- You are an assistant only.
- You must not make emergency decisions or replace emergency services.

Keep responses concise and easy to understand.
`,
            },

            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    // Read the response as text first
    const responseText = await response.text();

    console.log("OpenRouter status:", response.status);
    console.log("OpenRouter response:", responseText);

    // Make sure we actually received something
    if (!responseText) {
      return res.status(502).json({
        error: "OpenRouter returned an empty response.",
      });
    }

    let data;

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Invalid JSON from OpenRouter:", responseText);

      return res.status(502).json({
        error: "OpenRouter returned an invalid response.",
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "OpenRouter request failed.",
      });
    }

    const answer =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return res.status(200).json({
      answer,
    });

  } catch (error) {
    console.error("AI API error:", error);

    return res.status(500).json({
      error: "Something went wrong while contacting the AI.",
    });
  }
}