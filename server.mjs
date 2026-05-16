import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "openai";
import dotnev from "dotenv";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import admin from "firebase-admin";

import serviceAccount from "./js/hands-on-a642f-firebase-adminsdk-fbsvc-a30a3d889e.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hands-on-a642f-default-rtdb.firebaseio.com",
});

console.log(serviceAccount.project_id);
console.log(serviceAccount.client_email);
console.log(serviceAccount.private_key?.slice(0, 40));

const db = admin.database();
export { db };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 3000;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/style.css", (req, res) => {
  res.sendFile(__dirname + "/css/style.css");
});

app.get("/script.js", (req, res) => {
  res.sendFile(__dirname + "/js/script.js");
});

app.get("/font-awesome.min.css", (req, res) => {
  res.sendFile(__dirname + "/css/font-awesome.min.css");
});

app.get("/bootstrap.css", (req, res) => {
  res.sendFile(__dirname + "/css/bootstrap.css");
});

app.get("/hero-bg.png", (req, res) => {
  res.sendFile(__dirname + "/images/hero-bg.png");
});

app.get("/slider-img.png", (req, res) => {
  res.sendFile(__dirname + "/images/slider-img.png");
});

app.get("/slider-img1.png", (req, res) => {
  res.sendFile(__dirname + "/images/slider-img1.png");
});

app.get("/slider-img2.png", (req, res) => {
  res.sendFile(__dirname + "/images/slider-img2.png");
});

app.get("/w1.png", (req, res) => {
  res.sendFile(__dirname + "/images/w1.png");
});

app.get("/w2.png", (req, res) => {
  res.sendFile(__dirname + "/images/w2.png");
});

app.get("/jquery-3.4.1.min.js", (req, res) => {
  res.sendFile(__dirname + "/js/jquery-3.4.1.min.js");
});

app.get("/bootstrap.js", (req, res) => {
  res.sendFile(__dirname + "/js/bootstrap.js");
});

app.get("custom.js", (req, res) => {
  res.sendFile(__dirname + "/js/custom.js");
});

app.get("/auth", (req, res) => {
  res.sendFile(__dirname + "/auth.html");
});

app.get("/auth.css", (req, res) => {
  res.sendFile(__dirname + "/css/auth.css");
});

app.get("/auth.js", (req, res) => {
  res.sendFile(__dirname + "/js/auth.js");
});

app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/dashboard.html");
});

app.get("/dashboard.css", (req, res) => {
  res.sendFile(__dirname + "/css/dashboard.css");
});

app.get("/responsive.css", (req, res) => {
  res.sendFile(__dirname + "/css/responsive.css");
});

app.get("/dashboard.js", (req, res) => {
  res.sendFile(__dirname + "/js/dashboard.js");
});

app.get("/fonts/fontawesome-webfont.woff2?v=4.7.0", (req, res) => {
  res.sendFile(__dirname + "/fonts/fontawesome-webfont.woff2?v=4.7.0");
});

app.get("/fonts/fontawesome-webfont.woff?v=4.7.0", (req, res) => {
  res.sendFile(__dirname + "/fonts/fontawesome-webfont.woff?v=4.7.0");
});

app.get("/fonts/fontawesome-webfont.ttf?v=4.7.0", (req, res) => {
  res.sendFile(__dirname + "/fonts/fontawesome-webfont.ttf?v=4.7.0");
});

app.get("/logo.png", (req, res) => {
  res.sendFile(__dirname + "/images/logo.png");
});

app.get("/workflow.png", (req, res) => {
  res.sendFile(__dirname + "/images/Server-Photoroom.png");
});

app.get("/product-idea.png", (req, res) => {
  res.sendFile(__dirname + "/images/product-idea.png");
});

app.get("/pitch-vid", (req, res) => {
  res.sendFile(__dirname + "/images/Mesa-vid.mp4");
});

app.post("/sign-act", async (req, res) => {
  const { username, password, classOpt, email } = req.body;
  try {
    await db.ref("users").push({ username, password, classOpt, email }); // Use await to ensure it's completed
    console.log("User added✅");
    res.status(200).send("User added✅");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding user"); // Ensure an error response is sent only once
  }
});

app.post("/login-auth", async (req, res) => {
  const { username, password } = req.body;
  try {
    const usersRef = db.ref("users");
    const snapshot = await usersRef.once("value"); // ✅ Fetch data only once
    const users = snapshot.val();

    const user = users
      ? Object.values(users).find(
          (user) => user.username === username && user.password === password,
        )
      : null;

    if (user) {
      return res.status(200).send("Login successful!");
    } else {
      return res.status(401).send("Invalid email or password");
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/idea", (req, res) => {
  res.sendFile(__dirname + "/idea.html");
});

app.get("/idea.css", (req, res) => {
  res.sendFile(__dirname + "/css/idea.css");
});

app.get("/idea.js", (req, res) => {
  res.sendFile(__dirname + "/js/idea.js");
});

app.listen(port, () => {
  console.log(`Website listening on port http://localhost:${port}`);
});

// -------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------------

async function Phitxt(userPrompt) {
  const token = process.env["GITHUB_TOKEN"]; // Load the token from .env
  const endpoint = "https://models.inference.ai.azure.com";
  const modelName = "Phi-4-multimodal-instruct";

  if (!token) {
    throw new Error(
      "GitHub Token is missing. Please set GITHUB_TOKEN in .env file.",
    );
  }

  const client = new ModelClient(endpoint, new AzureKeyCredential(token));

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [{ role: "user", content: `${userPrompt}` }],
      temperature: 0.1,
      top_p: 1.0,
      max_tokens: 1000,
      model: modelName,
    },
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  // console.log(response.body.choices[0].message.content);
  return response.body.choices[0].message.content;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
async function finalAI(userPrompt, responseGemini, responsephi) {
  try {
    const token = process.env["GITHUB_TOKEN"];
    const endpoint = "https://models.inference.ai.azure.com";
    const modelName = "gpt-4o-mini";

    if (!token || !endpoint) {
      throw new Error(
        "Missing Azure OpenAI credentials. Check your .env file.",
      );
    }

    const client = ModelClient(endpoint, new AzureKeyCredential(token));

    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: `Which of the following best suits for the prompt ${userPrompt}
           ${responsephi}
           pls do not add any of your text or other txt just the response and i strictly repeat do not add any text `,
          },
        ],
        temperature: 0.1,
        top_p: 1.0,
        max_tokens: 1000,
        model: modelName,
      },
    });

    if (isUnexpected(response)) {
      throw response.body.error;
    }

    // console.log(response.body.choices[0].message.content);
    return response.body.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
}

// --------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/get-ai-txt", async (req, res) => {
  const { userPrompt } = req.body;
  try {
    const responsephi = await Phitxt(userPrompt);
    const responseFinal = await finalAI(userPrompt, responsephi);
    // console.log(`GEMINI RESPONSE: ${responseGemini}`);
    // console.log(`PHI RESPONSE: ${responsephi}`);
    console.log(`FINAL RESPONSE: ${responseFinal}`);
    let formattedResponse = responseFinal.replace(
      /\*\*(.*?)\*\*/g,
      "<b>$1</b>",
    );

    formattedResponse = formattedResponse.replace(/\n/g, "<br><br>");
    res.status(200).send(formattedResponse);
  } catch (err) {
    console.log(err);
  }
});
