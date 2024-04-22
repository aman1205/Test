const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { advancedSchema } = require("./index");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_URL_PROD = process.env.DATABASE_URL_PROD;
const SECRET_KEY = process.env.SECRET_KEY;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("MongoDB is Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const formDataSchema = new mongoose.Schema({
  username: String,
  gender: String,
  acceptedTos: Boolean,
  studentNo: String,
  section: String,
  phoneNumber: String,
  emailAddress: { type: String, unique: true },
  scholarType: String,
  referenceNumber: String,
  captcha: String,
});
const FormData = mongoose.model("FormData", formDataSchema);

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

app.post("/api/submit-form", async (req, res) => {
  try {
    await advancedSchema.validate(req.body, { abortEarly: false });

    // Omit captcha field from formData
    const { captcha, ...formDataWithoutCaptcha } = req.body;

    const recaptchaValue = captcha;

    const { data: captchaResult } = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${recaptchaValue}`
    );

    if (captchaResult.success) {
      // Save form data without captcha
      const formData = new FormData(formDataWithoutCaptcha);
      await formData.save();

      const mailOptions = {
        from: EMAIL_USER,
        to: formDataWithoutCaptcha.emailAddress, // Use email address from formDataWithoutCaptcha
        subject: "Confirmation Email",
        text: `Thank you, ${formDataWithoutCaptcha.username}, for Registering in the event Beyond Binary!`,
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({ message: "Form data saved successfully" });
    } else {
      res.status(401).json({ message: "Please verify Captcha first" });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = error.inner.map((err) => ({ [err.path]: err.message }));
      res.status(400).json({ message: "Validation Error", errors });
    } else if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.emailAddress
    ) {
      res
        .status(400)
        .json({ message: "Email address is already registered" });
    } else {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});


app.get('/aman/studs' , async(req, res)=>{
  const formDataList = await FormData.find({}, { _id: 0, __v: 0 }).lean();    
  res.status(200).json(formDataList)
})

app.get("/download-csv", async (req, res) => {
  try {
    const formDataList = await FormData.find({}, { _id: 0, __v: 0 }).lean();
    const csvData = formDataList.map((formData) =>
      Object.values(formData).join(",")
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="formData.csv"'
    );

    res.send(csvData.join("\n"));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
