# 🔐 Key System API & Web UI

A secure and simple license key system built for paid feature locking, user HWID binding, admin control, and reset cooldowns.  
Designed to run serverlessly on **Vercel**, with GitHub as the persistent backend.

---

## 📚 Table of Contents

- [🧩 Overview](#-overview)
- [⚙️ Environment Variables](#️-environment-variables)
- [📡 API Endpoints](#-api-endpoints)
- [🧪 API Usage Examples](#-api-usage-examples)
- [🌐 Web UI](#-web-ui)
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

---

### 🔍 `/verify`

Check if a key is valid and either:
- Binds it to the provided HWID (if new)
- Validates the HWID (if already bound)

**Params:** `key`, `hwid`  
**Responses:**
- ✅ `key verified`
- 🆕 `key bound to hwid`
- ❌ `hwid mismatch`
- 🚫 `key not found`

---

### 🔁 `/reset`

Unbinds HWID from a key (limit: once per 24h)

**Params:** `key`  
**Responses:**
- 🔄 `hwid reset`
- 🕒 `cooldown: try again in X hours`
- ❌ `key not found`

---

### 🛠️ `/make` *(Admin only)*

Creates a new random key.

**Params:** `admin`  
**Responses:**
- 🔑 Returns the new key
- ❌ 403 if password wrong

---

### 🔎 `/info` *(Admin only)*

Returns metadata of a specific key.

**Params:** `key`, `admin`  
**Returns:**
```json
{
  "hwid": "abcdef123456",
  "last_reset": 1724011223344
}
```

---

### 🗑️ `/delete` *(Admin only)*

Deletes a key.

**Params:** `key`, `admin`  
**Responses:**
- ✅ `Key deleted`
- ❌ `Key not found`

---

### ☠️ `/deleteAll` *(Admin only)*

Deletes **all keys** permanently.

**Params:** `admin`  
**Response:**  
- 🧨 `All keys deleted`

---

## 🧪 API Usage Examples

### 🐍 Python

```python
import requests

BASE = "https://your-vercel-app.vercel.app/api"
key = "1234-ABCD"
hwid = "abc-hardware-id"

print(requests.get(f"{BASE}/verify", params={"key": key, "hwid": hwid}).text)
print(requests.get(f"{BASE}/reset", params={"key": key}).text)
print(requests.get(f"{BASE}/make", params={"admin": "yourpass"}).text)
```

---

### 🌐 JavaScript (fetch)

```js
const BASE = "https://your-vercel-app.vercel.app/api";

fetch(`${BASE}/verify?key=1234-ABCD&hwid=abc123`)
  .then(res => res.text())
  .then(console.log);
```

---

### 📟 curl

```bash
curl "https://your-vercel-app.vercel.app/api/verify?key=1234-ABCD&hwid=abc123"
```

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
