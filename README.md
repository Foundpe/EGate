
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

<details>
<summary><h2>🔌 API Endpoints</h2></summary>

All requests are `GET` based with query parameters. All endpoints are served from your Vercel deployment, e.g. `https://your-vercel-app.vercel.app/api/ENDPOINT`.

### 🔍 `/verify` — Key Verification & HWID Binding

**Purpose:** Verify a license key and bind it to a hardware ID (HWID) on first use, or validate existing HWID binding.

**Parameters:**
- `key` *(required)* — The license key to verify (e.g., `ABCD-1234-EFGH`)
- `hwid` *(required)* — Hardware ID to bind/verify (e.g., device MAC address, CPU ID, etc.)

**Behavior:**
- ✅ **First call:** Binds the key to the provided HWID
- 🔁 **Subsequent calls:** Validates that the HWID matches the bound one
- ❌ **Invalid key:** Returns error message
- ⚠️ **HWID mismatch:** Returns error if key is bound to different HWID

**Example Request:**
```
GET /api/verify?key=ABCD-1234-EFGH&hwid=MAC-00-11-22-33-44-55
```

**Response Examples:**
```
✅ Success (first binding): "key verified and hwid bound"
✅ Success (valid): "key and hwid verified"
❌ Invalid key: "invalid key"
❌ HWID mismatch: "hwid mismatch"
```

---

### 🔄 `/reset` — HWID Reset (User)

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
✅ Success: "hwid reset successful"
⏰ Cooldown active: "reset cooldown active. try again in X hours"
❌ Invalid key: "invalid key"
❌ No HWID bound: "no hwid to reset"
```

**Customization:**
To change the cooldown period, edit line **3** in `api/reset.js`:
```js
const Reset_Delay_Hours = 24; // Change this for a different delay
```

---

### 🔑 `/make` *(Admin Only)*

**Purpose:** Generate a new random license key.

**Parameters:**
- `admin` *(required)* — Admin password (set via `ADMIN_PASSWORD` environment variable)

**Example Request:**
```
GET /api/make?admin=supersecret123
```

**Response Examples:**
```
✅ Success: "New key: ABCD-1234-EFGH-5678"
❌ Unauthorized: "forbidden"
```

---

### 📋 `/info` *(Admin Only)*

**Purpose:** View detailed information about a specific license key, including creation time, HWID binding, and reset history.

**Parameters:**
- `key` *(required)* — The license key to inspect
- `admin` *(required)* — Admin password

**Example Request:**
```
GET /api/info?key=ABCD-1234-EFGH&admin=supersecret123
```

**Response Examples:**
```json
✅ Success: {
  "key": "ABCD-1234-EFGH",
  "created": "2025-01-15T10:30:00.000Z",
  "hwid": "MAC-00-11-22-33-44-55",
  "lastReset": "2025-01-20T15:45:00.000Z"
}

❌ Key not found: "key not found"
❌ Unauthorized: "forbidden"
```

---

### 🗑️ `/delete` *(Admin Only)*

**Purpose:** Permanently delete a specific license key from the system.

**Parameters:**
- `key` *(required)* — The license key to delete
- `admin` *(required)* — Admin password

**Example Request:**
```
GET /api/delete?key=ABCD-1234-EFGH&admin=supersecret123
```

**Response Examples:**
```
✅ Success: "key deleted"
❌ Key not found: "key not found"
❌ Unauthorized: "forbidden"
```

---

### ☠️ `/deleteAll` *(Admin Only)*

**Purpose:** **DANGER ZONE** — Permanently delete ALL license keys from the system. Use with extreme caution!

**Parameters:**
- `admin` *(required)* — Admin password

**Example Request:**
```
GET /api/deleteAll?admin=supersecret123
```

**Response Examples:**
```
✅ Success: "all keys deleted"
❌ Unauthorized: "forbidden"
```

> ⚠️ **Warning:** This action is irreversible and will delete all license keys permanently.

---

### 🛠️ `/adminReset` *(Admin Only)*

**Purpose:** Force reset the HWID binding for any key instantly, bypassing the 24-hour cooldown restriction. Useful for customer support scenarios.

**Parameters:**
- `key` *(required)* — The license key to reset
- `admin` *(required)* — Admin password

**Example Request:**
```
GET /api/adminReset?key=ABCD-1234-EFGH&admin=supersecret123
```

**Response Examples:**
```
✅ Success: "admin hwid reset successful"
❌ Key not found: "key not found"
❌ No HWID bound: "no hwid to reset"
❌ Unauthorized: "forbidden"
```

</details>

---

<details>
<summary><h2>💻 API Usage Examples</h2></summary>

### Python

```python
import requests
import json

BASE = "https://your-vercel-app.vercel.app/api"
ADMIN_PASSWORD = "supersecret123"

# Example 1: Verify a key and bind HWID (first time)
def verify_key(key, hwid):
    response = requests.get(f"{BASE}/verify", params={"key": key, "hwid": hwid})
    print(f"Verify Response: {response.text}")
    return response.text

# Example 2: Reset HWID (user)
def reset_hwid(key):
    response = requests.get(f"{BASE}/reset", params={"key": key})
    print(f"Reset Response: {response.text}")
    return response.text

# Example 3: Generate new key (admin)
def create_new_key():
    response = requests.get(f"{BASE}/make", params={"admin": ADMIN_PASSWORD})
    print(f"New Key: {response.text}")
    return response.text

# Example 4: Get key information (admin)
def get_key_info(key):
    response = requests.get(f"{BASE}/info", params={"key": key, "admin": ADMIN_PASSWORD})
    print(f"Key Info: {response.text}")
    try:
        return json.loads(response.text)
    except:
        return response.text

# Example 5: Force reset HWID (admin)
def admin_reset_hwid(key):
    response = requests.get(f"{BASE}/adminReset", params={"key": key, "admin": ADMIN_PASSWORD})
    print(f"Admin Reset: {response.text}")
    return response.text

# Example 6: Delete a specific key (admin)
def delete_key(key):
    response = requests.get(f"{BASE}/delete", params={"key": key, "admin": ADMIN_PASSWORD})
    print(f"Delete Response: {response.text}")
    return response.text

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

// Example 1: Verify key with async/await
async function verifyKey(key, hwid) {
    try {
        const response = await fetch(`${BASE}/verify?key=${key}&hwid=${hwid}`);
        const result = await response.text();
        console.log('Verify Result:', result);
        return result;
    } catch (error) {
        console.error('Error verifying key:', error);
    }
}

// Example 2: Create new key (admin)
async function createNewKey() {
    try {
        const response = await fetch(`${BASE}/make?admin=${ADMIN_PASSWORD}`);
        const result = await response.text();
        console.log('New Key:', result);
        return result;
    } catch (error) {
        console.error('Error creating key:', error);
    }
}

// Example 3: Get key info with error handling
async function getKeyInfo(key) {
    try {
        const response = await fetch(`${BASE}/info?key=${key}&admin=${ADMIN_PASSWORD}`);
        const result = await response.text();
        
        // Try to parse as JSON
        try {
            const jsonResult = JSON.parse(result);
            console.log('Key Info (JSON):', jsonResult);
            return jsonResult;
        } catch {
            console.log('Key Info (Text):', result);
            return result;
        }
    } catch (error) {
        console.error('Error getting key info:', error);
    }
}

// Example 4: Complete workflow
async function exampleWorkflow() {
    // Create a new key
    const newKeyResponse = await createNewKey();
    
    if (newKeyResponse && newKeyResponse.includes('New key:')) {
        const key = newKeyResponse.split('New key: ')[1].trim();
        
        // Verify the key with different HWIDs
        await verifyKey(key, 'device-001');
        await verifyKey(key, 'device-002'); // This should fail
        
        // Get key information
        await getKeyInfo(key);
        
        // Reset HWID as admin
        const resetResponse = await fetch(`${BASE}/adminReset?key=${key}&admin=${ADMIN_PASSWORD}`);
        console.log('Admin Reset:', await resetResponse.text());
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

# Example 1: Verify a key and bind HWID
curl -G "${API_BASE}/verify" \
  --data-urlencode "key=ABCD-1234-EFGH" \
  --data-urlencode "hwid=MAC-00-11-22-33-44-55"

# Example 2: Reset HWID (user)
curl -G "${API_BASE}/reset" \
  --data-urlencode "key=ABCD-1234-EFGH"

# Example 3: Create new key (admin)
curl -G "${API_BASE}/make" \
  --data-urlencode "admin=${ADMIN_PASSWORD}"

# Example 4: Get key information (admin) - formatted JSON output
curl -G "${API_BASE}/info" \
  --data-urlencode "key=ABCD-1234-EFGH" \
  --data-urlencode "admin=${ADMIN_PASSWORD}" | jq '.'

# Example 5: Force reset HWID (admin)
curl -G "${API_BASE}/adminReset" \
  --data-urlencode "key=ABCD-1234-EFGH" \
  --data-urlencode "admin=${ADMIN_PASSWORD}"

# Example 6: Delete a key (admin)
curl -G "${API_BASE}/delete" \
  --data-urlencode "key=ABCD-1234-EFGH" \
  --data-urlencode "admin=${ADMIN_PASSWORD}"

# Example 7: Batch operations script
#!/bin/bash
API_BASE="https://your-vercel-app.vercel.app/api"
ADMIN_PASSWORD="supersecret123"

# Create multiple keys
echo "Creating 5 new keys..."
for i in {1..5}; do
    echo "Key $i:"
    curl -s -G "${API_BASE}/make" --data-urlencode "admin=${ADMIN_PASSWORD}"
    echo
done

# List all keys (you'd need to implement this endpoint or check keys.json)
echo -e "\nDone creating keys!"
```

### PowerShell (Windows)

```powershell
# PowerShell examples for Windows users
$API_BASE = "https://your-vercel-app.vercel.app/api"
$ADMIN_PASSWORD = "supersecret123"

# Function to verify a key
function Verify-EGateKey {
    param(
        [string]$Key,
        [string]$HWID
    )
    
    $uri = "$API_BASE/verify?key=$Key&hwid=$HWID"
    try {
        $response = Invoke-RestMethod -Uri $uri -Method Get
        Write-Host "Verification Result: $response" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Function to create a new key
function New-EGateKey {
    $uri = "$API_BASE/make?admin=$ADMIN_PASSWORD"
    try {
        $response = Invoke-RestMethod -Uri $uri -Method Get
        Write-Host "New Key Created: $response" -ForegroundColor Green
        return $response
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
        $response = Invoke-RestMethod -Uri $uri -Method Get
        Write-Host "Key Information:" -ForegroundColor Cyan
        $response | ConvertTo-Json -Depth 2 | Write-Host
        return $response
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

</details>

---

<details>
<summary><h2>📊 Response Codes & Error Handling</h2></summary>

### HTTP Status Codes

All endpoints return **HTTP 200 OK** for both successful and error responses. The actual result is determined by the response body content.

### Common Response Messages

| Response | Meaning | Action Required |
|----------|---------|-----------------|
| `"key verified and hwid bound"` | ✅ First-time verification successful | Key is now bound to HWID |
| `"key and hwid verified"` | ✅ Subsequent verification successful | Key and HWID match |
| `"invalid key"` | ❌ Key doesn't exist | Check key format/validity |
| `"hwid mismatch"` | ❌ Key bound to different HWID | Use correct device or reset HWID |
| `"forbidden"` | ❌ Admin password incorrect | Check ADMIN_PASSWORD |
| `"reset cooldown active. try again in X hours"` | ⏰ Reset attempted too soon | Wait for cooldown or use admin reset |
| `"hwid reset successful"` | ✅ HWID reset completed | Key can now be bound to new device |
| `"admin hwid reset successful"` | ✅ Admin force reset completed | Key can now be bound to new device |
| `"key not found"` | ❌ Key doesn't exist for admin operations | Verify key exists |
| `"no hwid to reset"` | ❌ Key has no HWID binding | Nothing to reset |
| `"key deleted"` | ✅ Key successfully deleted | Key removed from system |
| `"all keys deleted"` | ✅ All keys purged | All keys removed from system |

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
<summary><h2>🌐 Web UI (`index.html`)</h2></summary>

- 🔐 Check Key
- 🔁 Reset HWID
- 🧑‍💼 Admin Panel (make, delete, inspect, force reset keys)

> 📌 **Configure your API URL:**
> In `index.html`, set your deployed API base URL on **line 96**:
```js
const API = "https://your-vercel-app.vercel.app/api";
```

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
