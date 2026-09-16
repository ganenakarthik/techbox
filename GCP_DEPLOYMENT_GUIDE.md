# TechBox Google Cloud + Cloudflare Production Deployment Guide

This guide documents the exact enterprise setup for running TechBox on **Google Cloud Platform (Cloud Run, Cloud SQL, Cloud Storage, Secret Manager)** behind **Cloudflare**.

---

## 1. Google Cloud SQL (PostgreSQL) Setup

1. **Create Cloud SQL Instance**:
   ```bash
   gcloud sql instances create techbox-pg-prod \
     --database-version=POSTGRES_15 \
     --tier=db-custom-2-7680 \
     --region=asia-south1 \
     --storage-auto-increase \
     --backup-start-time=02:00
   ```

2. **Create Database & User**:
   ```bash
   gcloud sql databases create techbox --instance=techbox-pg-prod
   gcloud sql users create techbox_app --instance=techbox-pg-prod --password="SECURE_DB_PASSWORD"
   ```

3. **Database Connection String**:
   * For Cloud Run via Cloud SQL Unix socket:
     `postgresql://techbox_app:SECURE_DB_PASSWORD@/techbox?host=/cloudsql/PROJECT_ID:asia-south1:techbox-pg-prod`

---

## 2. Google Cloud Storage (GCS) Setup

1. **Create Bucket**:
   ```bash
   gcloud storage buckets create gs://techbox-production-assets \
     --location=asia-south1 \
     --uniform-bucket-level-access
   ```

2. **Configure CORS for Client Uploads**:
   ```json
   [
     {
       "origin": ["https://techbox.in"],
       "method": ["GET", "PUT", "POST", "HEAD"],
       "responseHeader": ["Content-Type", "x-goog-meta-*"],
       "maxAgeSeconds": 3600
     }
   ]
   ```
   Save as `cors.json` and apply:
   ```bash
   gcloud storage buckets update gs://techbox-production-assets --cors-file=cors.json
   ```

---

## 3. Google Secret Manager Setup

Store all production secrets in Google Cloud Secret Manager:

```bash
# 1. Database URL
gcloud secrets create techbox-db-url --replication-policy="automatic"
echo -n "postgresql://techbox_app:SECURE_DB_PASSWORD@/techbox?host=/cloudsql/PROJECT_ID:asia-south1:techbox-pg-prod" | \
  gcloud secrets versions add techbox-db-url --data-file=-

# 2. Auth Secret
gcloud secrets create techbox-auth-secret --replication-policy="automatic"
openssl rand -hex 32 | tr -d '\n' | gcloud secrets versions add techbox-auth-secret --data-file=-

# 3. SMS OTP API Key
gcloud secrets create techbox-fast2sms-key --replication-policy="automatic"
echo -n "YOUR_FAST2SMS_API_KEY" | gcloud secrets versions add techbox-fast2sms-key --data-file=-
```

---

## 4. Google Cloud Run Deployment

1. **Build Container via Google Cloud Build**:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/techbox:latest .
   ```

2. **Run Database Migrations (One-time or pre-deploy)**:
   ```bash
   npx prisma migrate deploy
   ```

3. **Deploy to Cloud Run with Secret Manager & Cloud SQL Connection**:
   ```bash
   gcloud run deploy techbox-service \
     --image gcr.io/PROJECT_ID/techbox:latest \
     --platform managed \
     --region asia-south1 \
     --allow-unauthenticated \
     --port 8080 \
     --memory 2Gi \
     --cpu 2 \
     --min-instances 1 \
     --max-instances 10 \
     --add-cloudsql-instances PROJECT_ID:asia-south1:techbox-pg-prod \
     --set-secrets="DATABASE_URL=techbox-db-url:latest,AUTH_SECRET=techbox-auth-secret:latest,FAST2SMS_API_KEY=techbox-fast2sms-key:latest" \
     --set-env-vars="NODE_ENV=production,STORAGE_PROVIDER=GCS,GCS_BUCKET_NAME=techbox-production-assets,OTP_PROVIDER=FAST2SMS,NEXT_PUBLIC_APP_URL=https://techbox.in"
   ```

4. **Health Check Probes**:
   Cloud Run automatically checks:
   - **Liveness Probe**: `GET /api/health` (HTTP 200)
   - **Readiness Probe**: `GET /api/ready` (Probes PostgreSQL via `SELECT 1`, returns HTTP 200 if connected or HTTP 503 if unreachable)

---

## 5. Cloudflare Configuration

1. **DNS Mapping**:
   * Add CNAME record:
     `techbox.in` -> `ghs.googlehosted.com` (or Cloud Run custom domain target)
   * Proxy status: **Proxied (Orange Cloud)**

2. **SSL / TLS**:
   * Encryption mode: **Full (Strict)**
   * Enable **Always Use HTTPS**
   * Enable **HTTP/2** and **HTTP/3 (QUIC)**

3. **Cache Rules (Critical)**:
   * **Bypass Cache**:
     - `techbox.in/api/*`
     - `techbox.in/checkout`
     - `techbox.in/cart`
     - `techbox.in/orders/*`
     - `techbox.in/account/*`
     - `techbox.in/admin/*`
   * **Cache Everything**:
     - `techbox.in/_next/static/*` (Edge TTL: 1 month, Browser TTL: 1 month)
     - `techbox.in/images/*` (Edge TTL: 7 days)

4. **WAF & Security**:
   * Rate limiting rule on `/api/auth/otp/*`: max 5 requests per minute per IP.
   * Rate limiting rule on `/api/checkout`: max 10 requests per minute per IP.
   * Cloudflare Turnstile integration on signup / checkout.
