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

function createNoteCard(note) {
  const item = document.createElement("a");
  item.className = "note-card";
  item.href = `/${note.id}`;

  const title = document.createElement("h3");
  title.className = "note-card-title";
  title.textContent = note.title || "Untitled";

  const snippet = document.createElement("p");
  snippet.className = "note-card-snippet";
  const content = note.content || "";
  snippet.textContent =
    content.length > 100 ? `${content.slice(0, 100)}…` : content;

  const meta = document.createElement("p");
  meta.className = "note-card-meta";
  if (note.updatedAt) {
    const d = new Date(note.updatedAt);
    meta.textContent = `Updated ${d.toLocaleString()}`;
  }

  item.appendChild(title);
  item.appendChild(snippet);
  item.appendChild(meta);

  return item;
}

async function loadNotes() {
  const list = document.getElementById("notes-list");
  const emptyState = document.getElementById("empty-state");
  const lastUpdatedEl = document.getElementById("last-updated");
  list.innerHTML = "";

  try {
    const notes = await fetchJSON("/api/notes");
    if (!notes.length) {
      emptyState.classList.remove("hidden");
      if (lastUpdatedEl) {
        lastUpdatedEl.textContent = "";
      }
      return;
    }
    emptyState.classList.add("hidden");
    notes.forEach((note) => {
      list.appendChild(createNoteCard(note));
    });

    if (lastUpdatedEl && notes[0] && notes[0].updatedAt) {
      const d = new Date(notes[0].updatedAt);
      lastUpdatedEl.textContent = `Last note updated ${d.toLocaleString()}`;
    }
  } catch (err) {
    console.error(err);
    emptyState.textContent = "Failed to load notes.";
    emptyState.classList.remove("hidden");
  }
}

async function handleNewNote() {
  try {
    const note = await fetchJSON("/api/notes", {
      method: "POST",
      body: JSON.stringify({ title: "Untitled note", content: "" }),
    });
    window.location.href = `/${note.id}`;
  } catch (err) {
    alert("Failed to create note.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const newNoteBtn = document.getElementById("new-note-btn");
  newNoteBtn.addEventListener("click", handleNewNote);
  loadNotes();
});

