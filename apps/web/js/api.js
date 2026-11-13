(function (global) {
  const AUTH_BASE = "/api/auth/v1";
  const TX_BASE = "/api/transactions/v1";
  const SESSION_KEY = "fg_session";
  const PAYMENT_DRAFT_KEY = "fg_payment_draft";

  function readSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  }

  function writeSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PAYMENT_DRAFT_KEY);
  }

  function requireSession() {
    const session = readSession();
    if (!session?.accessToken) {
      window.location.href = "login.html";
      return null;
    }
    if (session.expiresAt && Date.parse(session.expiresAt) < Date.now()) {
      clearSession();
      window.location.href = "login.html";
      return null;
    }
    return session;
  }

  async function request(base, path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    const session = readSession();
    if (session?.accessToken) {
      headers.Authorization = `Bearer ${session.accessToken}`;
    }

    const response = await fetch(`${base}${path}`, {
      ...options,
      headers,
    });

    let body = null;
    const text = await response.text();
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = { message: text };
      }
    }

    if (!response.ok) {
      const detail =
        Array.isArray(body?.details) && body.details.length
          ? body.details.map((item) => item.message || item.path).join("; ")
          : null;
      const error = new Error(
        detail || body?.message || body?.error || `HTTP ${response.status}`
      );
      error.status = response.status;
      error.body = body;
      throw error;
    }
    return body;
  }

  const api = {
    AUTH_BASE,
    TX_BASE,
    readSession,
    writeSession,
    clearSession,
    requireSession,

    formatMoney(amount, currency = "CZK") {
      const value = Number(amount || 0);
      return `${value.toLocaleString("cs-CZ")} ${currency}`;
    },

    formatNow() {
      const now = new Date();
      return {
        date: now.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" }),
        time: now.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" }),
      };
    },

    async login(username, password) {
      const data = await request(AUTH_BASE, "/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      writeSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        user: data.userResponse,
      });
      return data;
    },

    logout() {
      clearSession();
      window.location.href = "login.html";
    },

    async listAccounts(userId) {
      const id = userId || readSession()?.user?.userId;
      const query = id ? `?userId=${encodeURIComponent(id)}` : "";
      return request(TX_BASE, `/accounts/listAccounts${query}`);
    },

    async getAccount(accountId) {
      return request(
        TX_BASE,
        `/accounts/getAccountById?accountId=${encodeURIComponent(accountId)}`
      );
    },

    async getAccountHistory(accountId) {
      return request(
        TX_BASE,
        `/accounts/getHistory?accountId=${encodeURIComponent(accountId)}`
      );
    },

    async listSavings(userId) {
      const data = await request(TX_BASE, "/savingsAccounts/listAccounts");
      const id = userId || readSession()?.user?.userId;
      const items = Array.isArray(data) ? data : data?.items || [];
      return id ? items.filter((item) => item.userId === id) : items;
    },

    async createTransaction(payload) {
      return request(TX_BASE, "/transactions/createTransaction", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    async transferSavingsToCurrent(savingAccountId, currentAccountId, amount) {
      return request(TX_BASE, "/savingsAccounts/transferToCurrent", {
        method: "POST",
        body: JSON.stringify({
          savingAccountId,
          currentAccountId,
          amount: Number(amount),
        }),
      });
    },

    async transferCurrentToSavings(savingAccountId, currentAccountId, amount) {
      return request(TX_BASE, "/savingsAccounts/transferFromCurrent", {
        method: "POST",
        body: JSON.stringify({
          savingAccountId,
          currentAccountId,
          amount: Number(amount),
        }),
      });
    },

    async getQrCode(accountId, amount, message) {
      const params = new URLSearchParams({ accountId });
      if (amount) params.set("amount", amount);
      if (message) params.set("message", message);
      return request(TX_BASE, `/accounts/getQrCode?${params.toString()}`);
    },

    savePaymentDraft(draft) {
      sessionStorage.setItem(PAYMENT_DRAFT_KEY, JSON.stringify(draft));
    },

    readPaymentDraft() {
      try {
        return JSON.parse(sessionStorage.getItem(PAYMENT_DRAFT_KEY) || "null");
      } catch {
        return null;
      }
    },

    clearPaymentDraft() {
      sessionStorage.removeItem(PAYMENT_DRAFT_KEY);
    },

    bindLogoutButtons() {
      document.querySelectorAll("[data-logout], button").forEach((btn) => {
        if (btn.dataset.logout === "true" || /odhlásit/i.test(btn.textContent || "")) {
          btn.addEventListener("click", (event) => {
            event.preventDefault();
            api.logout();
          });
        }
      });
    },

    fillUserHeader(root = document) {
      const session = readSession();
      if (!session?.user) return;
      const name =
        session.user.displayName ||
        [session.user.firstName, session.user.lastName].filter(Boolean).join(" ") ||
        session.user.username;
      root.querySelectorAll("[data-user-name]").forEach((el) => {
        el.textContent = name;
      });
      const { date, time } = api.formatNow();
      root.querySelectorAll("[data-today-date]").forEach((el) => {
        el.textContent = date;
      });
      root.querySelectorAll("[data-today-time]").forEach((el) => {
        el.textContent = time;
      });
    },
  };

  global.FgApi = api;
})(window);
