# **Smart Serve – Team Collaboration Guide**

This README explains **how to fork, clone, set up, and contribute** to the project in a clean and organized workflow.

---

## 🚀 **1. Fork the Repository**

Each member must create their **own copy** of the project.

1. Open the GitHub repo link.
2. Click **Fork** (top-right).
3. GitHub creates a new repo under your account:

   ```
   github.com/<your-username>/Smart-Serve
   ```

---

## 💻 **2. Clone Your Fork to Local System**

Run this command (replace `<your-username>`):

```
git clone https://github.com/<your-username>/Smart-Serve.git
```

Move inside the project:

```
cd Smart-Serve
```

---

## 🛠️ **3. Install Dependencies**

### Backend

```
cd backend
npm install
```

### Frontend

```
cd ../frontend
npm install
```

---

## 🔄 **4. Add the Original Repo as Upstream**

This lets you pull updates that other teammates merged.

```
git remote add upstream https://github.com/<original-owner>/Smart-Serve.git
```

Check remotes:

```
git remote -v
```

You should see:

```
origin    https://github.com/<your-username>/Smart-Serve.git
upstream  https://github.com/<original-owner>/Smart-Serve.git
```

---

## 🌿 **5. Create a New Branch for Your Work**

Never work directly on `main`.

```
git checkout -b feature/<feature-name>
```

Example:

```
git checkout -b feature/auth-api
```

---

## 🧑‍💻 **6. Make Changes & Commit**

After coding:

```
git add .
git commit -m "git message"
```

---

## 📤 **7. Push Your Branch to Your Fork**

```
git push origin feature/<feature-name>
```

---

## 🔁 **8. Open a Pull Request (PR)**

1. Go to your fork on GitHub.
2. It will show: "Compare & Pull Request".
3. Create a PR to the **main branch of the original repo**.
4. Add a clear description of what you changed.
5. Wait for review & approval.

---

## ⬇️ **9. Keep Your Fork Updated**

Before starting any new work:

```
git checkout main
git pull upstream main
git push origin main
```

This ensures everyone works on the latest code.

---

## 📝 **Branch Naming Convention**

Use meaningful names:

| Type          | Example                |
| ------------- | ---------------------- |
| Feature       | `feature/login-page`   |
| Bug Fix       | `fix/user-session-bug` |
| UI Update     | `ui/navbar-redesign`   |
| Documentation | `docs/update-readme`   |

---

## 📌 **Team Workflow Summary**

1. **Fork** → 2. **Clone** → 3. **Create Branch** →
2. **Code** → 5. **Commit** → 6. **Push** →
3. **Make PR** → 8. **Sync with Upstream**

---

## 🧪 **Running the Project (Local Development)**

### Backend

```
cd backend
npm run dev
```

### Frontend

```
cd frontend
npm start
```

Make sure your `.env` files are correctly filled (not included in Git).

---

## 🎯 **Guidelines**

* Do **not** push directly to `main`.
* Use **PRs for every change**.
* Write **clean commits**.
* Pull from **upstream** regularly.
* Follow the folder & code structure.

---

## 🤝 **Happy Building, Team Smart Serve!**

