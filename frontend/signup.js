const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_KEY";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function signup() {

  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if (password !== confirm) {
    return status("Passwords do not match");
  }

  const { data, error } = await supabase.auth.signUp({
    email: document.getElementById("email").value,
    password
  });

  if (error) return status(error.message);

  const user = data.user;

  // store medical profile
  await supabase.from("profiles").insert({
    id: user.id,
    name: document.getElementById("name").value,
    dob: document.getElementById("dob").value,
    blood: document.getElementById("blood").value,
    allergy: document.getElementById("allergy").value,
    condition: document.getElementById("condition").value,
    emergency: document.getElementById("emergency").value
  });

  status("Account created! Check email to verify.");
}

function status(msg){
  document.getElementById("status").innerText = msg;
}
