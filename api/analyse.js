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

  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
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

      if (response.status === 529 && attempt < maxRetries) {
        console.log("Overloaded, retry", attempt);
        await new Promise(r => setTimeout(r, 2000 * attempt));
        continue;
      }

      res.status(200).json(data);
      return;
    } catch (err) {
      if (attempt === maxRetries) {
        res.status(500).json({ error: err.message });
        return;
      }
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}
