const gatePage = document.getElementById("gatePage");
const dashboardPage = document.getElementById("dashboardPage");
const passInput = document.getElementById("passInput");
const gateBtn = document.getElementById("gateBtn");
const gateError = document.getElementById("gateError");
const subList = document.getElementById("subList");
const countPill = document.getElementById("countPill");
const detailOverlay = document.getElementById("detailOverlay");
const detailBody = document.getElementById("detailBody");

let submissions = [];

function enterDashboard() {
  if (passInput.value !== ADMIN_PASSCODE) {
    gateError.textContent = "Incorrect passcode.";
    return;
  }
  gatePage.style.display = "none";
  dashboardPage.style.display = "block";
  loadSubmissions();
}

gateBtn.addEventListener("click", enterDashboard);
passInput.addEventListener("keydown", (e) => { if (e.key === "Enter") enterDashboard(); });

async function loadSubmissions() {
  countPill.textContent = "Loading\u2026";
  subList.innerHTML = "";
  const { data, error } = await supabaseClient
    .from("submissions")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    countPill.textContent = "Could not load";
    subList.innerHTML = `<p class="center-note">Could not load submissions. Check your Supabase config and RLS policies.</p>`;
    console.error(error);
    return;
  }

  submissions = data || [];
  countPill.textContent = `${submissions.length} submission${submissions.length === 1 ? "" : "s"}`;

  if (submissions.length === 0) {
    subList.innerHTML = `<p class="center-note">No submissions yet.</p>`;
    return;
  }

  submissions.forEach((sub) => {
    const row = document.createElement("div");
    row.className = "sub-row";
    const when = sub.submitted_at ? new Date(sub.submitted_at).toLocaleString() : "";
    const graded = sub.graded ? `<span class="stat-pill">Marked${sub.marks_awarded != null ? ": " + sub.marks_awarded : ""}</span>` : "";
    row.innerHTML = `
      <span class="sid">${sub.student_id}</span>
      <span class="sname">${sub.full_name || ""}</span>
      ${graded}
      <span class="sdate">${when}</span>
      <span class="chevron">&rarr;</span>
    `;
    row.addEventListener("click", () => openDetail(sub));
    subList.appendChild(row);
  });
}

function renderAnswerLine(qNum, questionText, answerText, blank) {
  return `
    <div class="detail-item">
      <div class="dq">${qNum}. ${questionText}</div>
      <div class="da ${blank ? "blank" : ""}">${blank ? "No answer given" : answerText}</div>
    </div>
  `;
}

function openDetail(sub) {
  const secA = sub.section_a || {};
  const secB = sub.section_b || {};
  const essayChoices = sub.essay_choices || [];
  const secC = sub.section_c || {};

  let html = `
    <h3 style="margin-top:0">${sub.student_id} ${sub.full_name ? "&mdash; " + sub.full_name : ""}</h3>
    <p class="hint-text" style="margin-top:-6px">Submitted ${sub.submitted_at ? new Date(sub.submitted_at).toLocaleString() : "\u2014"}</p>

    <div class="field" style="max-width:280px;margin-top:18px">
      <label for="marksInput">Marks Awarded (out of 100)</label>
      <input type="text" id="marksInput" value="${sub.marks_awarded != null ? sub.marks_awarded : ""}">
    </div>
    <div class="field">
      <label for="notesInput">Marker Notes</label>
      <textarea id="notesInput" style="min-height:70px">${sub.marker_notes || ""}</textarea>
    </div>
    <button class="btn btn-primary" id="saveMarksBtn" type="button">Save Marks</button>
    <p class="error-text" id="marksSaveMsg"></p>

    <h3>Section A &mdash; Multiple Choice</h3>
  `;

  SECTION_A.forEach((item, i) => {
    const chosen = secA[i];
    const answerText = chosen !== undefined ? `${String.fromCharCode(65 + chosen)}. ${item.options[chosen]}` : "";
    html += renderAnswerLine(i + 1, item.q, answerText, chosen === undefined);
  });

  html += `<h3>Section B &mdash; Fill in the Blank</h3>`;
  SECTION_B.forEach((text, i) => {
    const ans = secB[i];
    html += renderAnswerLine(i + 1, text, ans, !ans || !ans.trim());
  });

  html += `<h3>Section C &mdash; Essays (${essayChoices.length} selected)</h3>`;
  if (essayChoices.length === 0) {
    html += `<p class="hint-text">No essay questions were selected.</p>`;
  }
  essayChoices.slice().sort((a, b) => a - b).forEach((i) => {
    const item = SECTION_C[i];
    const c = secC[i] || {};
    html += `<div class="detail-item"><div class="dq" style="font-weight:600;color:var(--ink)">Question ${i + 1}</div></div>`;
    html += `
      <div class="detail-item">
        <div class="dq">(a) ${item.a}</div>
        <div class="da ${!c.a || !c.a.trim() ? "blank" : ""}" style="white-space:pre-wrap;font-weight:400">${c.a && c.a.trim() ? c.a : "No answer given"}</div>
      </div>
      <div class="detail-item">
        <div class="dq">(b) ${item.b}</div>
        <div class="da ${!c.b || !c.b.trim() ? "blank" : ""}" style="white-space:pre-wrap;font-weight:400">${c.b && c.b.trim() ? c.b : "No answer given"}</div>
      </div>
    `;
  });

  detailBody.innerHTML = html;
  detailOverlay.style.display = "flex";

  document.getElementById("saveMarksBtn").addEventListener("click", async () => {
    const msg = document.getElementById("marksSaveMsg");
    const marksVal = document.getElementById("marksInput").value.trim();
    const notesVal = document.getElementById("notesInput").value.trim();
    const marks = marksVal === "" ? null : Number(marksVal);
    if (marksVal !== "" && Number.isNaN(marks)) {
      msg.textContent = "Marks must be a number.";
      return;
    }
    msg.textContent = "Saving\u2026";
    const { error } = await supabaseClient
      .from("submissions")
      .update({ marks_awarded: marks, marker_notes: notesVal, graded: marks !== null })
      .eq("id", sub.id);
    if (error) {
      msg.textContent = "Could not save. Check console.";
      console.error(error);
    } else {
      msg.textContent = "Saved.";
      sub.marks_awarded = marks;
      sub.marker_notes = notesVal;
      sub.graded = marks !== null;
      loadSubmissions();
    }
  });
}

document.getElementById("closeDetail").addEventListener("click", () => {
  detailOverlay.style.display = "none";
});
detailOverlay.addEventListener("click", (e) => {
  if (e.target === detailOverlay) detailOverlay.style.display = "none";
});
