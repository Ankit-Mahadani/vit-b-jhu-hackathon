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
// Location Helper
// ===============================
function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      reject
    );
  });
}

// ===============================
// Symptom Checker (PHASE 1 MOCK)
// ===============================
async function runSymptomCheck(symptoms) {
  if (!symptoms.trim()) return;

  // 🔒 Phase-1 mock response (NO backend)
  const data = {
    severity: "HIGH",
    recommendations: [
      "Call emergency services immediately",
      "Share your live location",
      "Remain calm and avoid sudden movement"
    ]
  };

  // Update severity UI
  const statusEl = document.querySelector(".gauge .status");
  statusEl.textContent = data.severity;

  statusEl.style.color =
    data.severity === "HIGH" ? "#E53E3E" :
    data.severity === "MEDIUM" ? "#D69E2E" :
    "#38A169";

  // Update AI recommendations
  const list = document.querySelector(".ai-card ul");
  list.innerHTML = "";

  data.recommendations.forEach((rec, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${rec}`;
    list.appendChild(li);
  });
}

// ===============================
// Init
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  protectPage();

  const logoutBtn = document.getElementById("logoutBtn");
  const trigger = document.getElementById("userTrigger");
  const dropdown = document.getElementById("userDropdown");

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // Dropdown toggle
  if (trigger && dropdown) {
    trigger.addEventListener("click", () => {
      dropdown.classList.toggle("show");
    });
  }

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (
      dropdown &&
      !dropdown.contains(e.target) &&
      !trigger.contains(e.target)
    ) {
      dropdown.classList.remove("show");
    }
  });

  // Symptom input
  const symptomInput = document.querySelector(".symptom-input input");
  if (symptomInput) {
    symptomInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        runSymptomCheck(e.target.value);
      }
    });
  }

  // SOS button
  const sosBtn = document.querySelector(".sos-btn");
  if (sosBtn) {
    sosBtn.addEventListener("click", async () => {
      try {
        await getUserLocation();
        alert("SOS sent. Location shared successfully.");
      } catch {
        alert("Location permission is required for SOS.");
      }
    });
  }
}); 