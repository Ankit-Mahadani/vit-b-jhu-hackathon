const SUPABASE_URL = "https://yitjgtkdxfirguuocunt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGpndGtkeGZpcmd1dW9jdW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NTA0NzAsImV4cCI6MjA4NTQyNjQ3MH0.jNm4eTkNDwhWJuewL54HRiggOSwp-29AlFK-qtNS7qw";

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

window.signup = async function signup() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if (password !== confirm) {
    return status("Passwords do not match");
  }

  // Step 1: signup
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) return status(error.message);

  // Step 2: login immediately
  const { data: loginData, error: loginError } =
    await supabaseClient.auth.signInWithPassword({ email, password });

  if (loginError) {
    return status("Check email verification first.");
  }

  const user = loginData.user;

  // Step 3: insert profile
  const { error: profileError } = await supabaseClient
    .from("profiles")
    .insert({
      id: user.id,
      name: document.getElementById("name").value,
      dob: document.getElementById("dob").value,
      blood: document.getElementById("blood").value,
      allergy: document.getElementById("allergy").value,
      condition: document.getElementById("condition").value,
      emergency: document.getElementById("emergency").value
    });

  if (profileError) return status(profileError.message);

  status("Account created successfully!");
}

function status(msg){
  document.getElementById("status").innerText = msg;
}
