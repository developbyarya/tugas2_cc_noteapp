async function fetchJSON(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Request failed");
  }
  return res.json();
}

function getNoteIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[0];
}

function setStatus(message, isError = false) {
  const el = document.getElementById("status-message");
  el.textContent = message;
  el.className = `status-message ${isError ? "error" : "success"}`;
  if (message) {
    setTimeout(() => {
      el.textContent = "";
      el.className = "status-message";
    }, 2000);
  }
}

function setMeta(note) {
  const el = document.getElementById("note-meta");
  if (!note.updatedAt) {
    el.textContent = "";
    return;
  }
  const d = new Date(note.updatedAt);
  el.textContent = `Last updated ${d.toLocaleString()}`;
}

async function loadNote() {
  const id = getNoteIdFromPath();
  if (!id) {
    setStatus("Invalid note id in URL", true);
    return;
  }
  try {
    const note = await fetchJSON(`/api/notes/${id}`);
    document.getElementById("note-title").value = note.title || "";
    document.getElementById("note-content").value = note.content || "";
    setMeta(note);
  } catch (err) {
    console.error(err);
    setStatus("Failed to load note", true);
  }
}

async function saveNote() {
  const id = getNoteIdFromPath();
  const title = document.getElementById("note-title").value.trim() || "Untitled note";
  const content = document.getElementById("note-content").value;
  try {
    const note = await fetchJSON(`/api/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, content }),
    });
    setMeta(note);
    setStatus("Saved");
  } catch (err) {
    console.error(err);
    setStatus("Failed to save note", true);
  }
}

async function deleteNote() {
  const id = getNoteIdFromPath();
  if (!window.confirm("Delete this note? This cannot be undone.")) {
    return;
  }
  try {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    window.location.href = "/";
  } catch (err) {
    console.error(err);
    setStatus("Failed to delete note", true);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("save-btn").addEventListener("click", saveNote);
  document.getElementById("delete-btn").addEventListener("click", deleteNote);
  loadNote();
});

