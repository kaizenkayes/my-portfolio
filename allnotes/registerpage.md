# Register Page — সম্পূর্ণ ব্যাখ্যা

> **File:** `app/(auth)/register/page.tsx`  
> **URL:** `/register`  
> **উদ্দেশ্য:** নতুন account create → login page-এ redirect (auto login নয়)

← [Overview](./auth-overview.md) | [Login Notes →](./loginpage.md)

---

## 📐 Page Structure

```mermaid
flowchart TB
    subgraph URL["/register"]
        L["(auth)/layout.tsx"]
        P["register/page.tsx"]
    end

    L --> CARD["glass-card wrapper"]
    CARD --> P

    P --> LABEL["CREATE ACCOUNT"]
    P --> H1["Join the KaizenHub."]
    P --> FORM["Name + Email + Password"]
    P --> BTN["Create Account button"]
    P --> LINK["Already have account? → /login"]

    style L fill:#f3f4f6
    style P fill:#fef3c7,stroke:#d97706
```

Login-এর মতো same layout — কিন্তু **logic সম্পূর্ণ আলাদা** (Server Action, NextAuth নয়)।

---

## 🔄 Register Flow (Sequence Diagram)

```mermaid
sequenceDiagram
    participant User as ইউজার
    participant Reg as register/page.tsx
    participant Zod as registerSchema
    participant SA as registerUser()
    participant UserModel as User Model
    participant DB as MongoDB

    User->>Reg: Name + Email + Password submit
    Reg->>Zod: Client validation (onTouched)
    Zod-->>Reg: OK / Error
    Reg->>SA: Server Action call
    SA->>DB: User.findOne({ email })
    alt email already exists
        SA-->>Reg: { success: false, error: "Email already registered" }
        Reg->>User: toast.error()
    else new user
        SA->>UserModel: User.create({ ...data, role: "user" })
        UserModel->>UserModel: pre-save: bcrypt.hash(password)
        UserModel->>DB: hashed password save
        SA-->>Reg: { success: true }
        Reg->>User: toast.success()
        Reg->>User: redirect /login?registered=1
    end
```

---

## ⚖️ Login vs Register

| | Login | Register |
|---|--------|----------|
| **কাজ** | Account verify | Account create |
| **API** | `signIn("credentials")` | `registerUser()` Server Action |
| **Validation mode** | onSubmit (default) | `onTouched` |
| **Password rule** | min 8 char | min 8 + upper + lower + number |
| **Session** | JWT তৈরি | Session তৈরি হয় **না** |
| **Success redirect** | `/dashboard` | `/login?registered=1` |
| **Default role** | DB থেকে | `"user"` (hardcoded) |

---

## 🧩 Component Breakdown

### 1. Form Validation — `mode: "onTouched"`

```tsx
useForm<RegisterInput>({
  resolver: zodResolver(registerSchema),
  mode: "onTouched",  // ফিল্ড touch-এর পর validation
});
```

| Mode | Behavior |
|------|----------|
| Login (default) | Submit-এ validate |
| Register (`onTouched`) | Blur/touch-এ validate — typing চলাকালীন কম annoyance |

---

### 2. Form Fields

| Field | Validation Rule |
|-------|-----------------|
| **name** | min 2, max 60 characters |
| **email** | valid email format |
| **password** | min 8 + `a-z` + `A-Z` + `0-9` |

**Password regex:**

```regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)
```

---

### 3. Submit — `registerUser(data)`

```mermaid
flowchart TD
    A["onSubmit(data)"] --> B["registerUser() Server Action"]
    B --> C["connectDB()"]
    C --> D{"email exists?"}
    D -->|Yes| E["error: Email already registered"]
    D -->|No| F["User.create({ name, email, password, role: 'user' })"]
    F --> G["pre-save hook → bcrypt hash"]
    G --> H["MongoDB save"]
    H --> I["success toast"]
    I --> J["/login?registered=1"]

    style E fill:#fee2e2
    style J fill:#dcfce7
```

**Login-এর মতো NextAuth ব্যবহার হয় না** — এটা pure Server Action:

```tsx
const result = await registerUser(data);

if (!result.success) {
  toast.error(result.error ?? "Registration failed");
  return;
}

toast.success("Account created successfully!");
router.push("/login?registered=1");
router.refresh();
```

---

### 4. কেন Login-এ Redirect? (Auto Login নয়)

```mermaid
flowchart LR
    R["Register success"] --> L["/login?registered=1"]
    L --> T["Success toast"]
    T --> S["User manually signs in"]
    S --> D["/dashboard"]

    style R fill:#fef3c7
    style D fill:#dcfce7
```

| Reason | Explanation |
|--------|-------------|
| Security | Explicit credential entry after account create |
| UX clarity | User knows account created, then signs in |
| Separation | Register = create, Login = authenticate |

Login page `useEffect` দিয়ে `?registered=1` detect করে toast দেখায়।

---

## ⚙️ Backend Details

### `registerUser()` — `lib/actions/index.ts`

| Step | Code Logic |
|------|------------|
| 1 | `connectDB()` |
| 2 | Dynamic import `User` model (bundle optimize) |
| 3 | `User.findOne({ email })` — duplicate check |
| 4 | `User.create({ ...data, role: "user" })` |
| 5 | Return `{ success: true/false }` |

> **Admin role** register form দিয়ে তৈরি হয় না — manually DB/seed দিয়ে set করা হয়।

---

### Password Hash — `lib/db/models/User.ts`

```mermaid
flowchart LR
    A["Plain password<br/>(from form)"] --> B["User.create()"]
    B --> C["pre('save') hook"]
    C --> D["bcrypt.hash(pw, 12)"]
    D --> E["MongoDB — hashed only"]

    style A fill:#fef3c7
    style E fill:#dcfce7
```

| Feature | Detail |
|---------|--------|
| `select: false` | Default query-তে password hidden |
| `pre("save")` | Save-এর আগে auto hash |
| `comparePassword()` | Login-এ plain vs hash match |
| Salt rounds | 12 |

---

## 🛡️ Middleware

| Condition | Result |
|-----------|--------|
| Not logged in + `/register` | ✅ Allow (public) |
| Logged in + `/register` | → `/dashboard` redirect |

→ Register public, কিন্তু already logged in user register page access করতে পারে না।

---

## 📂 Files with Bengali Comments

| File | Content |
|------|---------|
| `app/(auth)/register/page.tsx` | Full page |
| `lib/validations/schemas.ts` | registerSchema |
| `lib/actions/index.ts` | registerUser() |
| `lib/db/models/User.ts` | hash + comparePassword |

---

## 🔗 Register → Login Connection

```mermaid
flowchart LR
    subgraph Register Flow
        R1["register/page.tsx"]
        R2["registerUser()"]
        R3["User.create()"]
    end

    subgraph Login Flow
        L1["login/page.tsx"]
        L2["?registered=1 toast"]
        L3["signIn()"]
        L4["authorize() + comparePassword()"]
    end

    R1 --> R2 --> R3
    R3 -->|"redirect"| L1
    L1 --> L2
    L2 --> L3 --> L4

    style R1 fill:#fef3c7
    style L1 fill:#dbeafe
```

---

## 💡 One-Line Summary

```
Register = validate → server action → duplicate check → DB create (hashed pw) → login redirect
Login    = separate step → NextAuth JWT session → dashboard
```
