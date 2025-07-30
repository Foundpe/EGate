
<div align="center">
  <h1>🔐 EGate — HWID-Locked License Key System + Admin Dashboard</h1>
</div>

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Made by Eman](https://img.shields.io/badge/MADE%20BY-EMAN-ff69b4.svg)](https://github.com/eman225511)


[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import)


---

> **EGate** is a sleek and secure API-based license key system with HWID binding, admin key management, and optional Web UI.  
> Perfect for protecting premium features in CLI tools, desktop apps, bots, or scripts.

---

## 📦 Features


✨ <b>Fully Serverless</b> — Powered by <a href="https://vercel.com/docs/functions">Vercel Functions</a><br>
🔒 <b>HWID Binding</b> — Lock license keys to one machine<br>
🔁 <b>Reset Control</b> — One HWID reset per 24 hours <a href="#reset">(can be changed)</a><br>
📋 <b>Web UI</b> — Simple HTML frontend with full admin panel<br>
🧠 <b>Admin Endpoints</b> — Create, delete, inspect, or purge keys with password protection<br>
🗂️ <b>GitHub Storage</b> — Keys are saved in <code>keys.json</code> in your private GitHub repo

---

## ⚙️ Environment Variables


<details>
<summary><b>How to set these in Vercel</b></summary>

> Go to <a href="https://vercel.com/dashboard">Vercel Dashboard</a> → Project → Settings → Environment Variables

</details>

Set these in your <b>Vercel Project Settings &gt; Environment Variables</b>

| Name             | Required | Example                 | Description                             |
|------------------|----------|-------------------------|-----------------------------------------|
| `ADMIN_PASSWORD` | ✅       | `supersecret123`        | Password to access admin routes         |
| `GITHUB_TOKEN`   | ✅       | `ghp_xxx`               | GitHub PAT with `repo` permission       |
| `GITHUB_OWNER`   | ✅       | `eman225511`            | Your GitHub username                    |
| `GITHUB_REPO`    | ✅       | `EGate-Keys`            | Repo where `keys.json` lives            |
| `GITHUB_BRANCH`  | ❌       | `main` (default)        | Branch containing `keys.json`           |

---

## 🚀 Installation & Setup


### 1. 🛠️ Requirements

- **Vercel account** (for serverless API and frontend hosting)
- **GitHub account** with a **private repo** (this repo) containing an empty `keys.json` file (`{}`)
- **GitHub Personal Access Token (PAT)** with `repo` access (for reading/writing keys)

---

### 2. ⚡ Setup & Deploy

> **All-in-one:** This repo contains both the API (serverless functions) and the optional web frontend. Vercel will serve both from the same project.

1. **Fork or clone** this repo to your private GitHub account.
2. In your repo, ensure there is a `keys.json` file at the root (just `{}` for empty).
3. Go to [Vercel](https://vercel.com/import) and import your private repo.
4. In Vercel, set the required environment variables (see table above):
   - `ADMIN_PASSWORD`, `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, and optionally `GITHUB_BRANCH`.
5. Deploy the project.
6. Visit your deployed API and frontend at:

```
https://your-vercel-app.vercel.app/
```

---


## 🔌 API Endpoints

All requests are `GET` based with query parameters. All endpoints are served from your Vercel deployment, e.g. `https://your-vercel-app.vercel.app/api/ENDPOINT`.

### `/verify`

✅ Verify a key + HWID or bind HWID if first use  
- `?key=XXXX-YYYY&hwid=device123`  
- 🔁 Repeated calls validate HWID

---

### `/reset`

🔄 Reset HWID (only allowed every 24 hours)  
- `?key=XXXX-YYYY`  
- Returns success or cooldown remaining
- To change the cooldown, edit line **3** in `api/reset.js`:
```js
const Reset_Delay_Hours = 24; // Change this for a different delay
```

---

### `/make` *(Admin)*

🔑 Generate a new random key  
- `?admin=yourpassword`  
- Returns: `"New key: XXXX-YYYY-ZZZZ"`

---

### `/info` *(Admin)*

📋 View key info  
- `?key=XXXX-YYYY&admin=yourpassword`  
- Returns key metadata

---

### `/delete` *(Admin)*

🗑️ Delete a key  
- `?key=XXXX-YYYY&admin=yourpassword`

---

### `/deleteAll` *(Admin)*

☠️ Wipe **all** keys  
- `?admin=yourpassword`

---

### `/adminReset` *(Admin)*

🛠️ **Force reset HWID for a key (no cooldown, admin only)**
- `?key=XXXX-YYYY&admin=yourpassword`
- Instantly resets the HWID binding for the given key, regardless of cooldown.
- Returns: `admin hwid reset successful` on success, or error message if not found/forbidden.

---


## 💻 API Usage Examples


### Python

```python
import requests

BASE = "https://your-vercel-app.vercel.app/api"

# Verify key
print(requests.get(f"{BASE}/verify", params={"key": "ABCD-1234", "hwid": "my-hwid"}).text)
# Reset HWID
print(requests.get(f"{BASE}/reset", params={"key": "ABCD-1234"}).text)
# Admin: Make new key
print(requests.get(f"{BASE}/make", params={"admin": "yourpassword"}).text)
# Admin: Force HWID reset
print(requests.get(f"{BASE}/adminReset", params={"key": "ABCD-1234", "admin": "yourpassword"}).text)
```

### JavaScript

```js
const base = "https://your-vercel-app.vercel.app/api";
// Verify key
fetch(`${base}/verify?key=ABCD-1234&hwid=myhwid`).then(r => r.text()).then(console.log);
// Admin: Force HWID reset
fetch(`${base}/adminReset?key=ABCD-1234&admin=yourpassword`).then(r => r.text()).then(console.log);
```

### curl

```bash
# Verify key
curl "https://your-vercel-app.vercel.app/api/verify?key=ABCD-1234&hwid=myhwid"
# Admin: Force HWID reset
curl "https://your-vercel-app.vercel.app/api/adminReset?key=ABCD-1234&admin=yourpassword"
```

---


## 🌐 Web UI (`index.html`)

- 🔐 Check Key
- 🔁 Reset HWID
- 🧑‍💼 Admin Panel (make, delete, inspect, force reset keys)

> 📌 **Configure your API URL:**
> In `index.html`, set your deployed API base URL on **line 96**:
```js
const API = "https://your-vercel-app.vercel.app/api";
```

---


## 🗂️ Project Structure

```
EGate/
├── api/
│   ├── make.js
│   ├── verify.js
│   ├── reset.js
│   ├── info.js
│   ├── delete.js
│   ├── deleteAll.js
│   └── adminReset.js   # <--- New: force HWID reset endpoint
├── utils/github.js
├── keys.json           # <--- License keys storage (private)
├── index.html          # <--- Web UI
└── README.md
```

---


## 🧪 Testing & Tips

- Use Postman, Insomnia, curl, or the provided frontend to test endpoints
- All API endpoints are GET-based and require the correct query parameters
- HWID resets are locked to 24h (unless using `/adminReset` as admin)
- All data is stored in your private GitHub repo's `keys.json` file
- Vercel serves both the API and the web UI from the same deployment

---



## 🤝 Contribute & Get Help

- 💬 <b>Questions? Ideas?</b> <a href="https://github.com/eman225511/EGate/discussions">Start a Discussion</a>
- 🐞 <b>Found a bug?</b> <a href="https://github.com/eman225511/EGate/issues">Open an Issue</a>
- ✨ <b>Want to help?</b> <a href="https://github.com/eman225511/EGate/pulls">Send a Pull Request</a>
- 📧 <b>Contact the author:</b> <a href="https://discord.gg/W5DgDZ4Hu6">Join The Discord</a>

<div align="center">
  <a href="https://github.com/eman225511/EGate"><img src="https://img.shields.io/github/stars/eman225511/EGate?style=social" alt="GitHub stars"></a>
  <a href="https://github.com/eman225511/EGate/fork"><img src="https://img.shields.io/github/forks/eman225511/EGate?style=social" alt="GitHub forks"></a>
</div>

---

## 📄 License

MIT License — Made with ❤️ by **Eman**
