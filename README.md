

#  Shawty: URL Shortener Service ✨

A distributed, production-grade URL shortening system engineered for **high read throughput**, **low-latency redirects**, and **strong data consistency**.
It uses deterministic identifier generation, Redis-based caching, sliding-window rate limiting, and asynchronous write-behind analytics to scale reliably under heavy load.

---

#  Index

1. [Features](#features)
2. [Architecture Overview](#architecture-overview)

   * [1. Identifier Generation (Base62)](#1-identifier-generation-base62)
   * [2. Caching Strategy (Cache-Aside Pattern)](#2-caching-strategy-cache-aside-pattern)
   * [3. Rate Limiting (Sliding Window Algorithm)](#3-rate-limiting-sliding-window-algorithm)
   * [4. Asynchronous Analytics (Write-Behind)](#4-asynchronous-analytics-write-behind)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)

   * [Prerequisites](#prerequisites)
   * [Installation](#installation)
   * [Environment Setup](#environment-setup)
   * [Database Initialization](#database-initialization)
   * [Running the Application](#running-the-application)
5. [Operational Notes](#operational-notes)

   * [Analytics Sync](#analytics-sync)
   * [Security](#security)


---

#  Features

*  Blazing-fast redirects served from Redis
*  Deterministic Base62 identifier generation (no collisions)
*  Accurate sliding-window rate limiter
*  Asynchronous analytics syncing
*  Serverless API architecture (Next.js)
*  Docker-ready, cloud-friendly environment
*  Write-behind batching for high throughput

---

#  Architecture Overview

The system is optimized for **read-heavy workloads**, where redirect traffic far outweighs write traffic (URL creation).
Each component is tuned for performance, reliability, and simplicity.

---

## 1. Identifier Generation (Base62)

Instead of relying on UUIDs or random strings, the system uses a **deterministic, collision-free strategy**:

* **Atomic Database Sequence**
  A unique integer ID is generated using SQLite's atomic increment.

* **Base62 Encoding**
  The integer ID is converted into a compact alphanumeric slug (`a-z`, `A-Z`, `0-9`).

### Why Base62?

* Guarantees shortest possible identifiers
* No collisions, no retries
* Perfect for high-scale systems
* Improved readability & shareability

---

## 2. Caching Strategy (Cache-Aside Pattern)

To ensure ultra-fast redirects, the redirect endpoint follows a **cache-aside** pattern:

1. **Query Redis** for the URL mapping
2. On **cache miss**, fetch from SQLite
3. **Write back to Redis** with a TTL

### Benefits

* Protects database from heavy traffic
* Ensures hot URLs remain in memory
* Reduces latency dramatically

---

## 3. Rate Limiting (Sliding Window Algorithm)

To prevent abuse, overload, or DDoS-like patterns, the API implements a **Redis-based sliding window limiter**.

* More accurate than fixed windows (no burst issues)
* Limits enforced per-client using `x-forwarded-for`
* Strict limits applied to `POST /shorten` (write protection)

---

## 4. Asynchronous Analytics (Write-Behind)

Click analytics are handled **off the request path**, ensuring redirects remain fast.

* Real-time counters stored in Redis (`INCR`)
* Cron-triggered worker periodically syncs values to SQLite
* Batch updates reduce DB locking and I/O overhead

---

# 🛠 Tech Stack

* **Runtime:** Next.js
* **Database:** SQLite (SQLite Cloud)
* **Cache / Rate Limiting:** Redis (Upstash)
* **Deployment:** Docker

---

#  Getting Started

## Prerequisites

* Node.js 18+
* Redis instance
* SQLite instance
* Docker (optional)

---

## Installation

```bash
git clone https://github.com/your-repo/url-shortener.git
cd url-shortener
npm install
```

---

## Environment Setup

Create a `.env` file with the following:

```
DATABASE_URL=...
REDIS_URL=...
```

---

## Database Initialization

Ensure your SQLite database contains the required schema:

```sql
-- Refer to schema.sql if included in the repository in setup-db
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

### Using Docker

```bash
docker build -t url-shortener .
docker run -p 3000:3000 --env-file .env.local url-shortener
```

---

# 🕒 Operational Notes

## Analytics Sync

A scheduled cron worker (e.g., Vercel Cron, GitHub Actions, or Upstash Scheduler) must hit the `/api/sync` endpoint periodically.

Recommended: **every 1 hour**

---

## Security

* Responses include rate-limit headers such as:
  `X-RateLimit-Limit`, `X-RateLimit-Remaining`
* Analytics sync endpoint is protected using a secret token
* HTTPS is strongly recommended in production

---

