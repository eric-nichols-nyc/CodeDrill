# 🔐 Security Lab

A hands-on Next.js 16 application for learning and demonstrating web security best practices. Each file is heavily annotated with interview-ready explanations of security concepts.

## 🎯 Goal

This project serves as a **learning playground** for understanding how to secure a Next.js application. It covers the essential security concepts that every full-stack developer should know, with working code examples and detailed explanations.

## 📚 Security Topics Covered

### 1. Authentication & Session Management

**File:** `app/api/login/route.ts`

- **Secure cookie configuration** — `httpOnly`, `secure`, `sameSite` flags
- **JWT tokens** — Server-side signing with secrets
- **Input validation** — Using Zod for type-safe validation
- **Credential handling** — Why plaintext passwords are dangerous
- **User enumeration prevention** — Generic error messages

**Key concepts:**

- Why `httpOnly` prevents XSS token theft
- How `sameSite` mitigates CSRF attacks
- Why secrets must never be in client-side code

### 2. CORS Protection

**File:** `proxy.ts`

- **Cross-Origin Resource Sharing** — Controlling which domains can access your API
- **Preflight requests** — Handling OPTIONS requests properly
- **Origin validation** — Blocking unauthorized origins

**Key concepts:**

- CORS only affects browser requests (curl/Postman bypass it)
- Full CORS requires both request blocking AND response headers
- Not a substitute for authentication

### 3. Security Headers

**File:** `next.config.js`

| Header                        | Prevents              |
| ----------------------------- | --------------------- |
| Content-Security-Policy (CSP) | XSS attacks           |
| X-Frame-Options               | Clickjacking          |
| X-Content-Type-Options        | MIME sniffing attacks |
| Referrer-Policy               | URL/data leakage      |

**Key concepts:**

- CSP is the most powerful security header
- Security headers are a defense-in-depth layer
- Zero implementation cost, high security value

### 4. Rate Limiting

**Files:** `lib/rate-limit.ts`, `app/api/rate-limit-demo/route.ts`

- **Brute force protection** — Limiting login attempts
- **DoS mitigation** — Preventing resource exhaustion
- **API abuse prevention** — Stopping scrapers and bots
- **Cost control** — Preventing runaway API bills

**Key concepts:**

- Different endpoints need different limits
- In-memory vs Redis vs Edge rate limiting
- 429 status code and Retry-After header

### 5. CSRF Protection

**Files:** `lib/csrf.ts`, `app/api/csrf-demo/route.ts`

- **Cross-Site Request Forgery** — Preventing unauthorized state changes
- **Double-Submit Cookie Pattern** — Stateless CSRF validation
- **Token generation & validation** — Using signed JWTs as CSRF tokens

**Key concepts:**

- Why `sameSite` cookies alone aren't always enough
- How CSRF attacks exploit automatic cookie sending
- Synchronizer Token vs Double-Submit Cookie patterns
- When to require CSRF tokens (POST, PUT, DELETE — not GET)

### 6. Middleware-Based Authorization

**Files:** `middleware.ts`, `lib/auth.ts`, `app/api/protected/user-profile/route.ts`, `app/api/protected/admin-only/route.ts`

- **JWT verification in middleware** — Centralized authentication before routes
- **Header-based user passing** — Passing authenticated user data to API routes
- **Role-based access control (RBAC)** — Checking user roles for authorization
- **Protected routes** — Blocking unauthenticated requests at the edge

**Key concepts:**

- Middleware runs before route handlers (fails fast)
- Authentication (who are you?) vs Authorization (what can you do?)
- Passing data from middleware to routes via headers
- Edge Runtime limitations and capabilities
- Separating auth checks (middleware) from business logic (routes)

### 7. Secure Form Components

**Files:** `app/secure-form/page.tsx`, `app/secure-form/secure-transfer-form.tsx`

- **CSRF token integration** — Server generates, client submits, server validates
- **Client vs server validation** — Client for UX, server for security
- **React XSS protection** — Auto-escaping and dangerous patterns to avoid
- **Secure fetch requests** — Proper credentials and error handling

**Key concepts:**

- Why client-side validation is for UX, not security
- Never store tokens in localStorage (XSS vulnerable)
- How React auto-escapes output to prevent XSS
- Proper error handling that doesn't leak information

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The app runs on **http://localhost:3008**

## 🧪 Test the Security Features

### Test Login Endpoint

```bash
# Successful login
curl -X POST http://localhost:3008/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# Failed login (wrong password)
curl -X POST http://localhost:3008/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"wrong"}'

# Validation error (invalid email)
curl -X POST http://localhost:3008/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"not-an-email","password":"test"}'
```

### Test Rate Limiting

```bash
# Hit the endpoint 15 times rapidly
for i in {1..15}; do
  curl -s http://localhost:3008/api/rate-limit-demo | jq
done

# First 10 succeed, then you get 429 errors
```

### Check Security Headers

```bash
# View all response headers
curl -I http://localhost:3008

# Look for:
# - Content-Security-Policy
# - X-Frame-Options: DENY
# - X-Content-Type-Options: nosniff
# - Referrer-Policy: strict-origin-when-cross-origin
```

### Test CSRF Protection

```bash
# Step 1: Get a CSRF token (saves cookie)
curl http://localhost:3008/api/csrf-demo -c cookies.txt

# Step 2: Extract token and submit with valid token (succeeds)
TOKEN=$(cat cookies.txt | grep csrf_token | awk '{print $7}')
curl -X POST http://localhost:3008/api/csrf-demo \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{\"csrf_token\":\"$TOKEN\",\"action\":\"transfer\",\"amount\":100}"

# Step 3: Submit WITHOUT token (fails - simulates CSRF attack!)
curl -X POST http://localhost:3008/api/csrf-demo \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"action":"transfer","amount":100}'
```

### Test Protected API Routes (Middleware Authorization)

The proxy (middleware) protects `/api/protected/*` routes by verifying JWT tokens. Here's how to test:

#### Test 1: Access Protected Route Without Authentication

```bash
# Should fail with 401 Unauthorized (blocked by proxy)
curl -v http://localhost:3008/api/protected/user-profile
```

**Expected:** `401 Unauthorized - Authentication required`

#### Test 2: Login and Access Protected Route

```bash
# Step 1: Login as regular user (saves session cookie)
curl -X POST http://localhost:3008/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"user123"}' \
  -c cookies.txt

# Step 2: Access protected route (succeeds - proxy validates JWT)
curl -v http://localhost:3008/api/protected/user-profile -b cookies.txt
```

**Expected:** `200 OK` with user profile data:
```json
{
  "message": "Successfully accessed protected route",
  "user": {
    "email": "user@test.com",
    "role": "user",
    "authenticated": true
  }
}
```

#### Test 3: Access Admin Route as Regular User

```bash
# Use the same cookies from Test 2
curl -v http://localhost:3008/api/protected/admin-only -b cookies.txt
```

**Expected:** `403 Forbidden` - User authenticated but lacks admin role

#### Test 4: Access Admin Route as Admin

```bash
# Step 1: Login as admin (overwrites cookies.txt)
curl -X POST http://localhost:3008/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}' \
  -c cookies.txt

# Step 2: Access admin route (succeeds)
curl -v http://localhost:3008/api/protected/admin-only -b cookies.txt
```

**Expected:** `200 OK` with admin data:
```json
{
  "message": "Admin access granted",
  "user": {
    "email": "admin@test.com",
    "role": "admin"
  },
  "adminData": {
    "totalUsers": 42,
    "systemStatus": "operational",
    ...
  }
}
```

#### Test 5: Test Expired/Invalid Token

```bash
# Step 1: Login to get valid token
curl -X POST http://localhost:3008/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"user123"}' \
  -c cookies.txt

# Step 2: Manually corrupt the cookie (simulates tampered token)
# Edit cookies.txt and change the session cookie value to something invalid
# Then try to access the route
curl -v http://localhost:3008/api/protected/user-profile -b cookies.txt
```

**Expected:** `401 Invalid or expired session`

#### Test 6: Update User Profile (PUT request)

```bash
# Make sure you're logged in first (from Test 2)
curl -X PUT http://localhost:3008/api/protected/user-profile \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"John Doe","preferences":{"theme":"dark"}}'
```

**Expected:** `200 OK` with updated profile info

#### Quick Test Script

Save this as `test-protected-routes.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3008"
COOKIES="cookies.txt"

echo "🧪 Testing Protected API Routes"
echo "================================"
echo ""

# Test 1: Unauthenticated request
echo "1️⃣  Testing unauthenticated request (should fail)..."
curl -s -w "\nStatus: %{http_code}\n" \
  $BASE_URL/api/protected/user-profile | head -5
echo ""

# Test 2: Login as user
echo "2️⃣  Logging in as regular user..."
curl -s -X POST $BASE_URL/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"user123"}' \
  -c $COOKIES > /dev/null
echo "✅ Logged in"
echo ""

# Test 3: Access protected route
echo "3️⃣  Accessing protected route (should succeed)..."
curl -s -b $COOKIES $BASE_URL/api/protected/user-profile | jq
echo ""

# Test 4: Try admin route as user (should fail)
echo "4️⃣  Trying admin route as regular user (should fail)..."
curl -s -w "\nStatus: %{http_code}\n" \
  -b $COOKIES $BASE_URL/api/protected/admin-only | head -5
echo ""

# Test 5: Login as admin
echo "5️⃣  Logging in as admin..."
curl -s -X POST $BASE_URL/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}' \
  -c $COOKIES > /dev/null
echo "✅ Logged in as admin"
echo ""

# Test 6: Access admin route
echo "6️⃣  Accessing admin route (should succeed)..."
curl -s -b $COOKIES $BASE_URL/api/protected/admin-only | jq
echo ""

echo "✅ All tests completed!"
```

Make it executable and run:
```bash
chmod +x test-protected-routes.sh
./test-protected-routes.sh
```

## 🔑 Mock Users

| Email          | Password | Role  |
| -------------- | -------- | ----- |
| admin@test.com | admin123 | admin |
| user@test.com  | user123  | user  |

## 📁 Project Structure

```
apps/security-lab/
├── app/
│   ├── api/
│   │   ├── login/
│   │   │   └── route.ts        # Auth with cookies, JWT, Zod validation
│   │   ├── rate-limit-demo/
│   │   │   └── route.ts        # Rate limiting demonstration
│   │   ├── csrf-demo/
│   │   │   └── route.ts        # CSRF token validation demo
│   │   └── protected/
│   │       ├── user-profile/
│   │       │   └── route.ts    # Protected route example
│   │       └── admin-only/
│   │           └── route.ts    # Role-based authorization example
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts                 # Auth helper utilities
│   ├── rate-limit.ts           # Reusable rate limiter
│   └── csrf.ts                 # CSRF token generation & validation
├── middleware.ts               # JWT verification & authorization
├── proxy.ts                    # CORS protection (Next.js 16 proxy)
├── next.config.js              # Security headers
└── .env                        # JWT_SECRET (never commit!)
```

## 💡 Interview Talking Points

Each file contains detailed annotations with key interview talking points. When reviewing the code, look for:

1. **Why** each security measure exists (the attack it prevents)
2. **How** it works technically
3. **Trade-offs** and considerations
4. **Production** vs development differences

## 🔒 Security Checklist for Production

- [ ] Use HTTPS everywhere (add HSTS header)
- [ ] Rotate JWT secrets regularly
- [ ] Use Redis for rate limiting across instances
- [ ] Enable CSP reporting to catch violations
- [ ] Add Permissions-Policy header
- [ ] Implement proper logging and monitoring
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting at edge/CDN level
- [ ] Regular dependency updates (`pnpm audit`)

## 📖 Further Reading

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — Most critical web security risks
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [JWT Best Practices](https://auth0.com/blog/jwt-security-best-practices/)

---

Built with Next.js 16, React 19, and TypeScript.
