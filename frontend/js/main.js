const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search-input");
const genreSelect = document.getElementById("genre-select");
const loader = document.getElementById("loader");

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

async function loadBooks(url = "http://localhost:3000/api/books") {
  showLoader(); // 🔵 Show loader

  const res = await fetch(url);

  if (!res.ok) {
    console.error("Failed to fetch books:", res.status);
    return;
  }

  const data = await res.json();
  const books = Array.isArray(data) ? data : data.books; // ✅ Handles both shapes

  if (!Array.isArray(books)) {
    console.error("Expected an array but got:", books);
    return;
  }

  bookList.innerHTML = "";

  books.forEach((book) => {
    const div = document.createElement("div");
    div.className =
      "bg-white/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg p-4 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer";

    div.innerHTML = `
      <img src="http://localhost:3000${book.cover}" 
           alt="${book.title}" 
           class="rounded-md h-48 w-full object-contain md:object-fill mb-4 transition duration-300 hover:opacity-90"
      />
      <h3 class="text-lg font-bold text-blue-800 mb-1">${book.title}</h3>
      <p class="text-sm text-gray-700 mb-1">${book.author}</p>
      <span class="inline-block text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium mb-3">
        ${book.genre || "Unknown"}
      </span>
      <a href="book.html?id=${book.id}"
         class="inline-block text-sm text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-all">
         📖 Read Now
      </a>
    `;
    bookList.appendChild(div);
  });

  if (books.length === 0) {
    bookList.innerHTML = `<p class="text-center text-gray-500 italic">No books found.</p>`;
  }

  // 🟢 Always hide loader after fetch
  setTimeout(() => {
    hideLoader(); // Hide loader after content is fully rendered
  }, 300); // Adjust to 500+ ms if needed
}

async function loadGenres() {
  try {
    const res = await fetch("http://localhost:3000/api/books/genres");
    const data = await res.json();

    if (!data.genres || !Array.isArray(data.genres)) {
      throw new Error("Invalid genre data received");
    }

    genreSelect.innerHTML = `<option value="">All Genres</option>`;
    data.genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      genreSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Failed to load genres:", error);
  }
}

searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim();
  if (q.length === 0) return loadBooks();
  loadBooks(
    `http://localhost:3000/api/books/search?q=${encodeURIComponent(q)}`
  );
});

genreSelect.addEventListener("change", () => {
  const genre = genreSelect.value;
  if (!genre) return loadBooks();
  loadBooks(`http://localhost:3000/api/books/genre/${genre}`);
});

document.addEventListener("DOMContentLoaded", () => {
  loadBooks();
  loadGenres();
});
