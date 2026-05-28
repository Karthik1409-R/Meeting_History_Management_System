const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { generateToken } = require("../utils/auth");

const getEnv = (key) => process.env[key]?.trim();

const getOAuthClient = () => {
  const clientId = getEnv("GOOGLE_CLIENT_ID");
  const clientSecret = getEnv("GOOGLE_CLIENT_SECRET");
  const redirectUri = getEnv("GOOGLE_CALLBACK_URL");

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Google OAuth environment variables are not set");
  }

  return new OAuth2Client(clientId, clientSecret, redirectUri);
};

const getFrontendUrl = () => getEnv("FRONTEND_URL") || "http://localhost:3000";

const getGoogleProfile = async (client, tokens) => {
  if (tokens.id_token) {
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: getEnv("GOOGLE_CLIENT_ID"),
    });

    const payload = ticket.getPayload();

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  }

  if (tokens.access_token) {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Google user profile");
    }

    const data = await response.json();

    return {
      sub: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture,
    };
  }

  throw new Error("No usable tokens returned from Google");
};

const findOrCreateGoogleUser = async (profile) => {
  let user = await User.findOne({
    $or: [{ googleId: profile.sub }, { email: profile.email }],
  });

  if (!user) {
    user = await User.create({
      name: profile.name || profile.email.split("@")[0],
      email: profile.email,
      googleId: profile.sub,
      avatar: profile.picture,
    });
    return user;
  }

  user.googleId = user.googleId || profile.sub;
  if (profile.name) {
    user.name = user.name || profile.name;
  }
  if (profile.picture) {
    user.avatar = profile.picture;
  }

  await user.save();
  return user;
};

exports.googleAuth = (req, res) => {
  try {
    const client = getOAuthClient();
    const url = client.generateAuthUrl({
      access_type: "online",
      scope: ["openid", "email", "profile"],
      prompt: "select_account",
    });

    return res.redirect(url);
  } catch (err) {
    console.error("Google OAuth init error:", err.message);
    return res.status(500).json({
      message:
        err.message ||
        "Google OAuth is not configured. Check backend .env file.",
    });
  }
};

exports.googleCallback = async (req, res) => {
  const frontendUrl = getFrontendUrl();

  try {
    const { code, error } = req.query;

    if (error) {
      return res.redirect(`${frontendUrl}/login?error=oauth_cancelled`);
    }

    if (!code) {
      return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }

    const client = getOAuthClient();
    const { tokens } = await client.getToken({
      code,
      redirect_uri: getEnv("GOOGLE_CALLBACK_URL"),
    });

    const profile = await getGoogleProfile(client, tokens);

    if (!profile?.email) {
      return res.redirect(`${frontendUrl}/login?error=oauth_no_email`);
    }

    const user = await findOrCreateGoogleUser(profile);
    const token = generateToken(user._id);

    return res.redirect(
      `${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`
    );
  } catch (err) {
    console.error("Google OAuth callback error:", err.message);
    return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
};
