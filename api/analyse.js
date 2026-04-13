export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    console.log("API Key exists:", !!process.env.ANTHROPIC_KEY);
    console.log("API Key starts with:", process.env.ANTHROPIC_KEY?.substring(0, 10));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log("Anthropic status:", response.status);
    console.log("Anthropic response type:", data.type);
    if (data.type === "error") {
      console.log("Anthropic error:", JSON.stringify(data.error));
    }

    res.status(200).json(data);
  } catch (err) {
    console.log("Catch error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
