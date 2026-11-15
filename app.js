(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- 1. Matrix Binary Rain Canvas ---------------- */
  function initMatrixRain() {
    const canvas = document.getElementById("matrix-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 14;
    let columns = 0;
    let drops = [];
    let rafId = null;
    let lastTick = 0;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      columns = Math.max(1, Math.floor(canvas.width / fontSize));
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * 24));
    }

    function drawStatic() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      for (let i = 0; i < columns; i++) {
        for (let row = 0; row < 10; row++) {
          const y = (row * 2 + (i % 3)) * fontSize;
          if (y > canvas.height) continue;
          const fade = Math.max(0, 1 - y / canvas.height);
          ctx.fillStyle = `rgba(57, 255, 20, ${(0.16 * fade).toFixed(3)})`;
          ctx.fillText(Math.random() > 0.5 ? "1" : "0", i * fontSize, y);
        }
      }
    }

    function tick(timestamp) {
      if (timestamp - lastTick >= 70) {
        lastTick = timestamp;
        ctx.fillStyle = "rgba(7, 11, 7, 0.14)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

        for (let i = 0; i < drops.length; i++) {
          const y = drops[i] * fontSize;
          const fade = Math.max(0, 1 - y / (canvas.height * 0.96));
          if (fade > 0.02) {
            ctx.fillStyle = `rgba(57, 255, 20, ${(0.28 * fade).toFixed(3)})`;
            const bit = Math.random() > 0.5 ? "1" : "0";
            ctx.fillText(bit, i * fontSize, y);
          }
          if (y > canvas.height && Math.random() > 0.97) {
            drops[i] = 0;
          } else {
            drops[i]++;
          }
        }
      }
      rafId = window.requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", () => {
      resize();
      if (prefersReducedMotion) drawStatic();
    });

    if (prefersReducedMotion) {
      drawStatic();
    } else {
      rafId = window.requestAnimationFrame(tick);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden && rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        } else if (!document.hidden && !rafId) {
          rafId = window.requestAnimationFrame(tick);
        }
      });
    }
  }

  /* ---------------- 2. Mobile Navigation ---------------- */
  function initNavigation() {
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;

    const closeNav = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("click", closeNav);
    });
  }

  /* ---------------- 3. Event Countdown (Nov 18, 2026 12:30 PM UTC+8) ---------------- */
  function initCountdown() {
    const targetText = document.getElementById("countdown-text");
    if (!targetText) return;

    const start = new Date("2026-11-18T12:30:00+08:00").getTime();
    const end = new Date("2026-11-18T17:00:00+08:00").getTime();

    function update() {
      const now = Date.now();
      if (now < start) {
        const diff = start - now;
        const days = Math.floor(diff / 86400000);
        const hrs = Math.floor((diff % 86400000) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        targetText.textContent = `Starts in ${days}d ${String(hrs).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
      } else if (now <= end) {
        targetText.textContent = "LIVE NOW · NU Dasmariñas (12:30 PM–5:00 PM)";
      } else {
        targetText.textContent = "Nov 18, 2026 · PR #2026 Shipped!";
      }
    }

    update();
    window.setInterval(update, 1000);
  }

  /* ---------------- 4. Interactive Tardigrade Clones ---------------- */
  function initClones() {
    const clones = document.querySelectorAll(".tardigrade-clone");
    const msgEl = document.getElementById("clone-message");
    if (!clones.length || !msgEl) return;

    const activateClone = (el) => {
      clones.forEach((c) => c.classList.remove("is-selected"));
      el.classList.add("is-selected");
      const name = el.getAttribute("data-clone") || "clone";
      const status = el.getAttribute("data-status") || "";
      msgEl.textContent = `[${name}] ${status}`;
    };

    clones.forEach((clone) => {
      clone.addEventListener("mouseenter", () => activateClone(clone));
      clone.addEventListener("click", () => activateClone(clone));
      clone.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activateClone(clone);
        }
      });
    });
  }

  /* ---------------- 5. Session 1 Command Explorer ---------------- */
  function initCommandExplorer() {
    const buttons = document.querySelectorAll(".cmd-btn");
    const preview = document.getElementById("session1-cmd-preview");
    if (!buttons.length || !preview) return;

    const catalog = {
      clone: {
        syntax: "$ git clone https://github.com/awslc-nud/git-started.git",
        desc: "Downloads a complete copy of a remote GitHub repository to your local machine."
      },
      add: {
        syntax: "$ git add README.md",
        desc: "Moves your updated files into the staging area so Git knows what to include in the next snapshot."
      },
      commit: {
        syntax: '$ git commit -m "feat: add participant bio"',
        desc: "Records a permanent snapshot of your staged changes with a clear message explaining why."
      },
      push: {
        syntax: "$ git push origin main",
        desc: "Uploads your local commits to the remote GitHub repository so teammates can review them."
      },
      pull: {
        syntax: "$ git pull origin main",
        desc: "Fetches and merges the latest commits from GitHub down into your local branch."
      }
    };

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-cmd");
        const entry = catalog[key];
        if (!entry) return;
        buttons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        preview.innerHTML = "";
        const codeEl = document.createElement("code");
        codeEl.textContent = entry.syntax;
        const spanEl = document.createElement("span");
        spanEl.textContent = entry.desc;
        preview.append(codeEl, spanEl);
      });
    });
  }

  /* ---------------- 6. Session 2 Step Tracker ---------------- */
  function initStepTracker() {
    const checks = document.querySelectorAll(".track-step-check");
    const bar = document.getElementById("session2-progress");
    if (!checks.length || !bar) return;

    const updateProgress = () => {
      const done = Array.from(checks).filter((c) => c.checked).length;
      const pct = Math.round((done / checks.length) * 100);
      bar.style.width = `${pct}%`;
    };

    checks.forEach((chk) => chk.addEventListener("change", updateProgress));
    updateProgress();
  }

  /* ---------------- 7. Interactive Git Sandbox Terminal ---------------- */
  function initSandboxTerminal() {
    const output = document.getElementById("terminal-output");
    const form = document.getElementById("terminal-form");
    const input = document.getElementById("terminal-input");
    const branchLabel = document.getElementById("terminal-branch-label");
    const resetBtn = document.getElementById("reset-terminal-btn");
    const presetButtons = document.querySelectorAll(".quick-cmd, .cheat-item");
    if (!output || !form || !input || !branchLabel) return;

    const createInitialState = () => ({
      initialized: true,
      repoName: "git-started",
      remoteUrl: "https://github.com/awslc-nud/git-started.git",
      hasRemote: true,
      branch: "main",
      branches: ["main"],
      workingFiles: {
        "README.md": "clean",
        "workshop_notes.md": "modified",
        "hello.txt": "untracked"
      },
      commits: ["pr#2026: reschedule workshop to Nov 18, 2026"],
      pushedBranches: { main: true },
      remoteUpdates: 1
    });

    let state = createInitialState();

    const appendLine = (text, cls = "") => {
      const div = document.createElement("div");
      div.className = `line ${cls}`.trim();
      div.textContent = text;
      output.appendChild(div);
      output.scrollTop = output.scrollHeight;
    };

    const updatePrompt = () => {
      branchLabel.textContent = `(${state.branch}) $`;
    };

    const getFilesByStatus = (status) =>
      Object.entries(state.workingFiles)
        .filter(([, fileStatus]) => fileStatus === status)
        .map(([name]) => name);

    const runCommand = (raw) => {
      const cmd = raw.trim();
      if (!cmd) return;
      appendLine(`(${state.branch}) $ ${cmd}`, "cmd");

      const lower = cmd.toLowerCase();

      if (lower === "clear") {
        output.innerHTML = "";
        return;
      }

      if (lower === "help") {
        appendLine(
          "Commands: git init [dir], git clone [url], git status, git add [file|.], git commit -m \"msg\", git push origin [branch], git pull, git branch [name|-d name], git checkout -b <name>, git log, clear",
          "dim"
        );
        return;
      }

      // 1. git init [optional-dir]
      const initMatch = cmd.match(/^git\s+init(?:\s+([a-zA-Z0-9._-]+))?$/i);
      if (initMatch) {
        const customDir = initMatch[1];
        if (customDir) {
          state = {
            initialized: true,
            repoName: customDir,
            remoteUrl: "",
            hasRemote: false,
            branch: "main",
            branches: ["main"],
            workingFiles: { "README.md": "untracked" },
            commits: [],
            pushedBranches: {},
            remoteUpdates: 0
          };
          updatePrompt();
          appendLine(`Initialized empty Git repository in /workspace/${customDir}/.git/`, "ok");
          return;
        }
        state.initialized = true;
        appendLine(`Initialized Git repository in /workspace/${state.repoName}/.git/ (on branch '${state.branch}').`, "ok");
        return;
      }

      // 2. git clone [url]
      const cloneMatch = cmd.match(/^git\s+clone(?:\s+(\S+))?$/i);
      if (cloneMatch) {
        const url = cloneMatch[1] || "https://github.com/awslc-nud/git-started.git";
        const slug = url.split("/").filter(Boolean).pop() || "git-started";
        const folder = slug.replace(/\.git$/i, "") || "git-started";
        state = {
          ...createInitialState(),
          repoName: folder,
          remoteUrl: url
        };
        updatePrompt();
        appendLine(`Cloning into '${folder}' from ${url}...`, "dim");
        appendLine("remote: Enumerating objects: 28, done.", "dim");
        appendLine(`Repository '${folder}' cloned! Starter files ready for 'git status' and 'git add'.`, "ok");
        return;
      }

      // 3. git status
      if (lower === "git status") {
        appendLine(`On branch ${state.branch}`);
        const staged = getFilesByStatus("staged");
        const modified = getFilesByStatus("modified");
        const untracked = getFilesByStatus("untracked");

        if (staged.length) {
          appendLine(`Changes to be committed: ${staged.join(", ")}`, "ok");
        }
        if (modified.length) {
          appendLine(`Changes not staged for commit: modified: ${modified.join(", ")} (run 'git add <file>' or 'git add .')`);
        }
        if (untracked.length) {
          appendLine(`Untracked files: ${untracked.join(", ")} (run 'git add .')`, "dim");
        }
        if (!staged.length && !modified.length && !untracked.length) {
          if (state.pushedBranches[state.branch]) {
            appendLine(`Your branch is up to date with 'origin/${state.branch}'. Nothing to commit, working tree clean.`, "ok");
          } else {
            appendLine(`Local commits ahead of 'origin/${state.branch}'. Run 'git push origin ${state.branch}'.`, "ok");
          }
        }
        return;
      }

      // 4. git add [file | . | -A]
      const addMatch = cmd.match(/^git\s+add(?:\s+(.+))?$/i);
      if (addMatch) {
        const target = (addMatch[1] || "").trim();
        if (!target) {
          appendLine("Nothing specified. Usage: git add <file> or git add .", "err");
          return;
        }
        if (target === "." || target === "-A" || target === "--all") {
          let count = 0;
          Object.keys(state.workingFiles).forEach((name) => {
            if (state.workingFiles[name] === "modified" || state.workingFiles[name] === "untracked") {
              state.workingFiles[name] = "staged";
              count += 1;
            }
          });
          if (count === 0) {
            appendLine("Working tree already clean — no modified or untracked files left to stage.", "dim");
          } else {
            appendLine(`Staged ${count} file(s) into the staging area. Ready for 'git commit -m "..."'.`, "ok");
          }
          return;
        }

        const currentStatus = state.workingFiles[target];
        if (currentStatus === "clean") {
          appendLine(`No uncommitted changes in '${target}'. Try 'git add .' or edit a tracked file.`, "dim");
          return;
        }
        if (currentStatus === "staged") {
          appendLine(`'${target}' is already staged and ready to commit.`, "dim");
          return;
        }
        state.workingFiles[target] = "staged";
        appendLine(`Staged '${target}' into the staging area. Ready for 'git commit -m "..."'.`, "ok");
        return;
      }

      // 5. git commit -m "[message]"
      const commitMatch = cmd.match(/^git\s+commit\s+-m\s+["'](.+)["']$/i);
      if (commitMatch) {
        const staged = getFilesByStatus("staged");
        if (!staged.length) {
          appendLine("Nothing staged to commit! Run 'git add [file]' or 'git add .' first.", "err");
          return;
        }
        staged.forEach((name) => {
          state.workingFiles[name] = "clean";
        });
        state.pushedBranches[state.branch] = false;
        state.commits.unshift(`[${state.branch}] ${commitMatch[1]}`);
        appendLine(`[${state.branch} 7a18nov] ${commitMatch[1]} (${staged.length} file(s) changed)`, "ok");
        return;
      }

      // 6. git push [origin [branch]]
      const pushMatch = cmd.match(/^git\s+push(?:\s+origin(?:\s+([a-zA-Z0-9._/-]+))?)?$/i);
      if (pushMatch) {
        if (!state.hasRemote) {
          appendLine("No 'origin' remote configured for this local-only repo. Run 'git clone ...' or Reset Repo.", "err");
          return;
        }
        const targetBranch = pushMatch[1] || state.branch;
        if (!state.branches.includes(targetBranch)) {
          appendLine(`error: src refspec '${targetBranch}' does not match any local branch.`, "err");
          return;
        }
        if (state.pushedBranches[targetBranch] && targetBranch === "main" && state.commits.length <= 1) {
          appendLine(`Everything up-to-date on origin/${targetBranch}. Make a commit or switch branches first!`, "dim");
          return;
        }
        state.pushedBranches[targetBranch] = true;
        appendLine(`Enumerating objects... pushed '${targetBranch}' -> origin/${targetBranch}!`, "ok");
        if (targetBranch !== "main") {
          appendLine(`Tip: Open a Pull Request on GitHub comparing '${targetBranch}' -> 'main'.`, "dim");
        }
        return;
      }

      // 7. git pull [origin [branch]]
      if (/^git\s+pull(?:\s+\S+)*$/i.test(cmd)) {
        if (!state.hasRemote) {
          appendLine("No remote repository connected to pull from. Try 'git clone' or Reset Repo.", "err");
          return;
        }
        if (state.remoteUpdates > 0) {
          state.remoteUpdates = 0;
          state.commits.unshift("[origin/main] docs: add NU Dasmarinas room & check-in notes");
          appendLine(`From ${state.remoteUrl}`, "dim");
          appendLine(` * branch ${state.branch} -> FETCH_HEAD`, "dim");
          appendLine(`Fast-forward merged remote updates into '${state.branch}'.`, "ok");
        } else {
          appendLine(`Already up to date with origin/${state.branch}.`, "ok");
        }
        return;
      }

      // 8. git branch [list | create | delete]
      if (lower === "git branch") {
        state.branches.forEach((b) => {
          appendLine(b === state.branch ? `* ${b}` : `  ${b}`, b === state.branch ? "ok" : "");
        });
        return;
      }

      const branchDeleteMatch = cmd.match(/^git\s+branch\s+-(?:d|D)\s+([a-zA-Z0-9._/-]+)$/);
      if (branchDeleteMatch) {
        const target = branchDeleteMatch[1];
        if (target === state.branch) {
          appendLine(`error: Cannot delete the branch '${target}' you are currently on.`, "err");
          return;
        }
        if (!state.branches.includes(target)) {
          appendLine(`error: branch '${target}' not found.`, "err");
          return;
        }
        state.branches = state.branches.filter((b) => b !== target);
        delete state.pushedBranches[target];
        appendLine(`Deleted branch '${target}'.`, "ok");
        return;
      }

      const branchCreateMatch = cmd.match(/^git\s+branch\s+([a-zA-Z0-9._/-]+)$/);
      if (branchCreateMatch) {
        const newBranch = branchCreateMatch[1];
        if (state.branches.includes(newBranch)) {
          appendLine(`fatal: a branch named '${newBranch}' already exists.`, "err");
          return;
        }
        state.branches.push(newBranch);
        state.pushedBranches[newBranch] = false;
        appendLine(`Created branch '${newBranch}'. Use 'git checkout ${newBranch}' to switch to it.`, "ok");
        return;
      }

      // 9. git checkout -b <branch> | git switch -c <branch> | switch existing
      const createSwitchMatch = cmd.match(/^git\s+(?:checkout\s+-b|switch\s+-c)\s+([a-zA-Z0-9._/-]+)$/);
      if (createSwitchMatch) {
        const newBranch = createSwitchMatch[1];
        if (state.branches.includes(newBranch)) {
          state.branch = newBranch;
          updatePrompt();
          appendLine(`Branch '${newBranch}' already existed — switched to '${newBranch}'.`, "ok");
          return;
        }
        state.branches.push(newBranch);
        state.branch = newBranch;
        state.pushedBranches[newBranch] = false;
        updatePrompt();
        appendLine(`Switched to a new branch '${state.branch}'`, "ok");
        return;
      }

      const switchExistingMatch = cmd.match(/^git\s+(?:checkout|switch)\s+([a-zA-Z0-9._/-]+)$/);
      if (switchExistingMatch) {
        const target = switchExistingMatch[1];
        if (!state.branches.includes(target)) {
          appendLine(`pathspec '${target}' did not match any branch. Try 'git checkout -b ${target}'.`, "err");
          return;
        }
        state.branch = target;
        updatePrompt();
        appendLine(`Switched to branch '${state.branch}'`, "ok");
        return;
      }

      if (lower === "git log") {
        if (!state.commits.length) {
          appendLine("Your branch does not have any commits yet.", "dim");
          return;
        }
        state.commits.slice(0, 5).forEach((entry, idx) => {
          appendLine(`* commit 2026nov${idx + 1} — ${entry}`);
        });
        return;
      }

      appendLine(`Command not recognized in preview sandbox: '${cmd}'. Try 'help'.`, "err");
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      runCommand(input.value);
      input.value = "";
    });

    presetButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cmd = btn.getAttribute("data-run");
        if (cmd) {
          runCommand(cmd);
          if (btn.classList.contains("cheat-item")) {
            output.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        state = createInitialState();
        updatePrompt();
        output.innerHTML = "";
        appendLine("Repository reset to clean sandbox state on branch 'main'.", "dim");
      });
    }
  }

  /* ---------------- 8. Session 3 Merge Conflict Lab ---------------- */
  function initConflictLab() {
    const box = document.getElementById("conflict-box");
    const statusBadge = document.getElementById("conflict-status-badge");
    const feedback = document.getElementById("conflict-feedback");
    const buttons = document.querySelectorAll(".btn-resolve");
    if (!box || !statusBadge || !feedback || !buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const choice = btn.getAttribute("data-choice");
        box.innerHTML = "";
        const line = document.createElement("div");

        if (choice === "incoming") {
          line.className = "diff-line resolved-final";
          line.textContent = "Workshop Date: Nov 18, 2026 (Wed) · 12:30 PM–5:00 PM @ NU Dasmariñas";
          box.appendChild(line);
          statusBadge.textContent = "PR #2026 APPROVED";
          statusBadge.classList.add("resolved");
          feedback.textContent = "Nice! Conflict markers removed cleanly, accurate schedule kept, and PR #2026 is ready to merge.";
        } else if (choice === "both") {
          line.className = "diff-line resolved-final";
          line.textContent = "Event Rescheduled! Confirmed Date: Nov 18, 2026 (Wed) · 12:30 PM–5:00 PM @ NU Dasmariñas";
          box.appendChild(line);
          statusBadge.textContent = "PR #2026 APPROVED";
          statusBadge.classList.add("resolved");
          feedback.textContent = "Resolved! Combining reschedule context + confirmed date keeps every attendee informed.";
        } else {
          line.className = "diff-line old";
          line.textContent = "Workshop Date: Pending reschedule...";
          box.appendChild(line);
          statusBadge.textContent = "Needs Review";
          statusBadge.classList.remove("resolved");
          feedback.textContent = "Heads up! Keeping the outdated draft hides the Nov 18 date—try 'Accept Updated Schedule' instead.";
        }
      });
    });
  }

  /* ---------------- 9. Calendar .ics Generator & Email Copy ---------------- */
  function initUtilities() {
    const toast = document.getElementById("toast");
    let toastTimer = null;

    const showToast = (msg) => {
      if (!toast) return;
      toast.textContent = msg;
      toast.hidden = false;
      if (toastTimer) window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => {
        toast.hidden = true;
      }, 3200);
    };

    const icsBtn = document.getElementById("download-ics-btn");
    if (icsBtn) {
      icsBtn.addEventListener("click", () => {
        // Nov 18, 2026 12:30 PM - 5:00 PM Asia/Manila (UTC+8) -> 04:30Z to 09:00Z
        const ics = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "PRODID:-//AWS Learning Club NU Dasmarinas//Git Started 2026//EN",
          "BEGIN:VEVENT",
          "UID:git-started-2026@awslcnud.org",
          "DTSTAMP:20261115T120000Z",
          "DTSTART:20261118T043000Z",
          "DTEND:20261118T090000Z",
          "SUMMARY:Git Started: Safe & Inclusive Version Control (AWS Learning Club)",
          "LOCATION:NU Dasmariñas",
          "DESCRIPTION:Sessions: 1) Git & GitHub Foundations, 2) Hands-On Beginner Track, 3) Intermediate Workflows (Branching, Merge Conflicts & Pull Requests). Contact: AWSLCNUD@GMAIL.COM",
          "END:VEVENT",
          "END:VCALENDAR"
        ].join("\r\n");

        const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "git-started-nov-18-2026.ics";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        showToast("Downloaded git-started-nov-18-2026.ics calendar invite!");
      });
    }

    const copyBtn = document.getElementById("copy-email-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        const text = copyBtn.getAttribute("data-copy") || "AWSLCNUD@GMAIL.COM";
        try {
          await navigator.clipboard.writeText(text);
          showToast(`Copied ${text} to clipboard`);
        } catch {
          showToast(`Email: ${text}`);
        }
      });
    }
  }

  initMatrixRain();
  initNavigation();
  initCountdown();
  initClones();
  initCommandExplorer();
  initStepTracker();
  initSandboxTerminal();
  initConflictLab();
  initUtilities();
})();
