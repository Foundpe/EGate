

<div align="center">
  <h1>🔐 EGate</h1>
  <b>HWID-Locked License Key System & Admin Dashboard</b><br>
  <sub>Modern, serverless, and secure. Protect your premium apps, bots, or scripts.</sub>
  <br><br>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://github.com/eman225511"><img src="https://img.shields.io/badge/MADE%20BY-EMAN-ff69b4.svg" alt="Made by Eman"></a>
  <br><br>
  <a href="https://vercel.com/import"><img src="https://vercel.com/button" alt="Deploy to Vercel"></a>
</div>

---

<p align="center">
  <b>EGate</b> is a modern, serverless license key system with HWID binding, admin key management, and a simple web UI.<br>
  <i>Protect your premium CLI tools, desktop apps, bots, or scripts with ease.</i>
</p>

---

## 📦 Features

<ul>
  <li>⚡ <b>Serverless</b> — Powered by <a href="https://vercel.com/docs/functions">Vercel Functions</a></li>
  <li>🔒 <b>HWID Binding</b> — Lock license keys to a single device</li>
  <li>🔁 <b>User HWID Reset</b> — One reset per 24 hours (configurable)</li>
  <li>🛠️ <b>Admin Panel</b> — Create, delete, inspect, or purge keys (password protected)</li>
  <li>🐙 <b>GitHub Storage</b> — All keys are stored in your private repo's <code>keys.json</code></li>
  <li>🌐 <b>Simple Web UI</b> — HTML frontend for users and admins</li>
</ul>

---

## ⚙️ Environment Variables


<details>
<summary><b>How to set these in Vercel</b></summary>

> Go to <a href="https://vercel.com/dashboard">Vercel Dashboard</a> → Project → Settings → Environment Variables

</details>

Set these in your <b>Vercel Project Settings &gt; Environment Variables</b>

| Name             | Required | Example           | Description                       |
|------------------|----------|-------------------|-----------------------------------|
| `ADMIN_PASSWORD` | ✅       | `supersecret123`  | Password for admin endpoints      |
| `GITHUB_TOKEN`   | ✅       | `ghp_xxx`         | GitHub PAT with `repo` access     |
| `GITHUB_OWNER`   | ✅       | `eman225511`      | Your GitHub username              |
| `GITHUB_REPO`    | ✅       | `EGate-Keys`      | Repo where `keys.json` lives      |
| `GITHUB_BRANCH`  | ❌       | `main` (default)  | Branch for `keys.json`            |

---

## 🚀 Quickstart

1. **Fork or clone** this repo to your private GitHub account.
2. Ensure a `keys.json` file exists at the root (just `{}` for empty).
3. [Import to Vercel](https://vercel.com/import) and set the required environment variables above.
4. Deploy and visit your API/UI at:

   ```
   https://your-vercel-app.vercel.app/
   ```

---

## 🛠️ Requirements

- Vercel account (for serverless API & frontend)
- GitHub account with a private repo containing `keys.json` (`{}`)
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


<details>
<summary><h2>🔌 API Endpoints</h2></summary>

All requests are `GET` with query parameters. All endpoints are served from your Vercel deployment, e.g. `https://your-vercel-app.vercel.app/api/ENDPOINT`.

### `/verify` — Key Verification & HWID Binding

**Purpose:** Verify a license key and bind it to a hardware ID (HWID) on first use, or validate existing HWID binding.

**Parameters:**
- `key` *(required)* — The license key to verify (e.g., `ABCD-1234-EFGH`)
- `hwid` *(required)* — Hardware ID to bind/verify (e.g., device MAC address, CPU ID, etc.)

**Behavior:**
- First call: Binds the key to the provided HWID and returns `key bound to hwid`
- Subsequent calls: If HWID matches, returns `key verified`
- If HWID does not match, returns `hwid mismatch` (403)
- If key not found, returns `key not found` (404)

**Example Request:**
```
GET /api/verify?key=ABCD-1234-EFGH&hwid=MAC-00-11-22-33-44-55
```

**Response Examples:**
```
"key bound to hwid"
"key verified"
"hwid mismatch"
"key not found"
```

---

### `/reset` — HWID Reset (User)

**Purpose:** Reset the HWID binding for a key, allowing it to be bound to a new device. Limited to once every 24 hours per key.

**Parameters:**
- `key` *(required)* — The license key to reset

**Cooldown:** 24 hours (configurable in `api/reset.js`)

**Example Request:**
```
GET /api/reset?key=ABCD-1234-EFGH
```

**Response Examples:**
```
"hwid reset"
"cooldown: try again in X hours"
"key not found"
```

**Customization:**
To change the cooldown period, edit line **3** in `api/reset.js`:
```js
const Reset_Delay_Hours = 24; // Change this for a different delay
```

---

### `/make` *(Admin Only)*

**Purpose:** Generate a new random license key.

**Parameters:**
- `admin` *(required)* — Admin password (set via `ADMIN_PASSWORD` environment variable)

**Example Request:**
```
GET /api/make?admin=supersecret123
```

**Response Examples:**
```
<new-key-string>
"invalid admin password"
```

---

### `/info` *(Admin Only)*

**Purpose:** View information about a specific license key.

**Parameters:**
- `key` *(required)* — The license key to inspect
- `admin` *(required)* — Admin password

**Example Request:**
```
GET /api/info?key=ABCD-1234-EFGH&admin=supersecret123
```

**Response Examples:**
```json
{
  "hwid": "MAC-00-11-22-33-44-55",
  "last_reset": "2025-01-20T15:45:00.000Z"
}
"Key not found"
"Forbidden"
```

---

### `/delete` *(Admin Only)*

**Purpose:** Permanently delete a specific license key.

**Parameters:**
- `key` *(required)* — The license key to delete
- `admin` *(required)* — Admin password

**Example Request:**
```
GET /api/delete?key=ABCD-1234-EFGH&admin=supersecret123
```

**Response Examples:**
```
"Key deleted"
"Key not found"
"Forbidden"
```

---

### `/deleteAll` *(Admin Only)*

**Purpose:** **DANGER ZONE** — Permanently delete ALL license keys. Use with extreme caution!

**Parameters:**
- `admin` *(required)* — Admin password

**Example Request:**
```
GET /api/deleteAll?admin=supersecret123
```

**Response Examples:**
```
"All keys deleted"
"Forbidden"
```

---

### `/adminReset` *(Admin Only)*

**Purpose:** Instantly reset the HWID for any key (no cooldown, admin only).

**Parameters:**
- `key` *(required)* — The license key to reset
- `admin` *(required)* — Admin password

**Example Request:**
```
GET /api/adminReset?key=ABCD-1234-EFGH&admin=supersecret123
```

**Response Examples:**
```
"admin hwid reset successful"
"key not found"
"Forbidden"
```

### `/dump` (Admin Only)

**Purpose:** Fetch and return the full keys.json contents as JSON. Useful for backup, inspection, or exporting all license keys at once.

**Parameters:**
- `key` *(required)* — Admin password (same as ADMIN_PASSWORD env var)

**Example Request:**
`GET /api/dump?admin=YOUR_PASSWORD`

Returns the current `keys.json` from the GitHub repo. Requires admin password via query string.

**Query Parameters:**
- `admin` – Required. Admin password (set in `ADMIN_PASSWORD` environment variable).

**Response:**
```json
{
  "keys": {
    "exampleKey": {
      "hwid": "1234567890",
      "created": "2025-07-31T00:00:00Z",
    }
  }
}
Errors:
	403 Forbidden – if password is invalid
	500 Internal Server Error – if GitHub fetch fails
```


</details>

---

<details>
<summary><h2>💻 API Usage Examples</h2></summary>


### Python

```python
import requests

BASE = "https://your-vercel-app.vercel.app/api"
ADMIN_PASSWORD = "supersecret123"

# Helper: Print status and body
def print_response(resp):
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text}")

# Example 1: Verify a key and bind HWID (first time)
def verify_key(key, hwid):
    resp = requests.get(f"{BASE}/verify", params={"key": key, "hwid": hwid})
    print_response(resp)
    return resp.text

# Example 2: Reset HWID (user)
def reset_hwid(key):
    resp = requests.get(f"{BASE}/reset", params={"key": key})
    print_response(resp)
    return resp.text

# Example 3: Generate new key (admin)
def create_new_key():
    resp = requests.get(f"{BASE}/make", params={"admin": ADMIN_PASSWORD})
    print_response(resp)
    return resp.text

# Example 4: Get key information (admin)
def get_key_info(key):
    resp = requests.get(f"{BASE}/info", params={"key": key, "admin": ADMIN_PASSWORD})
    print_response(resp)
    try:
        return resp.json()
    except Exception:
        return resp.text

# Example 5: Force reset HWID (admin)
def admin_reset_hwid(key):
    resp = requests.get(f"{BASE}/adminReset", params={"key": key, "admin": ADMIN_PASSWORD})
    print_response(resp)
    return resp.text

def delete_key(key):
    resp = requests.get(f"{BASE}/delete", params={"key": key, "admin": ADMIN_PASSWORD})
    print_response(resp)
    return resp.text

# Usage example:
if __name__ == "__main__":
    # Create a new key
    new_key = create_new_key().strip()
    # Verify and bind the key
    verify_key(new_key, "MAC-00-11-22-33-44-55")
    # Get key info
    get_key_info(new_key)
    # Admin HWID reset
    admin_reset_hwid(new_key)

# Example 6: Delete a specific key (admin)
def delete_key(key):
    resp = requests.get(f"{BASE}/delete", params={"key": key, "admin": ADMIN_PASSWORD})
    print_response(resp)
    return resp.text

# Usage example:
if __name__ == "__main__":
    # Generate a new key
    new_key_response = create_new_key()
    # Extract key from response (assumes format "New key: XXXX-YYYY-ZZZZ")
    if "New key:" in new_key_response:
        key = new_key_response.split("New key: ")[1].strip()
        # Verify and bind the key
        verify_key(key, "MAC-00-11-22-33-44-55")
        # Get key information
        info = get_key_info(key)
        # Reset HWID (admin)
        admin_reset_hwid(key)
```


### JavaScript (Node.js)

```js
const BASE = "https://your-vercel-app.vercel.app/api";
const ADMIN_PASSWORD = "supersecret123";

// Helper: Print status and body
async function printResponse(response) {
    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Body:', text);
    return text;
}

// Example 1: Verify key with async/await and status check
async function verifyKey(key, hwid) {
    try {
        const response = await fetch(`${BASE}/verify?key=${key}&hwid=${hwid}`);
        await printResponse(response);
        if (response.status === 200) {
            // Success
        } else {
            // Handle error
        }
    } catch (error) {
        console.error('Error verifying key:', error);
    }
}

// Example 2: Create new key (admin)
async function createNewKey() {
    try {
        const response = await fetch(`${BASE}/make?admin=${ADMIN_PASSWORD}`);
        await printResponse(response);
    } catch (error) {
        console.error('Error creating key:', error);
    }
}

// Example 3: Get key info with error handling
async function getKeyInfo(key) {
    try {
        const response = await fetch(`${BASE}/info?key=${key}&admin=${ADMIN_PASSWORD}`);
        const text = await printResponse(response);
        try {
            const jsonResult = JSON.parse(text);
            console.log('Key Info (JSON):', jsonResult);
            return jsonResult;
        } catch {
            return text;
        }
    } catch (error) {
        console.error('Error getting key info:', error);
    }
}

// Example 4: Complete workflow
async function exampleWorkflow() {
    // Create a new key
    const response = await fetch(`${BASE}/make?admin=${ADMIN_PASSWORD}`);
    const newKeyResponse = await printResponse(response);
    if (newKeyResponse && newKeyResponse.includes('New key:')) {
        const key = newKeyResponse.split('New key: ')[1].trim();
        // Verify the key with different HWIDs
        await verifyKey(key, 'device-001');
        await verifyKey(key, 'device-002'); // This should fail
        // Get key information
        await getKeyInfo(key);
        // Reset HWID as admin
        const resetResponse = await fetch(`${BASE}/adminReset?key=${key}&admin=${ADMIN_PASSWORD}`);
        await printResponse(resetResponse);
    }
}

// Run the workflow
exampleWorkflow();
```

### JavaScript (Browser/Frontend)

```js
const API_BASE = "https://your-vercel-app.vercel.app/api";

// Example license verification form handler
document.getElementById('verifyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const key = document.getElementById('keyInput').value;
    const hwid = document.getElementById('hwidInput').value;
    
    try {
        const response = await fetch(`${API_BASE}/verify?key=${key}&hwid=${hwid}`);
        const result = await response.text();
        
        document.getElementById('result').textContent = result;
        
        if (result.includes('verified')) {
            document.getElementById('result').className = 'success';
        } else {
            document.getElementById('result').className = 'error';
        }
    } catch (error) {
        document.getElementById('result').textContent = 'Network error: ' + error.message;
        document.getElementById('result').className = 'error';
    }
});

// Example admin panel functions
class EGateAdmin {
    constructor(apiBase, adminPassword) {
        this.api = apiBase;
        this.password = adminPassword;
    }
    
    async createKey() {
        const response = await fetch(`${this.api}/make?admin=${this.password}`);
        return await response.text();
    }
    
    async deleteKey(key) {
        const response = await fetch(`${this.api}/delete?key=${key}&admin=${this.password}`);
        return await response.text();
    }
    
    async getKeyInfo(key) {
        const response = await fetch(`${this.api}/info?key=${key}&admin=${this.password}`);
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }
}

// Usage
const admin = new EGateAdmin(API_BASE, 'yourpassword');
```


### curl (Command Line)

```bash
# Set your API base URL
API_BASE="https://your-vercel-app.vercel.app/api"
ADMIN_PASSWORD="supersecret123"

# Example 1: Verify a key and bind HWID (shows status)
curl -i -G "$API_BASE/verify" \
  --data-urlencode "key=ABCD-1234-EFGH" \
  --data-urlencode "hwid=MAC-00-11-22-33-44-55"

# Example 2: Reset HWID (user)
curl -i -G "$API_BASE/reset" \
  --data-urlencode "key=ABCD-1234-EFGH"

# Example 3: Create new key (admin)
curl -i -G "$API_BASE/make" \
  --data-urlencode "admin=${ADMIN_PASSWORD}"

# Example 4: Get key information (admin) - formatted JSON output
curl -i -G "$API_BASE/info" \
  --data-urlencode "key=ABCD-1234-EFGH" \
  --data-urlencode "admin=${ADMIN_PASSWORD}" | jq '.'

# Example 5: Force reset HWID (admin)
curl -i -G "$API_BASE/adminReset" \
  --data-urlencode "key=ABCD-1234-EFGH" \
  --data-urlencode "admin=${ADMIN_PASSWORD}"

# Example 6: Delete a key (admin)
curl -i -G "$API_BASE/delete" \
  --data-urlencode "key=ABCD-1234-EFGH" \
  --data-urlencode "admin=${ADMIN_PASSWORD}"

# Example 7: Batch operations script (shows status)
#!/bin/bash
API_BASE="https://your-vercel-app.vercel.app/api"
ADMIN_PASSWORD="supersecret123"

echo "Creating 5 new keys..."
for i in {1..5}; do
    echo "Key $i:"
    curl -i -s -G "$API_BASE/make" --data-urlencode "admin=${ADMIN_PASSWORD}"
    echo
done

echo -e "\nDone creating keys!"
```


### PowerShell (Windows)

```powershell
# PowerShell examples for Windows users
$API_BASE = "https://your-vercel-app.vercel.app/api"
$ADMIN_PASSWORD = "supersecret123"

# Helper: Print status and body
function Print-ApiResponse {
    param($Response)
    Write-Host "Status: $($Response.StatusCode)" -ForegroundColor Yellow
    Write-Host "Body: $($Response.Content.ReadAsStringAsync().Result)" -ForegroundColor Cyan
}

# Function to verify a key
function Verify-EGateKey {
    param(
        [string]$Key,
        [string]$HWID
    )
    $uri = "$API_BASE/verify?key=$Key&hwid=$HWID"
    try {
        $response = Invoke-WebRequest -Uri $uri -Method Get
        Print-ApiResponse $response
        return $response.Content
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Function to create a new key
function New-EGateKey {
    $uri = "$API_BASE/make?admin=$ADMIN_PASSWORD"
    try {
        $response = Invoke-WebRequest -Uri $uri -Method Get
        Print-ApiResponse $response
        return $response.Content
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Function to get key information
function Get-EGateKeyInfo {
    param([string]$Key)
    $uri = "$API_BASE/info?key=$Key&admin=$ADMIN_PASSWORD"
    try {
        $response = Invoke-WebRequest -Uri $uri -Method Get
        Print-ApiResponse $response
        return $response.Content
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Example usage
$newKey = New-EGateKey
if ($newKey -match "New key: (.+)") {
    $keyValue = $matches[1].Trim()
    Write-Host "Extracted key: $keyValue"
    # Verify the key
    Verify-EGateKey -Key $keyValue -HWID "WIN-PC-12345"
    # Get key info
    Get-EGateKeyInfo -Key $keyValue
}
```

---

**Tip:** Always check both the HTTP status code and the response body for errors or success. The API uses standard status codes for error handling, so robust clients should not assume 200 for all responses.

</details>

---

<details>
<summary><h2>📊 Response Codes & Error Handling</h2></summary>


### HTTP Status Codes

API endpoints return standard HTTP status codes. The most common are:

| Status Code | Meaning                                 |
|-------------|-----------------------------------------|
| 200         | Success                                 |
| 400         | Bad Request (missing/invalid parameters)|
| 403         | Forbidden (wrong admin password, HWID mismatch) |
| 404         | Not Found (key not found)               |
| 405         | Method Not Allowed                      |
| 429         | Too Many Requests (cooldown active)     |
| 500         | Internal Server Error                   |

Check both the status code and response body for the result.

### Common Response Messages

| Response                        | When/Why                                      |
|----------------------------------|-----------------------------------------------|
| `"key bound to hwid"`            | First-time verification, HWID is now bound    |
| `"key verified"`                 | HWID matches, key is valid                   |
| `"hwid mismatch"`                | HWID does not match bound HWID (403)         |
| `"key not found"`                | Key does not exist (404)                     |
| `"hwid reset"`                   | HWID reset successful                        |
| `"cooldown: try again in X hours"` | HWID reset attempted too soon (429)        |
| `"invalid admin password"`       | Wrong admin password (403, /make)            |
| `"Forbidden"`                    | Wrong admin password (403, admin endpoints)  |
| `"Key deleted"`                  | Key deleted (admin)                          |
| `"All keys deleted"`             | All keys deleted (admin)                     |
| `"admin hwid reset successful"`  | Admin forced HWID reset                      |

### Error Handling Best Practices

#### Python Example with Comprehensive Error Handling

```python
import requests
import time
from typing import Dict, Union

class EGateClient:
    def __init__(self, api_base: str, admin_password: str = None):
        self.api_base = api_base
        self.admin_password = admin_password
    
    def verify_key(self, key: str, hwid: str) -> Dict[str, Union[str, bool]]:
        """Verify a key with comprehensive error handling"""
        try:
            response = requests.get(
                f"{self.api_base}/verify",
                params={"key": key, "hwid": hwid},
                timeout=10
            )
            
            result = response.text.strip()
            
            if "key verified and hwid bound" in result:
                return {"success": True, "message": result, "bound": True}
            elif "key and hwid verified" in result:
                return {"success": True, "message": result, "bound": False}
            elif "invalid key" in result:
                return {"success": False, "error": "INVALID_KEY", "message": result}
            elif "hwid mismatch" in result:
                return {"success": False, "error": "HWID_MISMATCH", "message": result}
            else:
                return {"success": False, "error": "UNKNOWN", "message": result}
                
        except requests.exceptions.Timeout:
            return {"success": False, "error": "TIMEOUT", "message": "Request timed out"}
        except requests.exceptions.RequestException as e:
            return {"success": False, "error": "NETWORK", "message": str(e)}
    
    def reset_hwid_with_retry(self, key: str, max_retries: int = 3) -> Dict[str, Union[str, bool]]:
        """Reset HWID with automatic retry on cooldown"""
        for attempt in range(max_retries):
            try:
                response = requests.get(f"{self.api_base}/reset", params={"key": key})
                result = response.text.strip()
                
                if "hwid reset successful" in result:
                    return {"success": True, "message": result}
                elif "reset cooldown active" in result:
                    # Extract hours from message if possible
                    import re
                    hours_match = re.search(r'(\d+(?:\.\d+)?)\s*hours?', result)
                    if hours_match and attempt < max_retries - 1:
                        hours = float(hours_match.group(1))
                        if hours <= 1:  # Only wait if it's reasonable
                            print(f"Cooldown active, waiting {hours * 3600:.0f} seconds...")
                            time.sleep(hours * 3600)
                            continue
                    return {"success": False, "error": "COOLDOWN", "message": result}
                else:
                    return {"success": False, "error": "OTHER", "message": result}
                    
            except Exception as e:
                if attempt == max_retries - 1:
                    return {"success": False, "error": "NETWORK", "message": str(e)}
                time.sleep(2 ** attempt)  # Exponential backoff
        
        return {"success": False, "error": "MAX_RETRIES", "message": "Max retries exceeded"}

# Usage example
client = EGateClient("https://your-app.vercel.app/api", "admin123")

# Verify with error handling
result = client.verify_key("ABCD-1234", "device-001")
if result["success"]:
    print(f"✅ Verification successful: {result['message']}")
else:
    print(f"❌ Verification failed: {result['error']} - {result['message']}")
```

#### JavaScript Example with Promise-based Error Handling

```javascript
class EGateAPI {
    constructor(baseUrl, adminPassword = null) {
        this.baseUrl = baseUrl;
        this.adminPassword = adminPassword;
    }
    
    async makeRequest(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}/${endpoint}`);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });
        
        try {
            const response = await fetch(url, { method: 'GET' });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const text = await response.text();
            return { success: true, data: text };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    async verifyKey(key, hwid) {
        const result = await this.makeRequest('verify', { key, hwid });
        
        if (!result.success) {
            return { success: false, error: 'NETWORK_ERROR', message: result.error };
        }
        
        const message = result.data.trim();
        
        if (message.includes('key verified and hwid bound')) {
            return { success: true, status: 'BOUND', message };
        } else if (message.includes('key and hwid verified')) {
            return { success: true, status: 'VERIFIED', message };
        } else if (message.includes('invalid key')) {
            return { success: false, error: 'INVALID_KEY', message };
        } else if (message.includes('hwid mismatch')) {
            return { success: false, error: 'HWID_MISMATCH', message };
        } else {
            return { success: false, error: 'UNKNOWN', message };
        }
    }
    
    async createKeyWithValidation() {
        if (!this.adminPassword) {
            return { success: false, error: 'NO_ADMIN_PASSWORD', message: 'Admin password required' };
        }
        
        const result = await this.makeRequest('make', { admin: this.adminPassword });
        
        if (!result.success) {
            return { success: false, error: 'NETWORK_ERROR', message: result.error };
        }
        
        const message = result.data.trim();
        
        if (message.includes('New key:')) {
            const key = message.replace('New key:', '').trim();
            return { success: true, key, message };
        } else if (message.includes('forbidden')) {
            return { success: false, error: 'UNAUTHORIZED', message };
        } else {
            return { success: false, error: 'UNKNOWN', message };
        }
    }
}

// Usage with proper error handling
async function handleLicenseVerification(api, licenseKey, deviceId) {
    try {
        const result = await api.verifyKey(licenseKey, deviceId);
        
        if (result.success) {
            switch (result.status) {
                case 'BOUND':
                    console.log('🔗 License bound to this device');
                    return true;
                case 'VERIFIED':
                    console.log('✅ License verified successfully');
                    return true;
            }
        } else {
            switch (result.error) {
                case 'INVALID_KEY':
                    console.log('❌ Invalid license key');
                    break;
                case 'HWID_MISMATCH':
                    console.log('⚠️ License is bound to a different device');
                    // Offer HWID reset option
                    break;
                case 'NETWORK_ERROR':
                    console.log('🌐 Network error:', result.message);
                    // Implement retry logic
                    break;
                default:
                    console.log('❓ Unknown error:', result.message);
            }
            return false;
        }
    } catch (error) {
        console.error('💥 Unexpected error:', error);
        return false;
    }
}
```

</details>

---

<details>
<summary><h2>🌐 Web UI (`index.html`, `reset.html`)</h2></summary>

- 🔐 Check Key
- 🔁 Reset HWID
- 🧑‍💼 Admin Panel (make, delete, inspect, force reset keys)

> 📌 **Configure your API URL:**
> In `index.html`, set your deployed API base URL on **line 96**:
```js
const API = "https://your-vercel-app.vercel.app/api";
```

## 🌐 User Reset Page

A standalone page for users to easily reset their HWID binding without needing the full admin panel.

### 🔗 `reset.html`

- **Purpose:** Allows end-users to reset their license key's HWID using just the key (no admin login required).
- **Endpoint Called:** `GET /api/reset?key=YOUR_LICENSE_KEY`
- **Validates:** Cooldown and key existence.
- **Displays:** Clear feedback messages (e.g. "hwid reset", "cooldown", "key not found").

### 🧪 Usage

1. Upload `reset.html` to the root of your Vercel deployment (same folder as `index.html`).
2. Users visit:
   `https://your-vercel-app.vercel.app/reset.html`
3. Enter license key and hit **Reset HWID**.

### 📦 Developer Notes

- Works with your existing `/api/reset` endpoint (GET-based).
- Handles all common status codes:
- `200` → success: `✅ hwid reset`
- `429` → cooldown active: `❌ cooldown: try again in X hours`
- `404` → invalid key: `❌ key not found`
- `500` → server error


</details>

---

<details>
<summary><h2>🗂️ Project Structure</h2></summary>

```
EGate/
├── api/                        # 🔌 Serverless API endpoints (Vercel Functions)
│   ├── make.js                 # 🔑 Generate new license keys (admin)
│   ├── verify.js               # ✅ Verify keys & bind/validate HWID
│   ├── reset.js                # 🔄 User HWID reset (24h cooldown)
│   ├── info.js                 # 📋 Get key information (admin)
│   ├── delete.js               # 🗑️ Delete specific key (admin)
│   ├── deleteAll.js            # ☠️ Delete all keys (admin)
│   └── adminReset.js           # 🛠️ Force HWID reset, no cooldown (admin)
├── utils/
│   └── github.js               # 🐙 GitHub API integration utilities
├── keys.json                   # 📦 License keys database (JSON format)
├── index.html                  # 🌐 Web UI & admin dashboard
├── package.json                # 📄 Project dependencies & metadata
├── vercel.json                 # ⚙️ Vercel deployment configuration (auto-generated)
└── README.md                   # 📖 This documentation file
```

### File Descriptions

#### API Endpoints (`/api/` folder)
- **`make.js`** - Creates new random license keys. Requires admin authentication.
- **`verify.js`** - Core verification logic. Binds keys to HWID on first use, validates on subsequent calls.
- **`reset.js`** - Allows users to reset their HWID binding once every 24 hours.
- **`info.js`** - Returns detailed information about a key (creation date, HWID, reset history).
- **`delete.js`** - Removes a specific license key from the system.
- **`deleteAll.js`** - Nuclear option - removes ALL keys (admin only, use with caution).
- **`adminReset.js`** - Instant HWID reset for customer support scenarios.

#### Utilities (`/utils/` folder)
- **`github.js`** - Handles all GitHub API operations (read/write `keys.json`, authentication).

#### Core Files
- **`keys.json`** - The database file stored in your GitHub repo. Structure:
  ```json
  {
    "ABCD-1234-EFGH": {
      "created": "2025-01-15T10:30:00.000Z",
      "hwid": "MAC-00-11-22-33-44-55",
      "lastReset": "2025-01-20T15:45:00.000Z"
    }
  }
  ```
- **`index.html`** - Complete web interface with user verification form and admin panel.

#### Configuration Files
- **`package.json`** - Defines the project as a Node.js application for Vercel.

</details>

---

<details>
<summary><h2>🧪 Testing & Tips</h2></summary>

- Use Postman, Insomnia, curl, or the provided frontend to test endpoints
- All API endpoints are GET-based and require the correct query parameters
- HWID resets are locked to 24h (unless using `/adminReset` as admin)
- All data is stored in your private GitHub repo's `keys.json` file
- Vercel serves both the API and the web UI from the same deployment

</details>

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
