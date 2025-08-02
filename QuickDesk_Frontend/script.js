// script.js
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  let isLoggedIn = false;
  let tickets = [
    {
      id: 1,
      subject: "Login Issue",
      description: "Unable to login to my account",
      status: "Open",
      category: "Technical",
      createdAt: new Date()
    },
    {
      id: 2,
      subject: "Billing Question",
      description: "Need clarification on my last invoice",
      status: "Open",
      category: "Billing",
      createdAt: new Date(Date.now() - 86400000)
    }
  ];

  function loadLoginForm() {
    app.innerHTML = `
      <div class="support-image">
        <img src="https://cdn-icons-png.flaticon.com/512/2491/2491903.png" alt="Support Icon">
      </div>
      <h2>Login</h2>
      <form id="loginForm">
        <input type="text" placeholder="Username" required /><br>
        <input type="password" placeholder="Password" required /><br>
        <button type="submit">Login</button>
      </form>
    `;
    
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      isLoggedIn = true;
      loadDashboard();
    });
  }

  function loadRegisterForm() {
    app.innerHTML = `
      <div class="support-image">
        <img src="https://cdn-icons-png.flaticon.com/512/3309/3309953.png" alt="Register Icon">
      </div>
      <h2>Register</h2>
      <form id="registerForm">
        <input type="text" placeholder="Username" required /><br>
        <input type="email" placeholder="Email" required /><br>
        <input type="password" placeholder="Password" required /><br>
        <button type="submit">Register</button>
      </form>
    `;
    
    document.getElementById("registerForm").addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Registration successful! Please login.");
      loadLoginForm();
    });
  }

  function loadDashboard() {
    if (!isLoggedIn) {
      loadLoginForm();
      return;
    }
    
    const ticketsHTML = tickets.map(ticket => `
      <div class="ticket-card">
        <span class="status-badge status-${ticket.status.toLowerCase()}">${ticket.status}</span>
        <h3>${ticket.subject}</h3>
        <p>Category: ${ticket.category}</p>
        <p>Created: ${ticket.createdAt.toLocaleDateString()}</p>
        <button onclick="viewTicket(${ticket.id})">View Details</button>
      </div>
    `).join('');
    
    app.innerHTML = `
      <div class="support-image">
        <img src="https://cdn-icons-png.flaticon.com/512/2885/2885417.png" alt="Dashboard Icon">
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2>Your Tickets</h2>
        <button class="action-button" onclick="loadCreateTicketForm()">
          <i class="fas fa-plus"></i> Create New Ticket
        </button>
      </div>
      ${ticketsHTML}
    `;
  }

  window.viewTicket = function(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    app.innerHTML = `
      <div class="support-image">
        <img src="https://cdn-icons-png.flaticon.com/512/3176/3176272.png" alt="Ticket Icon">
      </div>
      <div class="ticket-card" style="max-width: 800px;">
        <span class="status-badge status-${ticket.status.toLowerCase()}">${ticket.status}</span>
        <h2>${ticket.subject}</h2>
        <p><strong>Category:</strong> ${ticket.category}</p>
        <p><strong>Status:</strong> ${ticket.status}</p>
        <p><strong>Created:</strong> ${ticket.createdAt.toLocaleString()}</p>
        <h3 style="margin-top: 1.5rem; color: var(--gold);">Description</h3>
        <p style="background: #2a2a2a; padding: 1rem; border-radius: 5px;">${ticket.description}</p>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button class="action-button" onclick="loadDashboard()">
            <i class="fas fa-arrow-left"></i> Back to Tickets
          </button>
          ${ticket.status === 'Open' ? `
            <button class="action-button" onclick="closeTicket(${ticket.id})" style="background: linear-gradient(135deg, #ff4444, #cc0000);">
              <i class="fas fa-times"></i> Close Ticket
            </button>
          ` : ''}
        </div>
      </div>
    `;
  };

  window.closeTicket = function(ticketId) {
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex !== -1) {
      tickets[ticketIndex].status = 'Closed';
      viewTicket(ticketId);
    }
  };

  window.loadCreateTicketForm = function() {
    if (!isLoggedIn) {
      loadLoginForm();
      return;
    }
    
    app.innerHTML = `
      <div class="support-image">
        <img src="https://cdn-icons-png.flaticon.com/512/1038/1038100.png" alt="Create Ticket Icon">
      </div>
      <h2>Create Ticket</h2>
      <form id="createTicketForm">
        <input type="text" placeholder="Subject" required /><br>
        <textarea placeholder="Description" rows="5" required></textarea><br>
        <select required>
          <option value="">Select Category</option>
          <option>Technical</option>
          <option>Billing</option>
          <option>General</option>
        </select><br>
        <label style="display: block; margin: 1rem 0 0.5rem; color: var(--text-muted);">
          <i class="fas fa-paperclip"></i> Attachments (optional)
        </label>
        <input type="file" /><br>
        <button type="submit">Submit Ticket</button>
      </form>
    `;
    
    document.getElementById("createTicketForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      const newTicket = {
        id: tickets.length + 1,
        subject: form[0].value,
        description: form[1].value,
        status: "Open",
        category: form[2].value,
        createdAt: new Date()
      };
      tickets.unshift(newTicket);
      loadDashboard();
      alert("Ticket created successfully!");
    });
  };

  document.getElementById("loginBtn").addEventListener("click", loadLoginForm);
  document.getElementById("registerBtn").addEventListener("click", loadRegisterForm);

  // Start with dashboard if logged in, otherwise login form
  isLoggedIn ? loadDashboard() : loadLoginForm();
});