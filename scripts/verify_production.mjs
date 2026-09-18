import https from "node:https";

const BASE_URL = process.env.TARGET_URL || "https://partsly.in";

async function request(path, options = {}) {
  const url = new URL(path, BASE_URL);
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        let json = null;
        try { json = JSON.parse(data); } catch {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json || data,
        });
      });
    });

    req.on("error", reject);
    if (options.body) {
      req.write(typeof options.body === "string" ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log(`=== PARTSLY PRODUCTION VERIFICATION SUITE ===`);
  console.log(`Target: ${BASE_URL}\n`);

  const results = [];

  // 1. Health & Database
  try {
    const res = await request("/api/ready");
    const ok = res.status === 200 && res.data?.database === "connected";
    results.push({ name: "1. Production Database Ready (/api/ready)", pass: ok, details: `HTTP ${res.status}: ${JSON.stringify(res.data)}` });
  } catch (err) {
    results.push({ name: "1. Production Database Ready (/api/ready)", pass: false, details: err.message });
  }

  // 2. Unauthenticated Project Upload Protection
  try {
    const res = await request("/api/projects/upload", { method: "POST" });
    const ok = res.status === 401;
    results.push({ name: "2. Project Upload Auth Enforcement (/api/projects/upload)", pass: ok, details: `HTTP ${res.status} (Expected 401)` });
  } catch (err) {
    results.push({ name: "2. Project Upload Auth Enforcement", pass: false, details: err.message });
  }

  // 3. Unauthenticated Project BOM Analyze Protection
  try {
    const res = await request("/api/projects/analyze", {
      method: "POST",
      body: { parts: ["ESP32"] },
    });
    const ok = res.status === 401;
    results.push({ name: "3. BOM Analyze Auth Enforcement (/api/projects/analyze)", pass: ok, details: `HTTP ${res.status} (Expected 401)` });
  } catch (err) {
    results.push({ name: "3. BOM Analyze Auth Enforcement", pass: false, details: err.message });
  }

  // 4. Unauthenticated Cart IDOR / Protection
  try {
    const res = await request("/api/cart");
    const ok = res.status === 401;
    results.push({ name: "4. Cart Unauthorized Rejection (/api/cart)", pass: ok, details: `HTTP ${res.status} (Expected 401)` });
  } catch (err) {
    results.push({ name: "4. Cart Unauthorized Rejection", pass: false, details: err.message });
  }

  // 5. Tampered Session Cookie in Edge Middleware
  try {
    const fakeToken = "eyJ1c2VySWQiOiJmYWtlIn0.invalidsignature12345";
    const res = await request("/api/cart", {
      headers: { Cookie: `partsly_session=${fakeToken}` },
    });
    // Should be rejected with 401 by middleware or auth
    const ok = res.status === 401;
    results.push({ name: "5. HMAC-SHA256 Tampered Token Rejection (Middleware)", pass: ok, details: `HTTP ${res.status} (Expected 401)` });
  } catch (err) {
    results.push({ name: "5. HMAC-SHA256 Tampered Token Rejection", pass: false, details: err.message });
  }

  // 6. Login Rate Limiting & Account Enumeration Prevention
  try {
    const randUser = `attacker_${Date.now()}@partsly.in`;
    let rateLimited = false;
    let lastStatus = 0;
    for (let i = 0; i < 7; i++) {
      const res = await request("/api/auth/login", {
        method: "POST",
        body: { identifier: randUser, password: "WrongPassword999!" },
      });
      lastStatus = res.status;
      if (res.status === 429) {
        rateLimited = true;
        break;
      }
    }
    results.push({
      name: "6. Brute Force Login Rate Limiting (/api/auth/login)",
      pass: rateLimited,
      details: rateLimited ? `Locked out with HTTP 429 after attempts` : `Last HTTP ${lastStatus} (Expected 429)`
    });
  } catch (err) {
    results.push({ name: "6. Brute Force Login Rate Limiting", pass: false, details: err.message });
  }

  // 7. Legitimate User Signup & Session Generation
  const testPhone = "9" + Math.floor(100000000 + Math.random() * 900000000);
  const testEmail = `audit_${Date.now()}@partsly.test`;
  const testPassword = "SecurePartslyPass!2026";
  let sessionCookie = null;

  try {
    const signupRes = await request("/api/auth/signup", {
      method: "POST",
      body: {
        name: "Security Audit User",
        email: testEmail,
        password: testPassword,
        phone: testPhone,
      },
    });

    const setCookie = signupRes.headers["set-cookie"];
    if (setCookie) {
      sessionCookie = Array.isArray(setCookie) ? setCookie.join("; ") : setCookie;
    }

    const pass = signupRes.status === 201 && signupRes.data?.user?.email === testEmail;
    results.push({
      name: "7. User Signup & Cryptographic Session Creation (/api/auth/signup)",
      pass,
      details: `HTTP ${signupRes.status}, user: ${signupRes.data?.user?.email || "none"}, Cookie: ${Boolean(sessionCookie)}`
    });
  } catch (err) {
    results.push({ name: "7. User Signup", pass: false, details: err.message });
  }

  // 8. Duplicate Phone Protection on Signup
  try {
    const dupRes = await request("/api/auth/signup", {
      method: "POST",
      body: {
        name: "Duplicate Tester",
        email: `another_${Date.now()}@partsly.test`,
        password: testPassword,
        phone: testPhone,
      },
    });

    const pass = dupRes.status === 409;
    results.push({
      name: "8. Duplicate Phone Unique Constraint (/api/auth/signup)",
      pass,
      details: `HTTP ${dupRes.status} (Expected 409 Conflict)`
    });
  } catch (err) {
    results.push({ name: "8. Duplicate Phone Constraint", pass: false, details: err.message });
  }

  // 9. Valid Authenticated Session Request (/api/cart)
  if (sessionCookie) {
    try {
      const cartRes = await request("/api/cart", {
        headers: { Cookie: sessionCookie },
      });
      const pass = cartRes.status === 200 && (cartRes.data?.cart !== undefined || Array.isArray(cartRes.data?.items));
      results.push({
        name: "9. Authenticated Session Web Crypto Validation (/api/cart)",
        pass,
        details: `HTTP ${cartRes.status}, items returned: ${cartRes.data?.cart?.items?.length ?? 0}`
      });
    } catch (err) {
      results.push({ name: "9. Authenticated Session Validation", pass: false, details: err.message });
    }
  }

  // 10. IDOR Cart Item Deletion Protection
  if (sessionCookie) {
    try {
      const fakeCartItemId = "00000000-0000-0000-0000-000000000000";
      const delRes = await request(`/api/cart?id=${fakeCartItemId}`, {
        method: "DELETE",
        headers: { Cookie: sessionCookie },
      });
      // Should return 404 (item not found in user's cart) rather than allowing cross-tenant mutation
      const pass = delRes.status === 404;
      results.push({
        name: "10. Cart Item IDOR Deletion Protection (/api/cart?id=...)",
        pass,
        details: `HTTP ${delRes.status} (Expected 404 for unowned item)`
      });
    } catch (err) {
      results.push({ name: "10. Cart Item IDOR Deletion", pass: false, details: err.message });
    }
  }

  console.log("\n================ TEST SUMMARY ================");
  let passedCount = 0;
  for (const r of results) {
    const statusMark = r.pass ? "✅ PASS" : "❌ FAIL";
    console.log(`${statusMark} | ${r.name}`);
    console.log(`       Details: ${r.details}`);
    if (r.pass) passedCount++;
  }
  console.log(`\nScore: ${passedCount}/${results.length} PASSED`);
}

runTests();
