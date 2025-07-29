# 🔐 EGate (Key System API & Web UI)

EGate is a secure and simple license key system built for paid feature locking, user HWID binding, admin control, and reset cooldowns.  
Designed to run serverlessly on **Vercel**, with GitHub as the persistent backend.

Feel free to not use `index.html` and make your own frontend — or even a Discord bot.  
Anything is possible if you can make web requests!

---

## 📚 Table of Contents

- [🧩 Overview](#-overview)
- [⚙️ Environment Variables](#️-environment-variables)
- [📡 API Endpoints](#-api-endpoints)
- [🧪 API Usage Examples](#-api-usage-examples)
- [🌐 Web UI](#-web-ui)
- [🛠️ Install Guide](#️-install-guide)
- [🗂️ File Structure](#️-file-structure)

---

## 🧩 Overview

The key system offers:

- ✅ License key generation
- 🔒 HWID locking (one device per key)
- 🔁 HWID reset (1x per 24h)
- 🧠 Admin-only key creation, deletion, and inspection
- 💾 Key data stored in `keys.json` in your GitHub repo
- 🌐 Web UI interface for users and admins

Each key in `keys.json` looks like:

```json
"ABCD-1234-XYZ": {
  "hwid": "device123abc",
  "last_reset": 1724012345678
}
```

---

## ⚙️ Environment Variables

| Variable         | Required | Description                                      |
|------------------|----------|--------------------------------------------------|
| `ADMIN_PASSWORD` | ✅       | Password required for admin API calls            |
| `GITHUB_TOKEN`   | ✅       | GitHub token (PAT) with repo access              |
| `GITHUB_OWNER`   | ✅       | GitHub username or org name                      |
| `GITHUB_REPO`    | ✅       | Name of the repo containing `keys.json`          |
| `GITHUB_BRANCH`  | ❌       | Defaults to `main` if not specified              |

Set these in your **Vercel project settings**.

---

## 📡 API Endpoints

All endpoints are hosted at:

```
https://your-vercel-app.vercel.app/api/...
```

See the full list in the original content...

---

## 🧪 API Usage Examples

[Python, JavaScript, curl examples — same as above]

---

## 🌐 Web UI

`index.html` is a user-friendly frontend for:

- 🔐 Verifying keys (with HWID input)
- 🔁 Resetting HWIDs (1/day)
- 🧑‍💼 Admin Panel:
  - Create new keys
  - View key metadata
  - Delete individual keys
  - Wipe all keys

To use the admin panel:
1. Click **Admin**
2. Enter the `ADMIN_PASSWORD`
3. Access all management tools

🔧 You need to set the API endpoint at line **96**:
```js
const API = "https://your-vercel-app.vercel.app/api"; // Your API base URL
```

---

## 🛠️ Install Guide

### 1. 🧾 Prerequisites
- GitHub repository with `keys.json` (just `{}` to start)
- GitHub personal access token (classic PAT with `repo` scope)
- Vercel account

---

### 2. 🛰️ Deploy to Vercel

1. Fork this repository  
2. Link the repo to [Vercel](https://vercel.com/import)  
3. In Vercel’s project settings, add the environment variables:

```
ADMIN_PASSWORD = your_admin_password
GITHUB_TOKEN   = your_github_pat
GITHUB_OWNER   = your_username
GITHUB_REPO    = your_repo_name
GITHUB_BRANCH  = main
```

---

### 3. 🚀 Launch

- Once deployed, go to your Vercel URL:  
  `https://your-vercel-app.vercel.app/`
- Test endpoints using Postman, curl, or your own client app

---

## 🗂️ File Structure

```
Key-System/
├── api/
│   ├── make.js
│   ├── verify.js
│   ├── reset.js
│   ├── info.js
│   ├── delete.js
│   └── deleteAll.js
├── utils/
│   └── github.js
├── index.html
└── README.md
```

---

## 💬 Support

For help or ideas, feel free to reach out or open an issue on the GitHub repo.

Licensed MIT © 2025  
Made with ❤️ for developers like you.
