# 🔐 EGate — HWID-Locked License Key System + Admin Dashboard

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Made by Eman](https://img.shields.io/badge/MADE%20BY-EMAN-ff69b4.svg)](https://github.com/eman225511)


[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import)


---

> **EGate** is a sleek and secure API-based license key system with HWID binding, admin key management, and optional Web UI.  
> Perfect for protecting premium features in CLI tools, desktop apps, bots, or scripts.

---

## 📦 Features

✨ **Fully Serverless** — Powered by [Vercel Functions](https://vercel.com/docs/functions)

🔒 **HWID Binding** — Lock license keys to one machine

🔁 **Reset Control** — One HWID reset per 24 hours [(can be changed)](https://github.com/eman225511/EGate?tab=readme-ov-file#reset)

📋 **Web UI** — Simple HTML frontend with full admin panel

🧠 **Admin Endpoints** — Create, delete, inspect, or purge keys with password protection

🗂️ **GitHub Storage** — Keys are saved in `keys.json` in your private GitHub repo

---

## ⚙️ Environment Variables

Set these in your **Vercel Project Settings > Environment Variables**

| Name             | Required | Example                 | Description                             |
|------------------|----------|-------------------------|-----------------------------------------|
| `ADMIN_PASSWORD` | ✅       | `supersecret123`        | Password to access admin routes         |
| `GITHUB_TOKEN`   | ✅       | `ghp_xxx`               | GitHub PAT with `repo` permission       |
| `GITHUB_OWNER`   | ✅       | `eman225511`            | Your GitHub username                    |
| `GITHUB_REPO`    | ✅       | `EGate-Keys`            | Repo where `keys.json` lives            |
| `GITHUB_BRANCH`  | ❌       | `main` (default)        | Branch containing `keys.json`           |

---

## 🚀 Installation

### 1. 🛠️ Requirements

- Vercel account
- GitHub account + repo with an empty `keys.json` file (`{}`)
- GitHub PAT (Personal Access Token) with `repo` access

---

### 2. ⚡ Deploy to Vercel

> Fastest method: click [Import Project](https://vercel.com/import)

1. Fork this repo  
2. Add your GitHub PAT & environment variables  
3. Deploy  
4. Visit your new license API at:

```
https://your-vercel-app.vercel.app/api/
```

---

## 🔌 API Endpoints

All requests are `GET` based with query parameters.

### `/verify`

✅ Verify a key + HWID or bind HWID if first use  
- `?key=XXXX-YYYY&hwid=device123`  
- 🔁 Repeated calls validate HWID

---

### `/reset`

🔄 Reset HWID (only allowed every 24 hours)  
- `?key=XXXX-YYYY`  
- Returns success or cooldown remaining
- to change it go to line **3** in api/reset.js
```js
const Reset_Delay_Hours = 24; // Change this for a dif delay
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

## 💻 API Usage Examples

### Python

```python
import requests

BASE = "https://your-vercel-app.vercel.app/api"

print(requests.get(f"{BASE}/verify", params={"key": "ABCD-1234", "hwid": "my-hwid"}).text)
print(requests.get(f"{BASE}/reset", params={"key": "ABCD-1234"}).text)
print(requests.get(f"{BASE}/make", params={"admin": "yourpassword"}).text)
```

### JavaScript

```js
const base = "https://your-vercel-app.vercel.app/api";
fetch(`${base}/verify?key=ABCD-1234&hwid=myhwid`)
  .then(r => r.text())
  .then(console.log);
```

### curl

```bash
curl "https://your-vercel-app.vercel.app/api/verify?key=ABCD-1234&hwid=myhwid"
```

---

## 🌐 Web UI (`index.html`)

- 🔐 Check Key
- 🔁 Reset HWID
- 🧑‍💼 Admin Panel (make, delete, inspect keys)

> 📌 Set your API URL in the HTML on **line 96**:
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
│   └── deleteAll.js
├── utils/github.js
├── index.html
└── README.md
```

---

## 🧪 Testing

- Use Postman, Insomnia, curl, or the provided frontend  
- Rate limits: no enforced limits, but HWID resets are locked to 24h

---

## 🤝 Contribute

Pull requests welcome! Suggestions? Open an issue.

---

## 📄 License

MIT License — Made with ❤️ by **Eman**
