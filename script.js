const loginSection = document.getElementById('loginSection');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('mentor-search');
const searchBtn = document.getElementById('searchBtn');
const mentorGrid = document.getElementById('mentorGrid');
const suggestionsBox = document.getElementById('suggestions-box');
const loginMessage = document.getElementById('loginMessage');

// Toggle Register and Login Views
function toggleRegister() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
}

function toggleLogin() {
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
}

// Handle Registration
async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            document.getElementById('register-success-message').style.display = 'block';
            document.getElementById('register-error-message').style.display = 'none';
            setTimeout(() => toggleLogin(), 2000); // Redirect to login after 2 seconds
        } else {
            const data = await response.json();
            document.getElementById('register-error-message').textContent = data.message || 'Registration failed!';
            document.getElementById('register-error-message').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('register-error-message').textContent = 'Server error!';
        document.getElementById('register-error-message').style.display = 'block';
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Login successful!');
            window.location.href = '/index.html'; // Redirect to home page
        } else {
            document.getElementById('login-error-message').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('login-error-message').textContent = 'Server error!';
        document.getElementById('login-error-message').style.display = 'block';
    }
}


// Handle search suggestions
searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        const suggestions = await fetchSuggestions(query);
        displaySuggestions(suggestions);
    } else {
        suggestionsBox.innerHTML = '';
    }
});

// Fetch suggestions from the server
async function fetchSuggestions(query) {
    const response = await fetch(`/api/suggestions?q=${query}`);
    const suggestions = await response.json();
    return suggestions;
}

// Display search suggestions
function displaySuggestions(suggestions) {
    if (suggestions.length === 0) {
        suggestionsBox.innerHTML = '<p>No suggestions found</p>';
    } else {
        suggestionsBox.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" onclick="handleSuggestionClick('${suggestion}')">
                ${suggestion}
            </div>
        `).join('');
    }
}

// Handle suggestion click
function handleSuggestionClick(suggestion) {
    searchInput.value = suggestion;
    suggestionsBox.innerHTML = '';
    searchMentors(suggestion);
}

// Search mentors
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    searchMentors(query);
});

// Search mentors from the server
async function searchMentors(query) {
    const response = await fetch(`/api/mentors?q=${query}`);
    const mentors = await response.json();
    displayMentors(mentors);
}

// Display mentors in the grid
function displayMentors(mentors) {
    mentorGrid.innerHTML = mentors.map(mentor => `
        <div class="card">
            <h3>${mentor.name}</h3>
            <p>${mentor.role}</p>
            <div class="tags">
                ${mentor.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
            </div>
            <p>⭐ ${mentor.rating.toFixed(1)}</p>
        </div>
    `).join('');
}
