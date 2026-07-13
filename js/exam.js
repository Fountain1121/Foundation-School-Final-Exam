(function () {

  // ---------- Guard: must have come from login ----------
  const studentId = sessionStorage.getItem("examStudentId");
  const studentName = sessionStorage.getItem("examStudentName") || "";
  if (!studentId) {
    window.location.href = "index.html";
    return;
  }

  const DRAFT_KEY = `examDraft::${studentId}`;
  const root = document.getElementById("examRoot");
  const whoIdEl = document.getElementById("whoId");
  const timerEl = document.getElementById("timer");
  const progressFill = document.getElementById("progressFill");
  const saveNote = document.getElementById("saveNote");

  whoIdEl.textContent = studentId;

  // ---------- Load or create draft state ----------
  function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { console.warn("Could not parse saved draft, starting fresh.", e); }
    return {
      studentId,
      studentName,
      startTime: Date.now(),
      sectionA: {},
      sectionB: {},
      essayChoices: [],
      sectionC: {}
    };
  }

  let state = loadDraft();
  if (!state.startTime) state.startTime = Date.now();

  let saveTimeout = null;
  function persist() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
      saveNote.textContent = "Saved just now";
      setTimeout(() => { saveNote.textContent = "Answers save automatically"; }, 1800);
    }, 250);
  }

  // ---------- Render: Section A (MCQ) ----------
  function renderSectionA() {
    const wrap = document.createElement("div");
    wrap.className = "section-block";
    wrap.innerHTML = `
      <div class="section-head">
        <h2>Section A &middot; Multiple Choice</h2>
        <span class="seal" id="sealA">complete</span>
      </div>
      <p class="section-sub">Choose the best option for each question. (20 questions &times; \u00bd mark = 10 marks)</p>
    `;
    SECTION_A.forEach((item, i) => {
      const q = document.createElement("div");
      q.className = "question";
      const optsHtml = item.options.map((opt, oi) => `
        <label class="option" data-idx="${oi}">
          <input type="radio" name="a${i}" value="${oi}">
          <span class="label">${String.fromCharCode(65 + oi)}. ${opt}</span>
        </label>
      `).join("");
      q.innerHTML = `
        <p class="qtext"><span class="qnum">${i + 1}.</span>${item.q}</p>
        <div class="options">${optsHtml}</div>
      `;
      wrap.appendChild(q);

      const saved = state.sectionA[i];
      const radios = q.querySelectorAll(`input[name="a${i}"]`);
      radios.forEach((r) => {
        if (saved !== undefined && Number(r.value) === saved) {
          r.checked = true;
          r.closest(".option").classList.add("selected");
        }
        r.addEventListener("change", () => {
          state.sectionA[i] = Number(r.value);
          q.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
          r.closest(".option").classList.add("selected");
          persist();
          updateProgress();
        });
      });
    });
    root.appendChild(wrap);
  }

  // ---------- Render: Section B (Fill in blank) ----------
  function renderSectionB() {
    const wrap = document.createElement("div");
    wrap.className = "section-block";
    wrap.innerHTML = `
      <div class="section-head">
        <h2>Section B &middot; Fill in the Blank</h2>
        <span class="seal" id="sealB">complete</span>
      </div>
      <p class="section-sub">Complete each statement. (20 blanks &times; \u00bd mark = 10 marks)</p>
    `;
    SECTION_B.forEach((text, i) => {
      const q = document.createElement("div");
      q.className = "question";
      q.innerHTML = `
        <div class="blank-row">
          <p class="qtext"><span class="qnum">${i + 1}.</span>${text}</p>
        </div>
        <input type="text" class="fill-input" id="b${i}" autocomplete="off" placeholder="Your answer">
      `;
      wrap.appendChild(q);
      const input = q.querySelector(`#b${i}`);
      input.className = "field-like";
      input.style.cssText = "width:100%;font-family:var(--font-body);font-size:15px;padding:10px 12px;border:1px solid var(--rule);border-radius:3px;background:var(--parchment);margin-top:4px;";
      if (state.sectionB[i]) input.value = state.sectionB[i];
      input.addEventListener("input", () => {
        state.sectionB[i] = input.value;
        persist();
        updateProgress();
      });
      input.addEventListener("focus", () => input.style.background = "#fff");
      input.addEventListener("blur", () => input.style.background = "var(--parchment)");
    });
    root.appendChild(wrap);
  }

  // ---------- Render: Section C (Essays) ----------
  function renderSectionC() {
    const wrap = document.createElement("div");
    wrap.className = "section-block";
    wrap.innerHTML = `
      <div class="section-head">
        <h2>Section C &middot; Essays</h2>
        <span class="seal" id="sealC">complete</span>
      </div>
      <p class="section-sub">Answer any FOUR (4) of the six questions below. Each is worth 20 marks (12 for part a, 8 for part b).</p>
      <div class="essay-picker" id="essayPicker"></div>
      <div id="essayAnswers"></div>
    `;
    root.appendChild(wrap);

    const picker = wrap.querySelector("#essayPicker");
    const answersWrap = wrap.querySelector("#essayAnswers");

    function renderPicker() {
      picker.innerHTML = "";
      SECTION_C.forEach((item, i) => {
        const checked = state.essayChoices.includes(i);
        const disable = !checked && state.essayChoices.length >= EXAM_META.essaysRequired;
        const row = document.createElement("label");
        row.className = "essay-pick-row" + (checked ? " checked" : "");
        row.innerHTML = `
          <input type="checkbox" ${checked ? "checked" : ""} ${disable ? "disabled" : ""} data-idx="${i}">
          <span class="num">Question ${i + 1}</span>
          ${disable ? '<span class="disabled-note">Four already selected</span>' : ""}
        `;
        picker.appendChild(row);
        const cb = row.querySelector("input");
        cb.addEventListener("change", () => {
          if (cb.checked) {
            if (state.essayChoices.length < EXAM_META.essaysRequired) {
              state.essayChoices.push(i);
            }
          } else {
            state.essayChoices = state.essayChoices.filter(x => x !== i);
            delete state.sectionC[i];
          }
          state.essayChoices.sort((a, b) => a - b);
          persist();
          renderPicker();
          renderAnswers();
          updateProgress();
        });
      });
    }

    function renderAnswers() {
      answersWrap.innerHTML = "";
      state.essayChoices.forEach((i) => {
        const item = SECTION_C[i];
        const block = document.createElement("div");
        block.className = "essay-answer";
        block.innerHTML = `
          <p class="qtext">Question ${i + 1}</p>
          <div class="part">
            <p class="part-label">Part (a) &mdash; 12 marks</p>
            <p class="qtext" style="font-weight:400;font-size:14.5px;color:var(--ink-soft)">${item.a}</p>
            <textarea id="ca${i}" placeholder="Write your answer to part (a) here\u2026"></textarea>
          </div>
          <div class="part">
            <p class="part-label">Part (b) &mdash; 8 marks</p>
            <p class="qtext" style="font-weight:400;font-size:14.5px;color:var(--ink-soft)">${item.b}</p>
            <textarea id="cb${i}" placeholder="Write your answer to part (b) here\u2026"></textarea>
          </div>
        `;
        answersWrap.appendChild(block);

        const ta = state.sectionC[i]?.a || "";
        const tb = state.sectionC[i]?.b || "";
        const taA = block.querySelector(`#ca${i}`);
        const taB = block.querySelector(`#cb${i}`);
        taA.value = ta;
        taB.value = tb;
        taA.addEventListener("input", () => {
          state.sectionC[i] = state.sectionC[i] || {};
          state.sectionC[i].a = taA.value;
          persist();
          updateProgress();
        });
        taB.addEventListener("input", () => {
          state.sectionC[i] = state.sectionC[i] || {};
          state.sectionC[i].b = taB.value;
          persist();
          updateProgress();
        });
      });
    }

    renderPicker();
    renderAnswers();
  }

  // ---------- Render: Submit block ----------
  function renderSubmit() {
    const wrap = document.createElement("div");
    wrap.className = "submit-block";
    wrap.innerHTML = `
      <ul class="checklist" id="checklist"></ul>
      <button class="btn btn-primary" id="submitBtn" type="button">Submit Examination</button>
      <p class="error-text" id="submitError"></p>
    `;
    root.appendChild(wrap);
    document.getElementById("submitBtn").addEventListener("click", handleSubmit);
  }

  // ---------- Progress / seals / checklist ----------
  function countFilledA() { return Object.keys(state.sectionA).length; }
  function countFilledB() { return Object.values(state.sectionB).filter(v => v && v.trim().length > 0).length; }
  function countFilledEssayParts() {
    let n = 0;
    state.essayChoices.forEach(i => {
      const c = state.sectionC[i];
      if (c?.a && c.a.trim().length > 0) n++;
      if (c?.b && c.b.trim().length > 0) n++;
    });
    return n;
  }

  function updateProgress() {
    const a = countFilledA(), b = countFilledB(), cParts = countFilledEssayParts();
    const total = 20 + 20 + EXAM_META.essaysRequired * 2;
    const done = a + b + cParts;
    progressFill.style.width = Math.min(100, (done / total) * 100) + "%";

    const sealA = document.getElementById("sealA");
    const sealB = document.getElementById("sealB");
    const sealC = document.getElementById("sealC");
    if (sealA) sealA.classList.toggle("done", a === 20);
    if (sealB) sealB.classList.toggle("done", b === 20);
    if (sealC) sealC.classList.toggle("done", state.essayChoices.length === EXAM_META.essaysRequired && cParts === EXAM_META.essaysRequired * 2);

    const list = document.getElementById("checklist");
    if (list) {
      list.innerHTML = `
        <li class="${a === 20 ? "ok" : ""}">Section A: ${a}/20 answered</li>
        <li class="${b === 20 ? "ok" : ""}">Section B: ${b}/20 answered</li>
        <li class="${state.essayChoices.length === EXAM_META.essaysRequired ? "ok" : ""}">Section C: ${state.essayChoices.length}/${EXAM_META.essaysRequired} essays selected, ${cParts}/${state.essayChoices.length * 2} parts written</li>
      `;
    }
  }

  // ---------- Timer ----------
  let autoSubmitted = false;
  function tickTimer() {
    const elapsed = Date.now() - state.startTime;
    const totalMs = EXAM_META.timeAllowedMinutes * 60 * 1000;
    const remaining = Math.max(0, totalMs - elapsed);

    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    timerEl.textContent = `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    timerEl.classList.toggle("warning", remaining <= 5 * 60 * 1000);

    if (remaining <= 0 && !autoSubmitted) {
      autoSubmitted = true;
      handleSubmit(true);
    }
  }

  // ---------- Submit ----------
  let submitting = false;
  async function handleSubmit(isAuto) {
    if (submitting) return;
    const errorEl = document.getElementById("submitError");
    const a = countFilledA(), b = countFilledB(), cParts = countFilledEssayParts();

    if (!isAuto) {
      const incomplete = a < 20 || b < 20 || state.essayChoices.length < EXAM_META.essaysRequired || cParts < EXAM_META.essaysRequired * 2;
      if (incomplete) {
        const proceed = window.confirm(
          `You haven't finished every question (Section A: ${a}/20, Section B: ${b}/20, Section C: ${cParts}/${EXAM_META.essaysRequired * 2} parts).\n\nSubmit anyway?`
        );
        if (!proceed) return;
      } else {
        const proceed = window.confirm("Submit your examination now? You won't be able to make changes after this.");
        if (!proceed) return;
      }
    }

    submitting = true;
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Submitting\u2026"; }

    const payload = {
      student_id: state.studentId,
      full_name: state.studentName,
      section_a: state.sectionA,
      section_b: state.sectionB,
      essay_choices: state.essayChoices,
      section_c: state.sectionC,
      started_at: new Date(state.startTime).toISOString()
    };

    try {
      const { error } = await supabaseClient.from("submissions").insert(payload);
      if (error) throw error;

      localStorage.removeItem(DRAFT_KEY);
      sessionStorage.setItem("justSubmitted", "1");
      window.location.href = "submitted.html";
    } catch (err) {
      console.error(err);
      submitting = false;
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Submit Examination"; }
      if (errorEl) errorEl.textContent = "Could not submit right now. Your answers are still saved on this device \u2014 please check your connection and try again.";
    }
  }

  // ---------- Boot ----------
  renderSectionA();
  renderSectionB();
  renderSectionC();
  renderSubmit();
  updateProgress();
  tickTimer();
  setInterval(tickTimer, 1000);

  window.addEventListener("beforeunload", () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  });

})();
