# Auth System — Big Picture

> Login + Register + Middleware + NextAuth — কীভাবে একসাথে কাজ করে।

---

## 🏗️ Architecture

```mermaid
flowchart TB
    subgraph Client["Browser (Client)"]
        LP["login/page.tsx"]
        RP["register/page.tsx"]
    end

    subgraph Server["Server"]
        NA["NextAuth (auth.ts)"]
        SA["registerUser()"]
        MW["middleware.ts"]
    end

    subgraph Data["Database"]
        DB[("MongoDB — User collection")]
    end

    LP -->|"signIn(credentials)"| NA
    RP -->|"Server Action"| SA
    NA -->|"findOne + comparePassword"| DB
    SA -->|"create + hash password"| DB
    MW -->|"JWT check on every request"| NA

    style LP fill:#dbeafe,stroke:#2563eb
    style RP fill:#fef3c7,stroke:#d97706
    style NA fill:#ede9fe,stroke:#7c3aed
    style SA fill:#fce7f3,stroke:#db2777
    style MW fill:#fee2e2,stroke:#dc2626
    style DB fill:#dcfce7,stroke:#16a34a
```

---

## 📁 File Structure

```
/register URL
/login URL
    │
    └── app/(auth)/layout.tsx     ← route group (URL-এ দেখা যায় না)
            ├── register/page.tsx
            └── login/page.tsx
```

| File | Role |
|------|------|
| `(auth)/layout.tsx` | Shared UI — background, logo, glass card |
| `login/page.tsx` | Sign in UI + NextAuth call |
| `register/page.tsx` | Sign up UI + Server Action call |
| `auth.ts` | Credentials provider, JWT, authorize() |
| `middleware.ts` | Protect `/dashboard`, block non-admin writes |
| `User.ts` | Schema, bcrypt hash on save, comparePassword |

---

## 🔄 Complete User Journey

```mermaid
sequenceDiagram
    autonumber
    participant U as ইউজার
    participant Reg as Register Page
    participant Login as Login Page
    participant MW as Middleware
    participant Dash as Dashboard

    Note over U,Dash: নতুন user path
    U->>Reg: Name + Email + Password
    Reg->>Reg: Zod validation
    Reg->>Reg: registerUser() → DB create
    Reg->>Login: redirect /login?registered=1
    Login->>U: "Registration successful!" toast

    Note over U,Dash: login path
    U->>Login: Email + Password
    Login->>Login: signIn(credentials)
    Login->>Login: authorize() → JWT session
    Login->>Dash: router.push("/dashboard")

    Note over U,Dash: protected access
    U->>MW: GET /dashboard
    MW->>MW: session আছে?
    alt logged in
        MW->>Dash: allow
    else not logged in
        MW->>Login: redirect
    end
```

---

## ⚖️ Login vs Register

| | Login | Register |
|---|--------|----------|
| **উদ্দেশ্য** | আগের account verify | নতুন account create |
| **API** | `signIn("credentials")` | `registerUser()` Server Action |
| **Password rule** | min 8 characters | min 8 + upper + lower + number |
| **Session** | JWT তৈরি হয় (30 days) | Session তৈরি হয় না |
| **Success redirect** | `/dashboard` | `/login?registered=1` |
| **Role** | DB থেকে আসে | সবসময় `"user"` |

---

## 🛡️ Middleware Rules

```mermaid
flowchart TD
    A[Request আসে] --> B{Auth route?<br/>/login, /register}
    B -->|Yes + logged in| C[→ /dashboard]
    B -->|Yes + not logged in| D[allow]

    A --> E{Dashboard route?}
    E -->|Yes + not logged in| F[→ /login]
    E -->|Yes + logged in| G{Admin write?<br/>/new, /edit, /delete}
    G -->|Yes + role ≠ admin| H[→ /dashboard block]
    G -->|No or admin| I[allow]

    style C fill:#fef3c7
    style F fill:#fee2e2
    style H fill:#fee2e2
    style I fill:#dcfce7
    style D fill:#dcfce7
```

| Condition | Result |
|-----------|--------|
| Logged in + `/login` or `/register` | → `/dashboard` |
| Not logged in + `/dashboard` | → `/login` |
| `user` role + `/new`, `/edit`, `/delete` | → block, dashboard |
| `admin` role | full access |

---

## 🔑 Password Security Flow

```mermaid
flowchart LR
    subgraph Register
        P1["Plain password"] --> H["bcrypt.hash(12 rounds)"]
        H --> S1["MongoDB save"]
    end

    subgraph Login
        P2["Plain password"] --> C["comparePassword()"]
        S1 --> C
        C -->|match| OK["JWT session"]
        C -->|no match| ERR["Invalid credentials"]
    end

    style OK fill:#dcfce7
    style ERR fill:#fee2e2
```

> Password **কখনো** plain text DB-তে save হয় না — `User.pre("save")` hook hash করে।

---

## 📖 Deep Dive Links

- [Login Page Notes →](./loginpage.md)
- [Register Page Notes →](./registerpage.md)
