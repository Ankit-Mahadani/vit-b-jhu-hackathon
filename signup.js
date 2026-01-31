// ===============================
// Supabase config
// ===============================
const SUPABASE_URL = "https://nybykqfzuqqzrcdnouim.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YnlrcWZ6dXFxenJjZG5vdWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NzkxODcsImV4cCI6MjA4NTQ1NTE4N30.rIc_nu22Ajqunf4FqV-MVVOmvABHsSBXEW4Sun8bYNI";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ===============================
// Anti-spam cooldown
// ===============================
let locked = false;

// ===============================
// Signup Logic
// ===============================
document.getElementById("signupBtn").addEventListener("click", async () => {

  if (locked) return;
  locked = true;
  setTimeout(() => locked = false, 10000);

  const btn = document.getElementById("signupBtn");
  btn.disabled = true;

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  const message = document.getElementById("status");

  message.style.color = "red";
  message.textContent = "";

  if (!email || !password || !confirm) {
    message.textContent = "Please fill all fields.";
    btn.disabled = false;
    return;
  }

  if (password !== confirm) {
    message.textContent = "Passwords do not match.";
    btn.disabled = false;
    return;
  }

  try {

    const { error } = await supabaseClient.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    message.style.color = "green";
    message.textContent =
      "Signup successful! Confirm email, then login.";

    setTimeout(() => {
      window.location.href = "signin.html";
    }, 2000);

  } catch (err) {
    message.style.color = "red";
    message.textContent = err.message;
  } finally {
    btn.disabled = false;
  }
});
