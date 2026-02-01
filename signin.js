const SUPABASE_URL = "https://nybykqfzuqqzrcdnouim.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YnlrcWZ6dXFxenJjZG5vdWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NzkxODcsImV4cCI6MjA4NTQ1NTE4N30.rIc_nu22Ajqunf4FqV-MVVOmvABHsSBXEW4Sun8bYNI";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ===============================
// LOGIN
// ===============================
window.login = async function login() {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const statusEl = document.getElementById("status");

  statusEl.style.color = "red";
  statusEl.textContent = "";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  // Email confirmation check
  if (error) {
    if (error.message.toLowerCase().includes("confirm")) {
      statusEl.textContent =
        "⚠ Please confirm your email first. Check inbox or spam folder.";
    } else {
      statusEl.textContent = error.message;
    }
    return;
  }

  const user = data.user;

  // Insert profile safely AFTER login
  const { error: profileError } = await supabaseClient
    .from("profiles")
    .upsert({ id: user.id }, { onConflict: "id" });

  if (profileError) {
    console.warn("Profile insert skipped:", profileError.message);
  }

  statusEl.style.color = "green";
  statusEl.textContent = "Login successful!";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
};

// ===============================
// FORGOT PASSWORD
// ===============================
window.forgotPassword = async function forgotPassword() {

  const email = document.getElementById("email").value.trim();
  const statusEl = document.getElementById("status");

  statusEl.style.color = "red";
  statusEl.textContent = "";

  if (!email) {
    statusEl.textContent = "Enter your email first.";
    return;
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/signin.html"
  });

  if (error) {
    statusEl.textContent = error.message;
    return;
  }

  statusEl.style.color = "green";
  statusEl.textContent =
    "Password reset email sent. Check inbox/spam.";
};
