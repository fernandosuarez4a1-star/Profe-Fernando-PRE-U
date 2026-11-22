/**
 * ============================================================================
 * PROFE FERNANDO PRE-U — LÓGICA PRINCIPAL DE LA APLICACIÓN (CLIENT-SIDE ES6+)
 * ============================================================================
 */

(function () {
  "use strict";

  const STORAGE_KEYS = {
    STUDENTS: "pf_preu_students_v1",
    BANK: "pf_preu_bank_v1",
    TEACHER_PIN: "pf_preu_teacher_pin_v1",
    ACTIVE_STUDENT: "pf_preu_active_student_v1"
  };

  const DEFAULT_TEACHER_PIN = "1234";

  const LEVEL_CONFIG = {
    basico: {
      key: "basico",
      label: "Nivel Básico",
      shortLabel: "Básico",
      questionCount: 5,
      timed: false,
      durationSeconds: 0,
      ruleText: "5 preguntas · Sin límite de tiempo"
    },
    medio: {
      key: "medio",
      label: "Nivel Medio",
      shortLabel: "Medio",
      questionCount: 10,
      timed: true,
      durationSeconds: 15 * 60,
      warningSeconds: 180,
      criticalSeconds: 60,
      ruleText: "10 preguntas · 15 minutos (90s/preg.)"
    },
    dificil: {
      key: "dificil",
      label: "Nivel Difícil",
      shortLabel: "Difícil",
      questionCount: 20,
      timed: true,
      durationSeconds: 15 * 60,
      warningSeconds: 120,
      criticalSeconds: 60,
      ruleText: "20 preguntas · 15 minutos (45s/preg.)"
    },
    desafio_final: {
      key: "desafio_final",
      label: "Simulacro General (70 Preguntas)",
      shortLabel: "Desafío Final",
      questionCount: 70,
      timed: true,
      durationSeconds: 75 * 60,
      warningSeconds: 10 * 60,
      criticalSeconds: 2 * 60,
      ruleText: "70 preguntas · 75 minutos"
    }
  };

  let questionBank = null;
  let studentsDB = {};
  let activeStudentKey = null;
  let deferredInstallPrompt = null;

  let examSession = null;
  let timerIntervalId = null;

  let currentResultContext = null;
  let previousViewBeforeCert = "view-student";

  document.addEventListener("DOMContentLoaded", () => {
    loadPersistentData();
    registerServiceWorker();
    setupPWAInstallPrompt();
    bindGlobalEvents();
    renderRecentStudents();

    const savedActiveKey = localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT);
    if (savedActiveKey && studentsDB[savedActiveKey]) {
      activeStudentKey = savedActiveKey;
      openStudentDashboard();
    } else {
      showView("view-landing");
    }
  });

  function loadPersistentData() {
    try {
      const rawBank = localStorage.getItem(STORAGE_KEYS.BANK);
      if (rawBank) {
        questionBank = JSON.parse(rawBank);
      } else {
        questionBank = buildInitialQuestionBank();
        saveQuestionBank();
      }
    } catch (e) {
      console.error("Error leyendo banco de preguntas, reconstruyendo:", e);
      questionBank = buildInitialQuestionBank();
      saveQuestionBank();
    }

    try {
      const rawStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      studentsDB = rawStudents ? JSON.parse(rawStudents) : {};
    } catch (e) {
      studentsDB = {};
    }

    if (!localStorage.getItem(STORAGE_KEYS.TEACHER_PIN)) {
      localStorage.setItem(STORAGE_KEYS.TEACHER_PIN, DEFAULT_TEACHER_PIN);
    }
  }

  function saveQuestionBank() {
    localStorage.setItem(STORAGE_KEYS.BANK, JSON.stringify(questionBank));
  }

  function saveStudentsDB() {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(studentsDB));
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch((err) => {
        console.warn("Service Worker no registrado:", err);
      });
    }
  }

  function setupPWAInstallPrompt() {
    const installBtn = document.getElementById("btn-install-pwa");
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      installBtn.classList.remove("hidden");
    });

    installBtn.addEventListener("click", async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === "accepted") {
        installBtn.classList.add("hidden");
      }
      deferredInstallPrompt = null;
    });
  }

  function normalizeStudentKey(rawName) {
    return rawName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function formatDisplayName(rawName) {
    return rawName
      .trim()
      .replace(/\s+/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  function formatSeconds(totalSec) {
    const safeSec = Math.max(0, Math.floor(totalSec));
    const hrs = Math.floor(safeSec / 3600);
    const mins = Math.floor((safeSec % 3600) / 60);
    const secs = safeSec % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function formatDateSpanish(isoString) {
    const d = isoString ? new Date(isoString) : new Date();
    return d.toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }

  function generateValidationCode(prefix, studentKey) {
    let h = 2166136261;
    const base = `${prefix}_${studentKey}_2026`;
    for (let i = 0; i < base.length; i++) {
      h ^= base.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const hex = (h >>> 0).toString(16).toUpperCase().padStart(8, "0");
    return `PFU-${prefix}-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
  }

  function playAlertBeep(frequency = 880, durationMs = 260) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch (e) {}
  }

  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type === "success" ? "toast-success" : type === "error" ? "toast-error" : ""}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3600);
  }

  function showView(viewId) {
    document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.remove("hidden");
      window.scrollTo(0, 0);
    }
  }

  function showConfirmModal({ title, message, onConfirm }) {
    const modal = document.getElementById("modal-confirm");
    document.getElementById("modal-confirm-title").textContent = title;
    document.getElementById("modal-confirm-message").textContent = message;
    modal.classList.remove("hidden");

    const btnAccept = document.getElementById("btn-confirm-accept");
    const btnCancel = document.getElementById("btn-confirm-cancel");

    const cleanup = () => {
      modal.classList.add("hidden");
      btnAccept.onclick = null;
      btnCancel.onclick = null;
    };

    btnCancel.onclick = cleanup;
    btnAccept.onclick = () => {
      cleanup();
      if (typeof onConfirm === "function") onConfirm();
    };
  }

  function bindGlobalEvents() {
    document.getElementById("form-student-login").addEventListener("submit", handleStudentLogin);
    document.getElementById("btn-student-logout").addEventListener("click", () => {
      activeStudentKey = null;
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
      renderRecentStudents();
      showView("view-landing");
    });

    document.getElementById("form-teacher-login").addEventListener("submit", handleTeacherLogin);
    document.getElementById("btn-teacher-logout").addEventListener("click", () => {
      showView("view-landing");
    });

    document.querySelectorAll("[data-student-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-student-tab");
        document.querySelectorAll("[data-student-tab]").forEach((b) => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });
        document.getElementById("student-tab-temario").classList.toggle("hidden", tab !== "temario");
        document.getElementById("student-tab-certificados").classList.toggle("hidden", tab !== "certificados");
      });
    });

    document.getElementById("btn-prev-question").addEventListener("click", () => navigateQuestion(-1));
    document.getElementById("btn-next-question").addEventListener("click", () => navigateQuestion(1));
    document.getElementById("btn-flag-question").addEventListener("click", toggleFlagCurrentQuestion);
    document.getElementById("btn-submit-exam").addEventListener("click", promptSubmitExam);
    document.getElementById("btn-submit-exam-side").addEventListener("click", promptSubmitExam);

    document.addEventListener("keydown", (e) => {
      const examView = document.getElementById("view-exam");
      if (examView.classList.contains("hidden") || !examSession) return;
      if (e.key === "ArrowRight") navigateQuestion(1);
      if (e.key === "ArrowLeft") navigateQuestion(-1);
      const mapKeys = { a: 0, A: 0, b: 1, B: 1, c: 2, C: 2, d: 3, D: 3 };
      if (e.key in mapKeys) {
        selectOption(mapKeys[e.key]);
      }
    });

    document.getElementById("btn-results-back").addEventListener("click", () => {
      openStudentDashboard();
    });

    document.querySelectorAll("[data-review-filter]").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("[data-review-filter]").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        if (currentResultContext) {
          renderReviewList(currentResultContext, chip.getAttribute("data-review-filter"));
        }
      });
    });

    document.getElementById("btn-cert-back").addEventListener("click", () => {
      showView(previousViewBeforeCert);
    });

    document.getElementById("btn-print-certificate").addEventListener("click", () => {
      window.print();
    });

    document.querySelectorAll("[data-teacher-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-teacher-tab");
        document.querySelectorAll("[data-teacher-tab]").forEach((b) => b.classList.toggle("active", b === btn));
        document.getElementById("teacher-tab-estudiantes").classList.toggle("hidden", tab !== "estudiantes");
        document.getElementById("teacher-tab-banco").classList.toggle("hidden", tab !== "banco");
        document.getElementById("teacher-tab-json").classList.toggle("hidden", tab !== "json");
      });
    });

    document.getElementById("teacher-student-search").addEventListener("input", renderTeacherStudentsTable);
    document.getElementById("teacher-filter-topic").addEventListener("change", handleTeacherFilterChange);
    document.getElementById("teacher-filter-level").addEventListener("change", renderTeacherQuestionsList);
    document.getElementById("btn-open-new-question").addEventListener("click", () => openQuestionEditor(null));
    document.getElementById("form-question-editor").addEventListener("submit", handleSaveQuestionForm);
    document.getElementById("qe-topic").addEventListener("change", handleEditorTopicChange);
    document.getElementById("qe-svg").addEventListener("input", updateEditorSvgPreview);

    document.getElementById("btn-export-bank").addEventListener("click", exportQuestionBankJSON);
    document.getElementById("btn-import-bank").addEventListener("click", importQuestionBankJSON);
    document.getElementById("btn-update-pin").addEventListener("click", updateTeacherPin);
    document.getElementById("btn-restore-default-bank").addEventListener("click", () => {
      showConfirmModal({
        title: "Restaurar Banco Original",
        message: "¿Deseas restaurar todas las preguntas originales de fábrica? Se perderán las ediciones personalizadas.",
        onConfirm: () => {
          questionBank = buildInitialQuestionBank();
          saveQuestionBank();
          renderTeacherQuestionsList();
          showToast("Banco de preguntas original restaurado.", "success");
        }
      });
    });

    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-close-modal");
        document.getElementById(targetId).classList.add("hidden");
      });
    });
  }

  function handleStudentLogin(e) {
    e.preventDefault();
    const input = document.getElementById("input-student-name");
    const errorEl = document.getElementById("student-login-error");
    const rawValue = input.value.trim();

    const words = rawValue.split(/\s+/).filter((w) => w.length >= 2);
    const validCharsRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/;

    if (words.length < 2 || !validCharsRegex.test(rawValue)) {
      errorEl.textContent = "Por favor ingresa tu Nombre y Apellido completos (al menos dos palabras válidas).";
      errorEl.classList.remove("hidden");
      input.focus();
      return;
    }

    errorEl.classList.add("hidden");
    const normalizedKey = normalizeStudentKey(rawValue);
    const displayName = formatDisplayName(rawValue);

    if (!studentsDB[normalizedKey]) {
      studentsDB[normalizedKey] = {
        key: normalizedKey,
        displayName,
        createdAt: new Date().toISOString(),
        attempts: {},
        certificates: {}
      };
      saveStudentsDB();
      showToast(`Bienvenido/a ${displayName}. Registro oficial creado.`, "success");
    } else {
      studentsDB[normalizedKey].displayName = displayName;
      saveStudentsDB();
      showToast(`Bienvenido/a nuevamente, ${displayName}.`, "info");
    }

    activeStudentKey = normalizedKey;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, normalizedKey);
    input.value = "";
    openStudentDashboard();
  }

  function renderRecentStudents() {
    const keys = Object.keys(studentsDB);
    const box = document.getElementById("recent-students-box");
    const list = document.getElementById("recent-students-list");

    if (keys.length === 0) {
      box.classList.add("hidden");
      return;
    }

    box.classList.remove("hidden");
    list.innerHTML = "";
    keys.forEach((k) => {
      const st = studentsDB[k];
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "recent-chip";
      chip.textContent = st.displayName;
      chip.addEventListener("click", () => {
        activeStudentKey = k;
        localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, k);
        openStudentDashboard();
      });
      list.appendChild(chip);
    });
  }

  function getActiveStudent() {
    return studentsDB[activeStudentKey] || null;
  }

  function openStudentDashboard() {
    const student = getActiveStudent();
    if (!student) {
      showView("view-landing");
      return;
    }

    document.getElementById("header-student-name").textContent = student.displayName;
    evaluateAutomaticCertificates(student);
    renderStudentKPIs(student);
    renderTopicsCatalog(student);
    renderFinalChallengeCard(student);
    renderCertificatesGallery(student);
    showView("view-student");
  }

  function evaluateAutomaticCertificates(student) {
    let changed = false;

    SYLLABUS_TOPICS.forEach((topic) => {
      const aBas = student.attempts[`${topic.id}__basico`];
      const aMed = student.attempts[`${topic.id}__medio`];
      const aDif = student.attempts[`${topic.id}__dificil`];

      if (aBas && aMed && aDif && !student.certificates[topic.id]) {
        const avgScore = Math.round((aBas.score1000 + aMed.score1000 + aDif.score1000) / 3);
        const latestDate = [aBas.completedAt, aMed.completedAt, aDif.completedAt].sort().pop();
        student.certificates[topic.id] = {
          id: topic.id,
          type: "topic",
          topicId: topic.id,
          title: topic.title,
          blockName: topic.blockName,
          avgScore,
          scores: {
            basico: aBas.score1000,
            medio: aMed.score1000,
            dificil: aDif.score1000
          },
          issuedAt: latestDate || new Date().toISOString(),
          code: generateValidationCode(`T${String(topic.number).padStart(2, "0")}`, student.key)
        };
        changed = true;
      }
    });

    const aFinal = student.attempts["desafio_final"];
    if (aFinal && !student.certificates["desafio_final"]) {
      student.certificates["desafio_final"] = {
        id: "desafio_final",
        type: "final",
        title: "Desafío Final — Simulacro General de Ingreso a la Universidad",
        avgScore: aFinal.score1000,
        correct: aFinal.correct,
        total: aFinal.total,
        issuedAt: aFinal.completedAt || new Date().toISOString(),
        code: generateValidationCode("FINAL70", student.key)
      };
      changed = true;
    }

    if (changed) {
      saveStudentsDB();
    }
  }

  function renderStudentKPIs(student) {
    let completedTopicLevels = 0;
    let scoreSum = 0;

    SYLLABUS_TOPICS.forEach((t) => {
      ["basico", "medio", "dificil"].forEach((lvl) => {
        const att = student.attempts[`${t.id}__${lvl}`];
        if (att) {
          completedTopicLevels++;
          scoreSum += att.score1000;
        }
      });
    });

    const certifiedTopicsCount = SYLLABUS_TOPICS.filter((t) => Boolean(student.certificates[t.id])).length;
    const totalCertsCount = Object.keys(student.certificates).length;
    const avgGeneral = completedTopicLevels > 0 ? Math.round(scoreSum / completedTopicLevels) : 0;
    const finalAtt = student.attempts["desafio_final"];

    document.getElementById("kpi-levels-done").textContent = `${completedTopicLevels} / 33`;
    document.getElementById("kpi-topics-certified").textContent = `${certifiedTopicsCount} / 11`;
    document.getElementById("kpi-avg-score").textContent = `${avgGeneral} pts`;
    document.getElementById("tab-cert-count").textContent = totalCertsCount;

    if (finalAtt) {
      document.getElementById("kpi-final-status").textContent = `${finalAtt.score1000} pts`;
      document.getElementById("kpi-final-sub").textContent = `${finalAtt.correct}/${finalAtt.total} aciertos · Completado`;
    } else {
      document.getElementById("kpi-final-status").textContent = "Disponible";
      document.getElementById("kpi-final-sub").textContent = "70 preg. · 1 intento único";
    }
  }

  function renderTopicsCatalog(student) {
    const b1Container = document.getElementById("topics-block-1");
    const b2Container = document.getElementById("topics-block-2");
    b1Container.innerHTML = "";
    b2Container.innerHTML = "";

    SYLLABUS_TOPICS.forEach((topic) => {
      const isCertified = Boolean(student.certificates[topic.id]);
      const card = document.createElement("article");
      card.className = `topic-card ${isCertified ? "topic-certified" : ""}`;

      let levelsHtml = "";
      ["basico", "medio", "dificil"].forEach((lvlKey) => {
        const cfg = LEVEL_CONFIG[lvlKey];
        const attempt = student.attempts[`${topic.id}__${lvlKey}`];
        const qAvailable = (questionBank.topics[topic.id]?.levels[lvlKey] || []).length;

        if (attempt) {
          levelsHtml += `
            <div class="level-row level-done">
              <div class="level-info">
                <strong>${cfg.shortLabel} · Completado (${attempt.score1000}/1000 pts)</strong>
                <span>${attempt.correct}/${attempt.total} aciertos · Intento único utilizado</span>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" data-review-attempt="${topic.id}__${lvlKey}">
                Ver Revisión
              </button>
            </div>
          `;
        } else {
          levelsHtml += `
            <div class="level-row">
              <div class="level-info">
                <strong>${cfg.shortLabel} (${qAvailable} preguntas)</strong>
                <span>${cfg.ruleText}</span>
              </div>
              <button type="button" class="btn btn-primary btn-sm" data-start-topic="${topic.id}" data-start-level="${lvlKey}">
                Rendir
              </button>
            </div>
          `;
        }
      });

      const certFooter = isCertified
        ? `<div class="topic-cert-footer">
             <button type="button" class="btn btn-gold btn-sm btn-block" data-open-cert="${topic.id}">
               Descargar / Ver Certificado Oficial (${student.certificates[topic.id].avgScore} pts)
             </button>
           </div>`
        : "";

      card.innerHTML = `
        <div>
          <div class="topic-card-top">
            <span class="topic-num">Tema ${topic.number} de 11</span>
            <span class="topic-status-pill ${isCertified ? "certified" : ""}">
              ${isCertified ? "CERTIFICADO" : "En progreso"}
            </span>
          </div>
          <h3>${topic.title}</h3>
          <p class="topic-desc">${topic.description}</p>
        </div>
        <div>
          <div class="levels-stack">${levelsHtml}</div>
          ${certFooter}
        </div>
      `;

      if (topic.block === 1) {
        b1Container.appendChild(card);
      } else {
        b2Container.appendChild(card);
      }
    });

    document.querySelectorAll("[data-start-topic]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const topicId = btn.getAttribute("data-start-topic");
        const levelKey = btn.getAttribute("data-start-level");
        confirmAndStartExam(topicId, levelKey);
      });
    });

    document.querySelectorAll("[data-review-attempt]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const attemptKey = btn.getAttribute("data-review-attempt");
        openAttemptReview(attemptKey);
      });
    });

    document.querySelectorAll("[data-open-cert]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const certId = btn.getAttribute("data-open-cert");
        openCertificateView(certId, "view-student");
      });
    });
  }

  function renderFinalChallengeCard(student) {
    const box = document.getElementById("final-challenge-action-box");
    const attempt = student.attempts["desafio_final"];
    const totalQ = (questionBank.desafio_final || []).length;

    if (attempt) {
      box.innerHTML = `
        <span class="badge-institutional" style="background-color:#198754;">SIMULACRO COMPLETADO</span>
        <div style="font-size:2rem;font-weight:800;margin:6px 0;">${attempt.score1000} / 1000</div>
        <p style="font-size:0.82rem;color:#E2E8F0;margin-bottom:12px;">
          ${attempt.correct} de ${attempt.total} aciertos · Intento único registrado
        </p>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <button type="button" id="btn-review-final" class="btn btn-secondary btn-sm btn-block">
            Ver Desglose y Revisión
          </button>
          <button type="button" id="btn-cert-final" class="btn btn-gold btn-sm btn-block">
            Certificado General
          </button>
        </div>
      `;
      document.getElementById("btn-review-final").addEventListener("click", () => openAttemptReview("desafio_final"));
      document.getElementById("btn-cert-final").addEventListener("click", () => openCertificateView("desafio_final", "view-student"));
    } else {
      box.innerHTML = `
        <p style="font-size:0.86rem;color:#E2E8F0;margin-bottom:12px;">
          <strong>${totalQ} preguntas</strong> · <strong>75:00 min</strong><br/>
          Solo tienes <strong>1 intento oficial</strong>.
        </p>
        <button type="button" id="btn-start-final-challenge" class="btn btn-gold btn-block">
          Iniciar Desafío Final
        </button>
      `;
      document.getElementById("btn-start-final-challenge").addEventListener("click", () => {
        confirmAndStartExam("desafio_final", "desafio_final");
      });
    }
  }

  function renderCertificatesGallery(student) {
    const gallery = document.getElementById("certificates-gallery");
    const certs = Object.values(student.certificates);
    gallery.innerHTML = "";

    if (certs.length === 0) {
      gallery.innerHTML = `
        <div class="empty-state-box">
          <h4>Aún no tienes certificaciones emitidas</h4>
          <p>Completa los 3 niveles (<strong>Básico, Medio y Difícil</strong>) de cualquier tema para desbloquear automáticamente tu Certificado Oficial.</p>
        </div>
      `;
      return;
    }

    certs.forEach((cert) => {
      const card = document.createElement("article");
      card.className = "cert-gallery-card";
      card.innerHTML = `
        <div>
          <span class="cert-gallery-tag">${cert.type === "final" ? "CERTIFICACIÓN GENERAL SIMULACRO" : "CERTIFICACIÓN POR TEMA"}</span>
          <h4>${cert.title}</h4>
          <div class="cert-gallery-meta">
            <p><strong>Calificación:</strong> ${cert.avgScore} / 1000 puntos</p>
            <p><strong>Fecha:</strong> ${formatDateSpanish(cert.issuedAt)}</p>
            <p><strong>Código:</strong> <code>${cert.code}</code></p>
          </div>
        </div>
        <button type="button" class="btn btn-gold btn-block" data-gallery-cert="${cert.id}">
          Abrir e Imprimir Certificado
        </button>
      `;
      gallery.appendChild(card);
    });

    gallery.querySelectorAll("[data-gallery-cert]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openCertificateView(btn.getAttribute("data-gallery-cert"), "view-student");
      });
    });
  }

  function confirmAndStartExam(topicId, levelKey) {
    const student = getActiveStudent();
    if (!student) return;

    const attemptKey = topicId === "desafio_final" ? "desafio_final" : `${topicId}__${levelKey}`;
    if (student.attempts[attemptKey]) {
      showToast("Este simulacro ya fue rendido. Mostrando revisión oficial.", "info");
      openAttemptReview(attemptKey);
      return;
    }

    const isFinal = topicId === "desafio_final";
    const topicObj = isFinal ? null : questionBank.topics[topicId];
    const questions = isFinal
      ? questionBank.desafio_final
      : (topicObj?.levels[levelKey] || []);

    if (!questions || questions.length === 0) {
      showToast("No hay preguntas disponibles para este nivel.", "error");
      return;
    }

    const cfg = LEVEL_CONFIG[levelKey];
    const title = isFinal
      ? "Desafío Final — Simulacro General de Ingreso a la Universidad"
      : `Tema ${topicObj.number}: ${topicObj.title} (${cfg.label})`;

    showConfirmModal({
      title: "Confirmar Inicio de Simulacro Oficial",
      message: `Vas a iniciar: ${title}. Recuerda que dispones de UN SOLO INTENTO OFICIAL (${cfg.ruleText}). ¿Deseas comenzar ahora?`,
      onConfirm: () => {
        startExamSession({
          attemptKey,
          isFinal,
          topicId,
          topicTitle: isFinal ? "Desafío Final — Simulacro General" : `Tema ${topicObj.number}: ${topicObj.title}`,
          levelKey,
          levelLabel: cfg.label,
          timed: cfg.timed,
          durationSeconds: cfg.durationSeconds,
          warningSeconds: cfg.warningSeconds || 0,
          criticalSeconds: cfg.criticalSeconds || 0,
          questions: JSON.parse(JSON.stringify(questions))
        });
      }
    });
  }

  function startExamSession(config) {
    stopExamTimer();
    const student = getActiveStudent();

    examSession = {
      ...config,
      studentKey: student.key,
      studentName: student.displayName,
      currentIndex: 0,
      answers: new Array(config.questions.length).fill(null),
      flagged: new Array(config.questions.length).fill(false),
      elapsedSeconds: 0,
      remainingSeconds: config.timed ? config.durationSeconds : 0,
      warningTriggered: false
    };

    document.getElementById("exam-student-label").textContent = examSession.studentName;
    document.getElementById("exam-topic-title").textContent = examSession.topicTitle;
    document.getElementById("exam-level-badge").textContent = examSession.levelLabel;

    const timerBox = document.getElementById("exam-timer-box");
    const timerModeLbl = document.getElementById("exam-timer-mode-label");
    const timerDisplay = document.getElementById("exam-timer-display");
    const warningBanner = document.getElementById("exam-time-warning-banner");

    timerBox.classList.remove("timer-warning", "timer-critical");
    warningBanner.classList.add("hidden");
    warningBanner.classList.remove("critical");

    if (examSession.timed) {
      timerModeLbl.textContent = "TIEMPO RESTANTE";
      timerDisplay.textContent = formatSeconds(examSession.remainingSeconds);
    } else {
      timerModeLbl.textContent = "TIEMPO LIBRE";
      timerDisplay.textContent = "00:00";
    }

    renderNavigatorGrid();
    renderCurrentQuestion();
    showView("view-exam");
    startExamTimer();
  }

  function startExamTimer() {
    timerIntervalId = setInterval(() => {
      if (!examSession) return;
      examSession.elapsedSeconds++;

      const timerBox = document.getElementById("exam-timer-box");
      const timerDisplay = document.getElementById("exam-timer-display");
      const warningBanner = document.getElementById("exam-time-warning-banner");
      const warningText = document.getElementById("exam-time-warning-text");

      if (!examSession.timed) {
        timerDisplay.textContent = formatSeconds(examSession.elapsedSeconds);
        return;
      }

      examSession.remainingSeconds--;
      timerDisplay.textContent = formatSeconds(examSession.remainingSeconds);

      if (examSession.remainingSeconds <= examSession.warningSeconds && !examSession.warningTriggered) {
        examSession.warningTriggered = true;
        timerBox.classList.add("timer-warning");
        warningBanner.classList.remove("hidden");
        const minsLeft = Math.ceil(examSession.remainingSeconds / 60);
        warningText.textContent = `¡Atención! Restan ${minsLeft} minuto(s) para el cierre automático del examen.`;
        playAlertBeep(780, 350);
      }

      if (examSession.remainingSeconds <= examSession.criticalSeconds) {
        timerBox.classList.remove("timer-warning");
        timerBox.classList.add("timer-critical");
        warningBanner.classList.remove("hidden");
        warningBanner.classList.add("critical");
        warningText.textContent = "¡TIEMPO CRÍTICO! El examen se enviará automáticamente al llegar a 00:00.";
      }

      if (examSession.remainingSeconds <= 0) {
        stopExamTimer();
        playAlertBeep(520, 500);
        showToast("El tiempo ha finalizado. Calificando examen automáticamente...", "info");
        finalizeAndGradeExam(true);
      }
    }, 1000);
  }

  function stopExamTimer() {
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      timerIntervalId = null;
    }
  }

  function renderCurrentQuestion() {
    if (!examSession) return;
    const idx = examSession.currentIndex;
    const total = examSession.questions.length;
    const q = examSession.questions[idx];

    document.getElementById("exam-question-counter").textContent = `Pregunta ${idx + 1} de ${total}`;
    document.getElementById("q-number-badge").textContent = `Pregunta #${idx + 1}`;

    const originBadge = document.getElementById("q-topic-origin-badge");
    if (examSession.isFinal && q.topicId && questionBank.topics[q.topicId]) {
      const t = questionBank.topics[q.topicId];
      originBadge.textContent = `Tema ${t.number}: ${t.title}`;
      originBadge.classList.remove("hidden");
    } else {
      originBadge.classList.add("hidden");
    }

    const flagBtn = document.getElementById("btn-flag-question");
    const isFlagged = examSession.flagged[idx];
    flagBtn.classList.toggle("flagged", isFlagged);
    flagBtn.textContent = isFlagged ? "Marcada para revisar" : "Marcar para revisar";

    document.getElementById("q-prompt-text").textContent = q.prompt;
    const svgBox = document.getElementById("q-svg-container");
    if (q.svg && q.svg.trim() !== "") {
      svgBox.innerHTML = q.svg;
      svgBox.classList.remove("hidden");
    } else {
      svgBox.innerHTML = "";
      svgBox.classList.add("hidden");
    }

    const optionsList = document.getElementById("q-options-list");
    optionsList.innerHTML = "";
    const letters = ["A", "B", "C", "D"];
    const selectedOpt = examSession.answers[idx];

    q.options.forEach((optText, optIdx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `option-item ${selectedOpt === optIdx ? "selected" : ""}`;
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", selectedOpt === optIdx ? "true" : "false");

      btn.innerHTML = `
        <span class="option-letter">${letters[optIdx]}</span>
        <span class="option-content">${escapeHtml(optText)}</span>
      `;
      btn.addEventListener("click", () => selectOption(optIdx));
      optionsList.appendChild(btn);
    });

    document.getElementById("btn-prev-question").disabled = idx === 0;
    document.getElementById("btn-next-question").disabled = idx === total - 1;

    updateNavigatorHighlight();
  }

  function selectOption(optIdx) {
    if (!examSession) return;
    examSession.answers[examSession.currentIndex] = optIdx;
    renderCurrentQuestion();
  }

  function navigateQuestion(delta) {
    if (!examSession) return;
    const nextIdx = examSession.currentIndex + delta;
    if (nextIdx >= 0 && nextIdx < examSession.questions.length) {
      examSession.currentIndex = nextIdx;
      renderCurrentQuestion();
    }
  }

  function toggleFlagCurrentQuestion() {
    if (!examSession) return;
    const idx = examSession.currentIndex;
    examSession.flagged[idx] = !examSession.flagged[idx];
    renderCurrentQuestion();
  }

  function renderNavigatorGrid() {
    if (!examSession) return;
    const grid = document.getElementById("exam-navigator-grid");
    grid.innerHTML = "";

    examSession.questions.forEach((_, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-num-btn";
      btn.textContent = String(idx + 1);
      btn.addEventListener("click", () => {
        examSession.currentIndex = idx;
        renderCurrentQuestion();
      });
      grid.appendChild(btn);
    });

    updateNavigatorHighlight();
  }

  function updateNavigatorHighlight() {
    if (!examSession) return;
    const grid = document.getElementById("exam-navigator-grid");
    const buttons = grid.querySelectorAll(".nav-num-btn");
    let answeredCount = 0;

    buttons.forEach((btn, idx) => {
      const isAnswered = examSession.answers[idx] !== null;
      const isFlagged = examSession.flagged[idx];
      const isCurrent = idx === examSession.currentIndex;

      if (isAnswered) answeredCount++;

      btn.classList.toggle("answered", isAnswered && !isFlagged);
      btn.classList.toggle("flagged", isFlagged);
      btn.classList.toggle("current", isCurrent);
    });

    document.getElementById("nav-answered-summary").textContent =
      `${answeredCount} / ${examSession.questions.length} respondidas`;
  }

  function promptSubmitExam() {
    if (!examSession) return;
    const unanswered = examSession.answers.filter((a) => a === null).length;
    const msg = unanswered > 0
      ? `Tienes ${unanswered} pregunta(s) sin responder. Recuerda que este es tu ÚNICO intento oficial. ¿Deseas finalizar y calificar el examen ahora?`
      : `Has respondido todas las preguntas. Recuerda que este es tu ÚNICO intento oficial. ¿Deseas entregar y calificar el examen?`;

    showConfirmModal({
      title: "Finalizar y Calificar Examen",
      message: msg,
      onConfirm: () => finalizeAndGradeExam(false)
    });
  }

  function finalizeAndGradeExam(autoSubmitted = false) {
    if (!examSession) return;
    stopExamTimer();

    const student = studentsDB[examSession.studentKey];
    if (!student) return;

    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    const topicBreakdown = {};
    SYLLABUS_TOPICS.forEach((t) => {
      topicBreakdown[t.id] = {
        number: t.number,
        title: t.title,
        blockName: t.blockName,
        correct: 0,
        total: 0
      };
    });

    examSession.questions.forEach((q, idx) => {
      const chosen = examSession.answers[idx];
      const isRight = chosen !== null && chosen === q.correctIndex;

      if (chosen === null) {
        unanswered++;
      } else if (isRight) {
        correct++;
      } else {
        incorrect++;
      }

      if (q.topicId && topicBreakdown[q.topicId]) {
        topicBreakdown[q.topicId].total++;
        if (isRight) topicBreakdown[q.topicId].correct++;
      }
    });

    const total = examSession.questions.length;
    const score1000 = Math.round((correct / total) * 1000);

    const attemptRecord = {
      attemptKey: examSession.attemptKey,
      isFinal: examSession.isFinal,
      topicId: examSession.topicId,
      topicTitle: examSession.topicTitle,
      levelKey: examSession.levelKey,
      levelLabel: examSession.levelLabel,
      score1000,
      correct,
      incorrect,
      unanswered,
      total,
      elapsedSeconds: examSession.elapsedSeconds,
      autoSubmitted,
      completedAt: new Date().toISOString(),
      answers: examSession.answers,
      questions: examSession.questions,
      topicBreakdown: examSession.isFinal ? topicBreakdown : null
    };

    student.attempts[examSession.attemptKey] = attemptRecord;

    const prevCertCount = Object.keys(student.certificates).length;
    evaluateAutomaticCertificates(student);
    const newCertCount = Object.keys(student.certificates).length;
    const newlyCertifiedId = newCertCount > prevCertCount
      ? (examSession.isFinal ? "desafio_final" : examSession.topicId)
      : null;

    saveStudentsDB();

    const finishedAttemptKey = examSession.attemptKey;
    examSession = null;

    openAttemptReview(finishedAttemptKey, newlyCertifiedId);
  }

  function openAttemptReview(attemptKey, newlyCertifiedId = null) {
    const student = getActiveStudent();
    if (!student || !student.attempts[attemptKey]) return;

    const record = student.attempts[attemptKey];
    currentResultContext = record;

    document.getElementById("res-student-name").textContent = student.displayName;
    document.getElementById("res-mode-badge").textContent = record.isFinal
      ? "INFORME DESAFÍO FINAL (70 PREGUNTAS)"
      : `RESULTADO OFICIAL · ${record.levelLabel.toUpperCase()}`;
    document.getElementById("res-title").textContent = record.topicTitle;
    document.getElementById("res-subtitle").textContent =
      `Culminado el ${formatDateSpanish(record.completedAt)} · Intento único registrado.`;

    document.getElementById("res-score-1000").textContent = record.score1000;
    document.getElementById("res-correct-count").textContent = record.correct;
    document.getElementById("res-incorrect-count").textContent = record.incorrect;
    document.getElementById("res-unanswered-count").textContent = record.unanswered;
    document.getElementById("res-time-taken").textContent = formatSeconds(record.elapsedSeconds);

    const certIdToCheck = record.isFinal ? "desafio_final" : record.topicId;
    const certObj = student.certificates[certIdToCheck];
    const certBanner = document.getElementById("res-certificate-banner");

    if (certObj) {
      certBanner.classList.remove("hidden");
      document.getElementById("res-cert-banner-title").textContent = newlyCertifiedId
        ? "¡Felicitaciones! Has desbloqueado tu Certificación Oficial"
        : "Certificación Oficial Disponible";
      document.getElementById("res-cert-banner-desc").textContent =
        `Diploma emitido bajo el código ${certObj.code} con promedio de ${certObj.avgScore}/1000 puntos.`;
      document.getElementById("btn-res-open-cert").onclick = () => {
        openCertificateView(certIdToCheck, "view-results");
      };
    } else {
      certBanner.classList.add("hidden");
    }

    const breakdownCard = document.getElementById("res-final-breakdown-card");
    const breakdownBody = document.getElementById("res-final-breakdown-body");
    if (record.isFinal && record.topicBreakdown) {
      breakdownCard.classList.remove("hidden");
      breakdownBody.innerHTML = "";
      Object.values(record.topicBreakdown).forEach((tb) => {
        const pct = tb.total > 0 ? Math.round((tb.correct / tb.total) * 100) : 0;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong>${tb.number}</strong></td>
          <td>${tb.title}</td>
          <td>${tb.blockName}</td>
          <td><strong>${tb.correct} / ${tb.total}</strong></td>
          <td>${pct}%</td>
        `;
        breakdownBody.appendChild(tr);
      });
    } else {
      breakdownCard.classList.add("hidden");
    }

    document.querySelectorAll("[data-review-filter]").forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-review-filter") === "all");
    });
    renderReviewList(record, "all");
    showView("view-results");
  }

  function renderReviewList(record, filterMode) {
    const container = document.getElementById("res-review-list");
    container.innerHTML = "";
    const letters = ["A", "B", "C", "D"];

    record.questions.forEach((q, idx) => {
      const chosen = record.answers[idx];
      const isCorrect = chosen !== null && chosen === q.correctIndex;

      if (filterMode === "correct" && !isCorrect) return;
      if (filterMode === "incorrect" && isCorrect) return;

      const card = document.createElement("article");
      card.className = `review-card ${isCorrect ? "is-correct" : "is-incorrect"}`;

      let optionsHtml = "";
      q.options.forEach((opt, optIdx) => {
        let cls = "rev-opt";
        let tag = "";
        if (optIdx === q.correctIndex) {
          cls += " opt-right";
          tag = " ✓ (Correcta)";
        } else if (optIdx === chosen && !isCorrect) {
          cls += " opt-wrong";
          tag = " ✗ (Tu elección)";
        }
        optionsHtml += `<div class="${cls}"><strong>${letters[optIdx]}.</strong> ${escapeHtml(opt)}${tag}</div>`;
      });

      const statusText = isCorrect
        ? "CORRECTA"
        : chosen === null
          ? "SIN RESPONDER"
          : "INCORRECTA";

      card.innerHTML = `
        <div class="review-card-top">
          <strong>Ejercicio #${idx + 1}</strong>
          <span class="status-badge ${isCorrect ? "correct" : "incorrect"}">${statusText}</span>
        </div>
        <div class="question-prompt" style="margin-bottom:12px;">${escapeHtml(q.prompt)}</div>
        ${q.svg ? `<div class="question-svg-box">${q.svg}</div>` : ""}
        <div class="review-options-summary">${optionsHtml}</div>
        <div class="explanation-box">
          <strong>Explicación paso a paso:</strong> ${escapeHtml(q.explanation)}
        </div>
      `;

      container.appendChild(card);
    });

    if (container.children.length === 0) {
      container.innerHTML = `<div class="empty-state-box"><p>No hay ejercicios en esta categoría de filtro.</p></div>`;
    }
  }

  function openCertificateView(certId, returnViewId = "view-student") {
    const student = getActiveStudent();
    if (!student || !student.certificates[certId]) return;

    const cert = student.certificates[certId];
    previousViewBeforeCert = returnViewId;

    document.getElementById("cert-student-fullname").textContent = student.displayName;
    document.getElementById("cert-avg-score").textContent = `${cert.avgScore} / 1000 puntos`;
    document.getElementById("cert-issue-date").textContent = formatDateSpanish(cert.issuedAt);
    document.getElementById("cert-validation-code").textContent = cert.code;

    if (cert.type === "final") {
      document.getElementById("cert-doc-type").textContent =
        "CERTIFICACIÓN GENERAL DE SIMULACRO UNIVERSITARIO";
      document.getElementById("cert-formal-statement").innerHTML =
        `Por haber culminado satisfactoriamente el <strong>Desafío Final Integrador de 70 preguntas</strong> (Matemáticas, Lógica y Razonamiento Abstracto), demostrando preparación integral para el examen de admisión universitaria.`;
      document.getElementById("cert-levels-detail").textContent =
        `${cert.correct} de ${cert.total} aciertos · 11 Temas`;
    } else {
      document.getElementById("cert-doc-type").textContent =
        "CERTIFICACIÓN OFICIAL DE CULMINACIÓN DE TEMA";
      document.getElementById("cert-formal-statement").innerHTML =
        `Por haber culminado satisfactoriamente la práctica completa (niveles <strong>Básico, Medio y Difícil</strong>) correspondiente al tema oficial: <strong>"${cert.title}"</strong>.`;
      document.getElementById("cert-levels-detail").textContent =
        `Básico: ${cert.scores.basico} · Medio: ${cert.scores.medio} · Difícil: ${cert.scores.dificil}`;
    }

    showView("view-certificate");
  }

  function handleTeacherLogin(e) {
    e.preventDefault();
    const pinInput = document.getElementById("input-teacher-pin");
    const errEl = document.getElementById("teacher-login-error");
    const storedPin = localStorage.getItem(STORAGE_KEYS.TEACHER_PIN) || DEFAULT_TEACHER_PIN;

    if (pinInput.value.trim() !== storedPin) {
      errEl.textContent = "PIN docente incorrecto. Verifica tus credenciales.";
      errEl.classList.remove("hidden");
      pinInput.focus();
      return;
    }

    errEl.classList.add("hidden");
    pinInput.value = "";
    openTeacherDashboard();
  }

  function openTeacherDashboard() {
    populateTeacherSelectors();
    renderTeacherStudentsTable();
    renderTeacherQuestionsList();
    showView("view-teacher");
  }

  function populateTeacherSelectors() {
    const filterTopic = document.getElementById("teacher-filter-topic");
    const editorTopic = document.getElementById("qe-topic");
    const originTopic = document.getElementById("qe-origin-topic");

    filterTopic.innerHTML = "";
    editorTopic.innerHTML = "";
    originTopic.innerHTML = "";

    SYLLABUS_TOPICS.forEach((t) => {
      const opt1 = new Option(`Tema ${t.number}: ${t.title}`, t.id);
      const opt2 = new Option(`Tema ${t.number}: ${t.title}`, t.id);
      const opt3 = new Option(`Tema ${t.number}: ${t.title}`, t.id);
      filterTopic.add(opt1);
      editorTopic.add(opt2);
      originTopic.add(opt3);
    });

    filterTopic.add(new Option("Desafío Final Integrador (70 preg.)", "desafio_final"));
    editorTopic.add(new Option("Desafío Final Integrador (70 preg.)", "desafio_final"));
  }

  function renderTeacherStudentsTable() {
    const tbody = document.getElementById("teacher-students-tbody");
    const searchVal = normalizeStudentKey(document.getElementById("teacher-student-search").value || "");
    const allStudents = Object.values(studentsDB);

    document.getElementById("teacher-total-students").textContent = allStudents.length;
    const totalCerts = allStudents.reduce((acc, st) => acc + Object.keys(st.certificates || {}).length, 0);
    document.getElementById("teacher-total-certs").textContent = totalCerts;

    const filtered = allStudents.filter((st) => st.key.includes(searchVal));
    tbody.innerHTML = "";

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;color:#526071;">No hay estudiantes registrados que coincidan con el criterio.</td></tr>`;
      return;
    }

    filtered.forEach((st) => {
      let topicLevelsDone = 0;
      let topicScoreSum = 0;
      SYLLABUS_TOPICS.forEach((t) => {
        ["basico", "medio", "dificil"].forEach((lvl) => {
          const att = st.attempts[`${t.id}__${lvl}`];
          if (att) {
            topicLevelsDone++;
            topicScoreSum += att.score1000;
          }
        });
      });

      const topicCerts = SYLLABUS_TOPICS.filter((t) => Boolean(st.certificates[t.id])).length;
      const avgTopics = topicLevelsDone > 0 ? `${Math.round(topicScoreSum / topicLevelsDone)} pts` : "—";
      const finalAtt = st.attempts["desafio_final"];
      const finalText = finalAtt ? `${finalAtt.score1000} / 1000 pts` : "Pendiente";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${escapeHtml(st.displayName)}</strong></td>
        <td>${topicLevelsDone} / 33 niveles</td>
        <td>${topicCerts} / 11 temas</td>
        <td>${avgTopics}</td>
        <td><strong>${finalText}</strong></td>
        <td>
          <button type="button" class="btn btn-primary btn-sm" data-inspect-student="${st.key}">
            Gestionar Intentos / Detalle
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll("[data-inspect-student]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openStudentDetailModal(btn.getAttribute("data-inspect-student"));
      });
    });
  }

  function openStudentDetailModal(studentKey) {
    const st = studentsDB[studentKey];
    if (!st) return;

    document.getElementById("modal-sd-title").textContent = `Expediente: ${st.displayName}`;
    const body = document.getElementById("modal-sd-body");
    const attemptEntries = Object.values(st.attempts);

    if (attemptEntries.length === 0) {
      body.innerHTML = `<p style="color:#526071;">Este estudiante aún no ha culminado ningún nivel o simulacro.</p>`;
    } else {
      let rows = "";
      attemptEntries.forEach((att) => {
        rows += `
          <tr>
            <td><strong>${escapeHtml(att.topicTitle)}</strong></td>
            <td>${escapeHtml(att.levelLabel)}</td>
            <td><strong>${att.score1000} pts</strong> (${att.correct}/${att.total})</td>
            <td>
              <button type="button" class="btn btn-crimson btn-sm" data-reset-attempt="${att.attemptKey}">
                Habilitar Nuevo Intento
              </button>
            </td>
          </tr>
        `;
      });

      body.innerHTML = `
        <p style="font-size:0.88rem;color:#526071;margin-bottom:12px;">
          Desde aquí puedes autorizar administrativamente un nuevo intento eliminando el bloqueo de intento único en un nivel específico:
        </p>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tema / Simulacro</th>
                <th>Nivel</th>
                <th>Calificación</th>
                <th>Control Docente</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;

      body.querySelectorAll("[data-reset-attempt]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const attKey = btn.getAttribute("data-reset-attempt");
          delete st.attempts[attKey];
          if (attKey === "desafio_final") {
            delete st.certificates["desafio_final"];
          } else {
            const topicId = attKey.split("__")[0];
            delete st.certificates[topicId];
          }
          saveStudentsDB();
          renderTeacherStudentsTable();
          openStudentDetailModal(studentKey);
          showToast("Intento habilitado nuevamente para el estudiante.", "success");
        });
      });
    }

    document.getElementById("modal-student-detail").classList.remove("hidden");
  }

  function handleTeacherFilterChange() {
    const topicVal = document.getElementById("teacher-filter-topic").value;
    const levelSelect = document.getElementById("teacher-filter-level");
    levelSelect.disabled = topicVal === "desafio_final";
    renderTeacherQuestionsList();
  }

  function renderTeacherQuestionsList() {
    const topicVal = document.getElementById("teacher-filter-topic").value;
    const levelVal = document.getElementById("teacher-filter-level").value;
    const listContainer = document.getElementById("teacher-questions-list");
    const summaryBar = document.getElementById("teacher-questions-summary");

    const questions = topicVal === "desafio_final"
      ? (questionBank.desafio_final || [])
      : (questionBank.topics[topicVal]?.levels[levelVal] || []);

    summaryBar.textContent = `Mostrando ${questions.length} pregunta(s) registradas en esta selección.`;
    listContainer.innerHTML = "";
    const letters = ["A", "B", "C", "D"];

    questions.forEach((q, idx) => {
      const item = document.createElement("div");
      item.className = "tq-item";
      item.innerHTML = `
        <div class="tq-header">
          <strong>#${idx + 1} · ID: ${escapeHtml(q.id)}</strong>
          <div class="tq-actions">
            <button type="button" class="btn btn-secondary btn-sm" data-edit-q="${idx}">Editar</button>
            <button type="button" class="btn btn-crimson btn-sm" data-del-q="${idx}">Eliminar</button>
          </div>
        </div>
        <p style="margin-bottom:8px;">${escapeHtml(q.prompt)}</p>
        ${q.svg ? `<div class="question-svg-box" style="max-width:340px;">${q.svg}</div>` : ""}
        <p style="font-size:0.84rem;color:#198754;font-weight:700;">
          Respuesta correcta: ${letters[q.correctIndex]}) ${escapeHtml(q.options[q.correctIndex])}
        </p>
      `;
      listContainer.appendChild(item);
    });

    listContainer.querySelectorAll("[data-edit-q]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-edit-q"), 10);
        openQuestionEditor(idx);
      });
    });

    listContainer.querySelectorAll("[data-del-q]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-del-q"), 10);
        showConfirmModal({
          title: "Eliminar Pregunta",
          message: "¿Estás seguro de eliminar permanentemente esta pregunta del banco?",
          onConfirm: () => {
            questions.splice(idx, 1);
            saveQuestionBank();
            renderTeacherQuestionsList();
            showToast("Pregunta eliminada correctamente.", "success");
          }
        });
      });
    });
  }

  function openQuestionEditor(editIndex = null) {
    const topicVal = document.getElementById("teacher-filter-topic").value;
    const levelVal = document.getElementById("teacher-filter-level").value;

    document.getElementById("qe-topic").value = topicVal;
    document.getElementById("qe-level").value = levelVal;
    handleEditorTopicChange();

    if (editIndex === null) {
      document.getElementById("modal-qe-title").textContent = "Crear Nueva Pregunta";
      document.getElementById("qe-id").value = "";
      document.getElementById("qe-prompt").value = "";
      document.getElementById("qe-svg").value = "";
      document.getElementById("qe-opt-0").value = "";
      document.getElementById("qe-opt-1").value = "";
      document.getElementById("qe-opt-2").value = "";
      document.getElementById("qe-opt-3").value = "";
      document.getElementById("qe-correct").value = "0";
      document.getElementById("qe-explanation").value = "";
    } else {
      const list = topicVal === "desafio_final"
        ? questionBank.desafio_final
        : questionBank.topics[topicVal].levels[levelVal];
      const q = list[editIndex];
      document.getElementById("modal-qe-title").textContent = `Editar Pregunta #${editIndex + 1}`;
      document.getElementById("qe-id").value = String(editIndex);
      document.getElementById("qe-prompt").value = q.prompt;
      document.getElementById("qe-svg").value = q.svg || "";
      document.getElementById("qe-opt-0").value = q.options[0] || "";
      document.getElementById("qe-opt-1").value = q.options[1] || "";
      document.getElementById("qe-opt-2").value = q.options[2] || "";
      document.getElementById("qe-opt-3").value = q.options[3] || "";
      document.getElementById("qe-correct").value = String(q.correctIndex);
      document.getElementById("qe-explanation").value = q.explanation || "";
      if (topicVal === "desafio_final" && q.topicId) {
        document.getElementById("qe-origin-topic").value = q.topicId;
      }
    }

    updateEditorSvgPreview();
    document.getElementById("modal-question-editor").classList.remove("hidden");
  }

  function handleEditorTopicChange() {
    const isFinal = document.getElementById("qe-topic").value === "desafio_final";
    document.getElementById("qe-level-group").style.display = isFinal ? "none" : "block";
    document.getElementById("qe-origin-topic-group").style.display = isFinal ? "block" : "none";
  }

  function updateEditorSvgPreview() {
    const rawSvg = document.getElementById("qe-svg").value.trim();
    const preview = document.getElementById("qe-svg-preview");
    if (rawSvg.startsWith("<svg")) {
      preview.innerHTML = rawSvg;
      preview.classList.remove("hidden");
    } else {
      preview.innerHTML = "";
      preview.classList.add("hidden");
    }
  }

  function handleSaveQuestionForm(e) {
    e.preventDefault();
    const topicVal = document.getElementById("qe-topic").value;
    const levelVal = document.getElementById("qe-level").value;
    const editIdxRaw = document.getElementById("qe-id").value;

    const targetArray = topicVal === "desafio_final"
      ? questionBank.desafio_final
      : questionBank.topics[topicVal].levels[levelVal];

    const associatedTopicId = topicVal === "desafio_final"
      ? document.getElementById("qe-origin-topic").value
      : topicVal;

    const newQuestionObj = {
      id: editIdxRaw !== "" ? targetArray[parseInt(editIdxRaw, 10)].id : `custom_${Date.now()}`,
      topicId: associatedTopicId,
      level: topicVal === "desafio_final" ? "desafio_final" : levelVal,
      prompt: document.getElementById("qe-prompt").value.trim(),
      svg: document.getElementById("qe-svg").value.trim(),
      options: [
        document.getElementById("qe-opt-0").value.trim(),
        document.getElementById("qe-opt-1").value.trim(),
        document.getElementById("qe-opt-2").value.trim(),
        document.getElementById("qe-opt-3").value.trim()
      ],
      correctIndex: parseInt(document.getElementById("qe-correct").value, 10),
      explanation: document.getElementById("qe-explanation").value.trim()
    };

    if (editIdxRaw !== "") {
      targetArray[parseInt(editIdxRaw, 10)] = newQuestionObj;
      showToast("Pregunta actualizada correctamente.", "success");
    } else {
      targetArray.push(newQuestionObj);
      showToast("Nueva pregunta agregada al banco oficial.", "success");
    }

    saveQuestionBank();
    document.getElementById("teacher-filter-topic").value = topicVal;
    if (topicVal !== "desafio_final") {
      document.getElementById("teacher-filter-level").value = levelVal;
    }
    handleTeacherFilterChange();
    document.getElementById("modal-question-editor").classList.add("hidden");
  }

  function exportQuestionBankJSON() {
    const dataStr = JSON.stringify(questionBank, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profe-fernando-preu-banco-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Banco de preguntas exportado en formato .json.", "success");
  }

  function importQuestionBankJSON() {
    const fileInput = document.getElementById("input-import-bank");
    const file = fileInput.files[0];
    if (!file) {
      showToast("Selecciona primero un archivo .json válido.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed || !parsed.topics || !Array.isArray(parsed.desafio_final)) {
          throw new Error("Estructura JSON incompatible con Profe Fernando PRE-U.");
        }
        questionBank = parsed;
        saveQuestionBank();
        renderTeacherQuestionsList();
        fileInput.value = "";
        showToast("Paquete de preguntas importado exitosamente.", "success");
      } catch (err) {
        showToast(`Error al importar JSON: ${err.message}`, "error");
      }
    };
    reader.readAsText(file);
  }

  function updateTeacherPin() {
    const newPin = document.getElementById("input-new-pin").value.trim();
    if (newPin.length < 4) {
      showToast("El PIN docente debe tener al menos 4 caracteres.", "error");
      return;
    }
    localStorage.setItem(STORAGE_KEYS.TEACHER_PIN, newPin);
    document.getElementById("input-new-pin").value = "";
    showToast("PIN de acceso docente actualizado.", "success");
  }

  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();