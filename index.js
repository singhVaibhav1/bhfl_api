const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const FULL_NAME = "kumar_vaibhav";           
const DOB_DDMMYYYY = "12122003";      
const EMAIL = "vaibhav@xyz.com";
const ROLL = "ABCD123";

function isIntegerString(s) 
{
  if (typeof s !== "string") return false;
  return /^-?\d+$/.test(s.trim());
}

function isAlphaString(s) 
{
  if (typeof s !== "string") return false;
  return /^[A-Za-z]+$/.test(s.trim());
}

function buildAlternatingCapsConcat(allTokens) 
{
  const letters = [];
  for (const tok of allTokens) {
    const str = String(tok);
    for (const ch of str) {
      if (/[A-Za-z]/.test(ch)) letters.push(ch);
    }
  }
  letters.reverse(); // reverse overall

  return letters
    .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

app.post("/bfhl", (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !Array.isArray(payload.data)) {
      return res.status(200).json({
        is_success: false,
        user_id: `${FULL_NAME}_${DOB_DDMMYYYY}`,
        email: EMAIL,
        roll_number: ROLL,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: "",
        message: "Invalid input. Expected JSON with 'data': [ ... ]"
      });
    }

    const data = payload.data.map(String);

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];

    let sum = 0;

    for (const tok of data) {
      if (isIntegerString(tok)) 
    {
        const num = parseInt(tok, 10);
        sum += num;
        if (Math.abs(num) % 2 === 0) {
          even_numbers.push(tok);
        } else {
          odd_numbers.push(tok);
        }
      } else if (isAlphaString(tok)) {
        alphabets.push(tok.toUpperCase());
      } else {
        special_characters.push(tok);
      }
    }

    const concat_string = buildAlternatingCapsConcat(data);

    return res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME}_${DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    });
  } catch (err) {
    return res.status(200).json({
      is_success: false,
      user_id: `${FULL_NAME}_${DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      message: "Something went wrong while processing the request."
    });
  }
});

app.get("/bfhl", (req, res) => {
  res.json({message:"BFHL endpoint working!"});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
