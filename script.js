// ── State ──────────────────────────────────────────────────────────────────
let tasks = JSON.parse(localStorage.getItem("brutalist-tasks") || "[]");
let filter = "all";
let dragSrc = null;

const PRIORITIES = ["low", "med", "high"];
const PRIORITY_LABELS = { low: "LOW", med: "MED", high: "HIGH" };

// ── Persistence ────────────────────────────────────────────────────────────
function save() {
    localStorage.setItem("brutalist-tasks", JSON.stringify(tasks));
}

// ── Factory ────────────────────────────────────────────────────────────────
function newTask(text) {
    return { id: Date.now(), text, done: false, priority: "low" };
}

// ── Helpers ────────────────────────────────────────────────────────────────
function escHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// ── Render ─────────────────────────────────────────────────────────────────
function render() {
    const list = document.getElementById("task-list");
    const emptyMsg = document.getElementById("empty-msg");

    const visible = tasks.filter((t) => {
        if (filter === "active") return !t.done;
        if (filter === "completed") return t.done;
        if (filter === "high") return t.priority === "high";
        return true;
    });

    list.innerHTML = "";
    emptyMsg.style.display = visible.length === 0 ? "block" : "none";

    visible.forEach((t) => {
        const li = document.createElement("li");
        li.className = "task-item" + (t.done ? " completed" : "");
        li.draggable = true;
        li.dataset.id = t.id;

        li.innerHTML = `
      <div class="check-wrap ${t.done ? "checked" : ""}" title="Toggle complete">
        <svg class="check-mark" viewBox="0 0 16 16">
          <polyline points="2,8 6,12 14,4"/>
        </svg>
      </div>
      <span class="task-text">${escHtml(t.text)}</span>
      <span class="priority-tag ${t.priority}" title="Click to change priority">
        ${PRIORITY_LABELS[t.priority]}
      </span>
      <button class="del-btn" title="Delete task">✕</button>
    `;

        // Events
        li.querySelector(".check-wrap").addEventListener("click", () =>
            toggleDone(t.id, li),
        );
        li.querySelector(".priority-tag").addEventListener("click", () =>
            cyclePriority(t.id),
        );
        li.querySelector(".del-btn").addEventListener("click", () =>
            deleteTask(t.id, li),
        );

        // Drag & drop
        li.addEventListener("dragstart", (e) => {
            dragSrc = li;
            li.classList.add("dragging");
            e.dataTransfer.effectAllowed = "move";
        });
        li.addEventListener("dragend", () => {
            li.classList.remove("dragging");
            document
                .querySelectorAll(".drag-over")
                .forEach((el) => el.classList.remove("drag-over"));
        });
        li.addEventListener("dragover", (e) => {
            e.preventDefault();
            if (li !== dragSrc) li.classList.add("drag-over");
        });
        li.addEventListener("dragleave", () =>
            li.classList.remove("drag-over"),
        );
        li.addEventListener("drop", (e) => {
            e.preventDefault();
            li.classList.remove("drag-over");
            if (dragSrc && dragSrc !== li)
                reorderTasks(dragSrc.dataset.id, t.id);
        });

        list.appendChild(li);
    });

    updateCounters();
}

// ── Counter Update ─────────────────────────────────────────────────────────
function updateCounters() {
    document.getElementById("pending-count").textContent = tasks.filter(
        (t) => !t.done,
    ).length;
    document.getElementById("done-count").textContent = tasks.filter(
        (t) => t.done,
    ).length;
}

// ── Actions ────────────────────────────────────────────────────────────────
function addTask(text) {
    text = text.trim();
    if (!text) return;
    tasks.unshift(newTask(text));
    save();
    render();
}

function toggleDone(id, li) {
    const t = tasks.find((t) => t.id === id);
    if (!t) return;
    t.done = !t.done;
    save();
    if (t.done) {
        li.classList.add("done-flash");
        setTimeout(() => {
            li.classList.remove("done-flash");
            render();
        }, 350);
    } else {
        render();
    }
}

function cyclePriority(id) {
    const t = tasks.find((t) => t.id === id);
    if (!t) return;
    const idx = PRIORITIES.indexOf(t.priority);
    t.priority = PRIORITIES[(idx + 1) % PRIORITIES.length];
    save();
    render();
}

function deleteTask(id, li) {
    li.classList.add("removing");
    setTimeout(() => {
        tasks = tasks.filter((t) => t.id !== id);
        save();
        render();
    }, 200);
}

function reorderTasks(srcId, tgtId) {
    const si = tasks.findIndex((t) => t.id == srcId);
    const ti = tasks.findIndex((t) => t.id == tgtId);
    if (si === -1 || ti === -1) return;
    const [moved] = tasks.splice(si, 1);
    tasks.splice(ti, 0, moved);
    save();
    render();
}

function clearCompleted() {
    tasks = tasks.filter((t) => !t.done);
    save();
    render();
}

// ── Event Listeners ────────────────────────────────────────────────────────
document.getElementById("add-btn").addEventListener("click", () => {
    const inp = document.getElementById("task-input");
    addTask(inp.value);
    inp.value = "";
    inp.focus();
});

document.getElementById("task-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTask(e.target.value);
        e.target.value = "";
    }
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        document
            .querySelectorAll(".filter-btn")
            .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        filter = btn.dataset.filter;
        render();
    });
});

document.getElementById("clear-done").addEventListener("click", clearCompleted);

// ── Init ───────────────────────────────────────────────────────────────────
render();
