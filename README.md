
# 🔁 Para_Phraser – AI-Powered Text Paraphrasing (FastAPI + React + AWS CI/CD)

Para_Phraser is an AI-based text rewriting tool built using **FastAPI (backend)** and **React (frontend)**.  
The project includes a complete **DevOps-ready deployment workflow**:

- 🌐 **React frontend hosted on AWS S3 (Static Website)**
- 🚀 **GitHub Actions CI/CD Pipeline** → Auto-deploy to S3 on every push
- ⚡ **FastAPI backend hosted on AWS EC2**
- 🔐 **Production-grade environment with Nginx Reverse Proxy**
- 🧠 **ML-powered paraphrasing logic**

---

## 📌 Features

- ✨ AI-based text paraphrasing with multiple styles  
- ⚡ Fast & lightweight FastAPI backend  
- 🌐 React clean UI frontend  
- 🔄 One-click deployment to S3 via GitHub Actions  
- 🖥️ EC2-hosted FastAPI with systemd service  
- 🔁 CORS-enabled API  
- 🔒 Secure architecture with reverse proxy  

---

## 🖼️ Project Architecture

```
React Frontend (S3 Static Hosting)
        │
        ▼
GitHub Actions ───► S3 Bucket (Auto Deploy)
        │
        ▼
FastAPI Backend (EC2)
        │
        ▼
ML Paraphraser Engine
```

---

## 📁 Directory Structure

```
Para_Phraser/
├── backend/
│   ├── main.py
│   ├── utils/
│   ├── models/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── .github/workflows/
│   └── deploy.yml
└── README.md
```

---

# 🚀 Deployment Details

## 1️⃣ **Frontend Deployment – AWS S3 + GitHub Actions**

Your React build is automatically deployed to Amazon S3 whenever you push to `main`.

### 🔧 **GitHub Actions Workflow (deploy.yml)**  
> Click the copy icon on GitHub to copy instantly.

```yml
name: Deploy React to S3

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install Dependencies
        run: |
          cd frontend
          npm install

      - name: Build React App
        run: |
          cd frontend
          npm run build

      - name: Deploy to S3
        uses: aws-actions/s3-sync@v2
        with:
          bucket: ${{ secrets.AWS_S3_BUCKET }}
          folder: frontend/dist
          delete: true
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: "ap-south-1"
```

---

## 2️⃣ **Backend Deployment – AWS EC2 (FastAPI)**

Your FastAPI backend runs on an EC2 instance with production-grade configuration.

---

# 🖥️ EC2 Deployment Guide (FastAPI)

## 🔧 **Recommended EC2 Instance**

| Component | Requirement |
|----------|-------------|
| OS | Ubuntu 22.04 LTS |
| Instance Type | t2.micro / t3.micro |
| Storage | 16–30 GB |
| Ports | 22, 80, 443, 8000 |
| Python | 3.10+ |
| Web Server | Nginx |
| Process Manager | systemd / uvicorn |

---

## 🔐 **Security Group Rules**

| Port | Purpose |
|------|----------|
| 22   | SSH |
| 80   | HTTP (frontend ↔ backend) |
| 443  | HTTPS |
| 8000 | FastAPI internal (optional, not recommended public) |

---

## 🛠️ **EC2 Setup Commands**

### 1️⃣ Update your server

```bash
sudo apt update && sudo apt upgrade -y
```

### 2️⃣ Install Python

```bash
sudo apt install python3 python3-pip -y
```

### 3️⃣ Clone your backend repo

```bash
git clone https://github.com/Ripcodes/Para_Phraser.git
cd Para_Phraser/backend
```

### 4️⃣ Install FastAPI dependencies

```bash
pip install -r requirements.txt
```

### 5️⃣ Test locally

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## ⚙️ **Production Setup – Nginx Reverse Proxy**

### Install Nginx

```bash
sudo apt install nginx -y
```

### Configure reverse proxy

```bash
sudo nano /etc/nginx/sites-available/paraphraser
```

Paste:

```
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable config:

```bash
sudo ln -s /etc/nginx/sites-available/paraphraser /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## 🔄 Run FastAPI as Systemd Service

Create service:

```bash
sudo nano /etc/systemd/system/paraphraser.service
```

Add:

```
[Unit]
Description=FastAPI Paraphraser
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/Para_Phraser/backend
ExecStart=/usr/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable paraphraser
sudo systemctl start paraphraser
```

---

# 🧪 API Usage

### Paraphrase Text

```
POST http://<EC2-PUBLIC-IP>/paraphrase
```

### Sample Request

```json
{
  "text": "Machine learning is changing the world."
}
```

### Sample Response

```json
{
  "paraphrased": "The world is being transformed by machine learning."
}
```

---

# 🎯 Environment Variables (.env Example)

```
API_KEY=your_key
MODEL=paraphrase-mpnet-base-v2
```

---

# ✔️ To-Do (Future Enhancements)

- [ ] Add multiple paraphrasing styles  
- [ ] Add plagiarism checker  
- [ ] Add rate-limiting  
- [ ] Add JWT authentication  
- [ ] Add Docker deployment  

---

# 📸 Screenshots (Add yours)

```
![UI Screenshot](./screenshots/ui.png)
![EC2 Setup](./screenshots/ec2.png)
```

---

# 💡 Author

**Ripcodes / Pranav Patil**  
🚀 Passionate DevOps & Cloud Developer  
📦 AWS | FastAPI | React | CI/CD

---

If you want, I can also generate:

✅ Project logo  
✅ Architecture diagram  
✅ Badges (build, AWS, version, license)  
✅ Add a live demo section  
✅ Auto-generated API docs section  

Just tell me — I’ll add it!
