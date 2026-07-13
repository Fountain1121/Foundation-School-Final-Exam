const idInput = document.getElementById("studentId");
const enterBtn = document.getElementById("enterBtn");
const errorEl = document.getElementById("loginError");

function setLoading(isLoading) {
  enterBtn.disabled = isLoading;
  enterBtn.textContent = isLoading ? "Checking\u2026" : "Enter Examination";
}

async function tryEnter() {
  errorEl.textContent = "";
  const raw = idInput.value.trim();
  if (!raw) {
    errorEl.textContent = "Please enter your index number.";
    return;
  }
  const studentId = raw.toUpperCase();
  setLoading(true);

  try {
    const { data, error } = await supabaseClient
      .from("allowed_students")
      .select("student_id, full_name, has_submitted")
      .eq("student_id", studentId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      errorEl.textContent = "That index number was not found. Please check it and try again.";
      setLoading(false);
      return;
    }

    if (data.has_submitted) {
      errorEl.textContent = "This index number has already submitted the exam.";
      setLoading(false);
      return;
    }

    sessionStorage.setItem("examStudentId", data.student_id);
    sessionStorage.setItem("examStudentName", data.full_name || "");
    window.location.href = "exam.html";

  } catch (err) {
    console.error(err);
    errorEl.textContent = "Something went wrong verifying your ID. Please check your connection and try again.";
    setLoading(false);
  }
}

enterBtn.addEventListener("click", tryEnter);
idInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryEnter();
});
