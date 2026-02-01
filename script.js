// ===============================
// Supabase config
// ===============================
const SUPABASE_URL = "https://nybykqfzuqqzrcdnouim.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YnlrcWZ6dXFxenJjZG5vdWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NzkxODcsImV4cCI6MjA4NTQ1NTE4N30.rIc_nu22Ajqunf4FqV-MVVOmvABHsSBXEW4Sun8bYNI";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ===============================
// Protect dashboard
// ===============================
async function protectPage() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    window.location.href = "signin.html";
    return;
  }

  showUser(user);
}

// ===============================
// Show user email + initials
// ===============================
function showUser(user) {
  const emailEl = document.getElementById("userEmail");
  const initialsEl = document.getElementById("userInitials");

  const email = user.email;
  const name = user.user_metadata?.name;

  emailEl.textContent = email;

  const source = name || email;
  const initials = source
    .split(/[\s@._]+/)
    .slice(0, 2)
    .map(s => s[0].toUpperCase())
    .join("");

  initialsEl.textContent = initials;
}

// ===============================
// Logout
// ===============================
async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "signin.html";
}

// ===============================
// Init
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  protectPage();

  const logoutBtn = document.getElementById("logoutBtn");
  const trigger = document.getElementById("userTrigger");
  const dropdown = document.getElementById("userDropdown");

  // Logout click
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // 🔽 TOGGLE DROPDOWN (THIS WAS MISSING)
  if (trigger && dropdown) {
    trigger.addEventListener("click", () => {
      dropdown.classList.toggle("show");
    });
  }

  // ❌ Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (
      dropdown &&
      !dropdown.contains(e.target) &&
      !trigger.contains(e.target)
    ) {
      dropdown.classList.remove("show");
    }
  });
});
