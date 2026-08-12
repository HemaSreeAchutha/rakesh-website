const express = require("express");
const router = express.Router();
const { oauth2Client } = require("../config/google");

// Visit this once in your browser to authorise
router.get("/auth", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // forces a refresh_token to be returned
    scope: ["https://www.googleapis.com/auth/calendar.events"],
  });
  res.redirect(url);
});

router.get("/callback", async (req, res) => {
  try {
    const { tokens } = await oauth2Client.getToken(req.query.code);
    console.log("\n=== COPY THIS INTO server/.env ===");
    console.log("GOOGLE_REFRESH_TOKEN=" + tokens.refresh_token);
    console.log("==================================\n");
    res.send(
      "Authorised. Check your server terminal for the refresh token, paste it into .env, then restart the server."
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).send("Authorisation failed. Check the server logs.");
  }
});

module.exports = router;