const SUPABASE_URL = "https://yitjgtkdxfirguuocunt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGpndGtkeGZpcmd1dW9jdW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NTA0NzAsImV4cCI6MjA4NTQyNjQ3MH0.jNm4eTkNDwhWJuewL54HRiggOSwp-29AlFK-qtNS7qw";


const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    status(error.message);
  } else {
    status("Login successful!");
    window.location.href = "dashboard.html";
  }
}

function status(msg) {
  document.getElementById("status").innerText = msg;
}
