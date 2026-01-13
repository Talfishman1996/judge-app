# Security Assessment: Judge App
Generated: 2026-01-12

## Executive Summary
- **Risk Level:** CRITICAL
- **Findings:** 2 critical, 3 high, 4 medium
- **Immediate Actions Required:** YES - API key is exposed in client-side code AND git history

## Threat Model
- **Attackers:** Anyone with access to the deployed app, git repository, or browser dev tools
- **Assets at Risk:** Gemini API key (billing/quota abuse), user-submitted conversation data (privacy)
- **Attack Vectors:** Source code inspection, git history, localStorage access, XSS (if introduced)

---

## Findings

### CRITICAL: Hardcoded API Key in Source Code
**Location:** C:\Users\Admin\Desktop\Projects\Judge App\app\src\services\gemini.ts:111-113
**Vulnerability:** API Key Exposure
**Risk:** Anyone can extract the API key from the bundled JavaScript, leading to:
- Unauthorized API usage billed to the key owner
- Quota exhaustion (denial of service for legitimate users)
- Potential abuse for malicious AI content generation

**Evidence:**
```typescript
function getApiKey(): string {
  // Hardcoded API key - creator foots the bill
  return 'AIzaSyAAFMVltRc4lu1uAfCcNG1ZLtefWC5noQU'
}
```

**Remediation:**
1. IMMEDIATELY revoke the exposed API key in Google AI Studio
2. Generate a new API key
3. Implement a backend proxy to make API calls (the API key should NEVER be in client-side code)
4. If backend is not possible, use Googles API key restrictions (HTTP referrer, API restrictions)


### CRITICAL: API Key Committed to Git History
**Location:** Git commit 0469f898f36da6de34bda02bc0e99ad602d5a37d
**Vulnerability:** Secrets in Version Control
**Risk:** Even if the key is removed from current code, it remains in git history forever. Anyone with repo access (or if pushed to GitHub) can extract it.

**Remediation:**
1. The key MUST be revoked (cannot be cleaned from git history safely)
2. If this repo is public or shared, consider it fully compromised
3. Use git filter-branch or BFG Repo-Cleaner only AFTER revoking the key
4. Never commit secrets again - use environment variables with .env files


### HIGH: API Key Also in .env File
**Location:** C:\Users\Admin\Desktop\Projects\Judge App\app\.env:5
**Vulnerability:** Duplicate Secret Storage
**Risk:** While .env is gitignored, the same key exists in source code. This creates confusion about secret management.

**Remediation:**
1. Delete the .env file after revoking the key
2. Never store production keys in development environment files
3. Use separate keys for development/production


### HIGH: User-Submitted Data Stored Unencrypted
**Location:** Multiple pages using localStorage and sessionStorage
**Vulnerability:** Sensitive Data Exposure
**Risk:** User conversations (potentially private disputes, relationship conflicts) are stored in plain text:
- Accessible to any JavaScript running on the page
- Persists after session ends (localStorage)
- Vulnerable to XSS attacks (if any are introduced)

**Files with storage access:**
- TextInputPage.tsx:43-44 - Stores conversation, party names, context
- UploadPage.tsx:110-111 - Stores base64 screenshot data
- VerdictPage.tsx:71,93 - Reads verdict data
- SettingsPage.tsx:15,33 - Stores API key (though unused)
- Multiple verdict pages read stored data

**Remediation:**
1. Use IndexedDB for larger data (already used for case history)
2. Consider encrypting sensitive data before storage
3. Add clear data retention policies
4. Prefer sessionStorage over localStorage for sensitive data
5. Implement automatic data cleanup after sharing


### HIGH: Vite Server AllowedHosts Disabled
**Location:** C:\Users\Admin\Desktop\Projects\Judge App\app\vite.config.ts:8
**Vulnerability:** Host Header Injection / CORS Bypass
**Risk:** allowedHosts: true disables host validation, allowing:
- DNS rebinding attacks in development
- Potential CORS bypass scenarios

**Evidence:**
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true  // <-- Dangerous
  }
})
```

**Remediation:**
1. Remove allowedHosts: true or specify allowed hostnames
2. Use default Vite security settings for development


### MEDIUM: No Input Sanitization on User Text
**Location:** TextInputPage.tsx:121-123, TextInputPage.tsx:145-149
**Vulnerability:** Potential XSS Vector
**Risk:** While React escapes content by default, user input is stored and displayed without sanitization

**Current Mitigation:** React default escaping prevents XSS in most cases.

**Remediation:**
1. Add input length limits (prevent DoS via large payloads)
2. Sanitize before storage using DOMPurify or similar
3. Validate input format where appropriate


### MEDIUM: No Content Security Policy
**Location:** C:\Users\Admin\Desktop\Projects\Judge App\app\index.html
**Vulnerability:** Missing Security Headers
**Risk:** No CSP means easier XSS exploitation if vulnerability exists

**Remediation:**
1. Add CSP meta tag or configure headers in deployment
2. Restrict script sources to self
3. Add X-Frame-Options header
4. Add X-Content-Type-Options: nosniff


### MEDIUM: Base64 Screenshots in localStorage
**Location:** UploadPage.tsx:96-103
**Vulnerability:** Privacy Risk / Storage Limits
**Risk:** User screenshots are converted to base64 and stored in localStorage

**Remediation:**
1. Store screenshots in IndexedDB (larger quota, cleaner API)
2. Implement image compression before storage
3. Clear screenshots after API submission


### MEDIUM: Test Mode Persists API Bypass
**Location:** C:\Users\Admin\Desktop\Projects\Judge App\app\src\services\gemini.ts:203-205
**Vulnerability:** Feature Flag Tampering
**Risk:** Users can enable test mode via localStorage to bypass API calls

**Remediation:**
1. Remove test mode in production builds
2. Use build-time flags instead of runtime localStorage

---

## Dependency Vulnerabilities

npm audit reports 0 vulnerabilities across 273 dependencies. Dependencies are current.

---

## Secrets Exposure Check

| Check | Status | Notes |
|-------|--------|-------|
| .env in .gitignore | YES | Properly ignored |
| .env committed to git | NO | Not tracked |
| Hardcoded secrets in code | CRITICAL | API key in gemini.ts |
| Secrets in git history | CRITICAL | Committed in 0469f89 |

---

## Recommendations

### Immediate (Critical/High) - DO TODAY
1. Revoke the exposed API key in Google AI Studio immediately
2. Generate a new API key with proper restrictions
3. Implement a backend proxy - the API key must not be in client code
4. Update gemini.ts to call your backend instead of Google directly
5. Clean git history using BFG Repo-Cleaner (after revoking key)

### Short-term (Medium) - This Week
1. Add Content Security Policy headers
2. Implement input sanitization with length limits
3. Move screenshot storage to IndexedDB
4. Remove test mode from production builds
5. Add privacy policy and user consent for data storage
6. Fix Vite allowedHosts configuration

### Long-term (Hardening)
1. Implement client-side encryption for stored data
2. Add automatic data expiration
3. Set up secret scanning in CI/CD
4. Implement rate limiting on backend proxy

---

## SECURITY SCORE: 2/10

**Justification:**
- -4 points: Hardcoded API key in source code (critical)
- -2 points: API key in git history (critical)
- -1 point: Missing CSP headers
- -1 point: Unencrypted sensitive data storage

**Positive factors:**
- No XSS via dangerouslySetInnerHTML
- Dependencies are up-to-date with no known vulnerabilities
- .env properly gitignored
- React default escaping provides baseline XSS protection

The hardcoded API key is a fundamental security failure that must be addressed before any public deployment.
