document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  let tickets = [
    {
      id: 1,
      subject: "Login Issue",
      description: "Unable to login to my account",
      status: "Open",
      category: "Technical",
      createdAt: new Date(),
    },
    {
      id: 2,
      subject: "Billing Question",
      description: "Need clarification on my last invoice",
      status: "Open",
      category: "Billing",
      createdAt: new Date(Date.now() - 86400000 * 2),
    },
  ];

  function isUserLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
  }

  function timeAgo(date) {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  function renderStatsPanel() {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "Open").length;
    const assigned = tickets.filter((t) =>
      ["Assigned", "In Progress"].includes(t.status)
    ).length;
    const closed = tickets.filter((t) => t.status === "Closed").length;

    return `
      <div class="stats-panel">
        <h3>\u{1F4CA} Ticket Statistics</h3>
        <p><strong>Total:</strong> ${total}</p>
        <p><strong>Open:</strong> ${open}</p>
        <p><strong>Assigned/In Progress:</strong> ${assigned}</p>
        <p><strong>Closed:</strong> ${closed}</p>
      </div>
    `;
  }

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
      localStorage.setItem("isLoggedIn", "true");
      loadDashboard();
    });
  }

  function loadDashboard() {
    const ticketsHTML = tickets
      .map(
        (ticket) => `
      <div class="ticket-card">
        <span class="status-badge status-${ticket.status.toLowerCase()}">${ticket.status}</span>
        <h3>${ticket.subject}</h3>
        <p>Category: ${ticket.category}</p>
        <p>Created: ${timeAgo(ticket.createdAt)}</p>
        <button onclick="viewTicket(${ticket.id})">View Details</button>
      </div>
    `
      )
      .join("");

    app.innerHTML = `
      <div class="support-image" style="display: flex; justify-content: space-between; align-items: center;">
        <img src="https://cdn-icons-png.flaticon.com/512/2885/2885417.png" alt="Dashboard Icon">
        <div style="display: flex; gap: 10px;">
          <div style="display: flex; justify-content: flex-end; align-items: center; gap: 10px; margin-bottom:  0px;">
    <button id="logoutBtn" class="action-button">Logout</button>
  </div>
          <button class="action-button" id="createTicketBtn">
            <i class="fas fa-plus"></i> Create New Ticket
          </button>
        </div>
      </div>
      ${renderStatsPanel()}
      
      <h2 style="margin-top: 2rem;">Your Tickets</h2>
      <div style="margin-top: 1rem;">
        ${ticketsHTML}
      </div>
    `;

    document.getElementById("createTicketBtn").addEventListener("click", loadCreateTicketForm);
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      loadLoginForm();
    });
  }

  window.viewTicket = function (ticketId) {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    app.innerHTML = `
      <div class="support-image">
        <img src="https://cdn-icons-png.flaticon.com/512/3176/3176272.png" alt="Ticket Icon">
      </div>
      <div class="ticket-card detailed">
        <span class="status-badge status-${ticket.status.toLowerCase()}">${ticket.status}</span>
        <h2>${ticket.subject}</h2>
        <p><strong>Category:</strong> ${ticket.category}</p>
        <p><strong>Status:</strong> ${ticket.status}</p>
        <p><strong>Created:</strong> ${ticket.createdAt.toLocaleString()}</p>
        <h3>Description</h3>
        <p>${ticket.description}</p>
        <div class="ticket-actions">
          <button id="backToTicketsBtn">
            <i class="fas fa-arrow-left"></i> Back to Tickets
          </button>
          ${
            ticket.status === "Open"
              ? `<button onclick="closeTicket(${ticket.id})" class="danger">Close Ticket</button>`
              : ""
          }
        </div>
      </div>
    `;

    document.getElementById("backToTicketsBtn").addEventListener("click", loadDashboard);
  };

  window.closeTicket = function (ticketId) {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) {
      ticket.status = "Closed";
      viewTicket(ticketId);
    }
  };

  function loadCreateTicketForm() {
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
        <input type="file" /><br>
        <button type="submit">Submit Ticket</button>
      </form>
    `;

    document.getElementById("createTicketForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      tickets.unshift({
        id: tickets.length + 1,
        subject: form[0].value,
        description: form[1].value,
        category: form[2].value,
        status: "Open",
        createdAt: new Date(),
      });
      alert("Ticket created successfully!");
      loadDashboard();
    });
  }

  if (isUserLoggedIn()) {
    loadDashboard();
  } else {
    loadLoginForm();
  }
});



