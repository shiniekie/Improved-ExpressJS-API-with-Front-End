const BASE_URL = "http://127.0.0.1:3000";

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const nodemailer = require("nodemailer");

const db = require("./config/db");

const app = express();
const SECRET_KEY = "securekey";

app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

/* ================= EMAIL ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shiniekie@gmail.com", // FIXED
    pass: "jxvwjdtubtobqmvd"
  }
});

/* ================= TOKEN ================= */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success:false, message:"No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success:false, message:"Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

/* ================= REGISTER ================= */
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success:false, message:"All fields required" });
  }

  db.query("SELECT * FROM users WHERE email=?", [email], (err, results) => {
    if (results.length > 0) {
      return res.json({ success:false, message:"Email already exists" });
    }

    bcrypt.hash(password, 10, (err, hashed) => {
      if (err) {
        return res.json({ success:false });
      }

      db.query(
        "INSERT INTO users (name,email,password,is_verified) VALUES (?,?,?,1)",
        [name, email, hashed],
        (err2) => {
          if (err2) {
            return res.json({ success:false });
          }
          res.json({ success:true, message:"Registered successfully" });
        }
      );
    });
  });
});

/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, r) => {
    if (r.length === 0)
      return res.json({ success:false, message:"User not found" });

    const user = r[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.json({ success:false, message:"Wrong password" });

    const loginToken = Math.random().toString(36).substring(2);

    db.query("UPDATE users SET login_token=? WHERE id=?", [loginToken, user.id]);

    const link = `${BASE_URL}/verify-login/${loginToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Login Authorization",
      html: `<a href="${link}">Click to Login</a>`
    });

    res.json({ success:true, message:"Check email to login" });
  });
});

/* ================= VERIFY LOGIN ================= */
app.get("/verify-login/:token", (req, res) => {
  db.query("SELECT * FROM users WHERE login_token=?", [req.params.token], (err, r) => {
    if (r.length === 0) return res.send("Invalid link");

    const user = r[0];
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);

    res.redirect(`${BASE_URL}/?token=${token}`);
  });
});

/* ================= FORGOT PASSWORD ================= */
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, r) => {
    if (r.length === 0)
      return res.json({ success:false, message:"Email not found" });

    const token = Math.random().toString(36).substring(2);

    db.query("UPDATE users SET reset_token=? WHERE email=?", [token, email]);

    const link = `${BASE_URL}/reset-password/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: `<a href="${link}">Reset Password</a>`
    });

    res.json({ success:true, message:"Check email" });
  });
});

/* ================= RESET PASSWORD ================= */
app.get("/reset-password/:token", (req, res) => {
  res.send(`
    <form method="POST">
      <input name="password" type="password" required/>
      <button type="submit">Reset</button>
    </form>
  `);
});

app.post("/reset-password/:token", (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hashed) => {
    db.query(
      "UPDATE users SET password=?, reset_token=NULL WHERE reset_token=?",
      [hashed, req.params.token],
      (err, result) => {
        if (result.affectedRows === 0) {
          return res.send("Invalid link");
        }
        res.send("Password updated");
      }
    );
  });
});

/* ================= CRUD ================= */
app.get("/accounts", verifyToken, (req, res) => {
  db.query("SELECT * FROM accounts", (err, results) => {
    res.json(results || []);
  });
});

app.post("/accounts", verifyToken, upload.single("image"), (req, res) => {
  const { site, username, password } = req.body;

  db.query(
    "INSERT INTO accounts (site, username, password, image) VALUES (?,?,?,?)",
    [site, username, password, req.file ? req.file.filename : null],
    () => res.json({ success:true })
  );
});

app.put("/accounts/:id", verifyToken, upload.single("image"), (req, res) => {
  const { site, username, password } = req.body;

  const image = req.file ? req.file.filename : null;

  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  let query = "";
  let params = [];

  if(image){
    // ✅ Update WITH image
    query = "UPDATE accounts SET site=?, username=?, password=?, image=? WHERE id=?";
    params = [site, username, password, image, req.params.id];
  } else {
    // ✅ Update WITHOUT changing image
    query = "UPDATE accounts SET site=?, username=?, password=? WHERE id=?";
    params = [site, username, password, req.params.id];
  }

  db.query(query, params, (err, result) => {
    if(err){
      console.log(err);
      return res.json({ success:false });
    }

    if(result.affectedRows === 0){
      return res.json({ success:false, message:"No changes made" });
    }

    res.json({ success:true });
  });
});
app.delete("/accounts/:id", verifyToken, (req, res) => {
  db.query("DELETE FROM accounts WHERE id=?", [req.params.id], () => {
    res.json({ success:true });
  });
});

/* ================= LOGOUT ================= */
app.post("/logout", verifyToken, async (req, res) => {
  const token = Math.random().toString(36).substring(2);

  db.query("UPDATE users SET logout_token=? WHERE id=?", [token, req.user.id]);

  const link = `${BASE_URL}/verify-logout/${token}`;

  await transporter.sendMail({
    to: req.user.email,
    subject: "Logout Authorization",
    html: `<a href="${link}">Click to Logout</a>`
  });

  res.json({ success:true, message:"Check email to confirm logout" });
});

/* ================= VERIFY LOGOUT ================= */
app.get("/verify-logout/:token", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE logout_token=?",
    [req.params.token],
    (err, r) => {

      if(err) return res.send("Server error");

      if (r.length === 0) return res.send("Invalid logout link");

      db.query(
        "UPDATE users SET logout_token=NULL WHERE id=?",
        [r[0].id], // ✅ FIXED (array)
        (err2) => {

          if(err2) return res.send("Logout failed");

          res.send("Logout successful. You can close this tab.");
        }
      );
    }
  );
});
  //  PROFILE ROUTE HERE
app.put("/profile", verifyToken, upload.single("image"), (req, res) => {
  const { name, email } = req.body;

  let query, params;

  if(req.file){
    query = "UPDATE users SET name=?, email=?, profile_pic=? WHERE id=?";
    params = [name, email, req.file.filename, req.user.id];
  } else {
    query = "UPDATE users SET name=?, email=? WHERE id=?";
    params = [name, email, req.user.id];
  }

  db.query(query, params, (err) => {
    if(err) return res.json({ success:false });
    res.json({ success:true });
  });

}); 

app.get("/profile", verifyToken, (req, res) => {
  db.query("SELECT name, email, profile_pic FROM users WHERE id=?", 
  [req.user.id], 
  (err, result) => {

    if(err) return res.json({ success:false });

    res.json({ success:true, user: result[0] });
  });
});
/* ================= START SERVER ================= */
app.listen(3000, () => console.log("Server running on port 3000"));