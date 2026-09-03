async function test() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@velanx.com', password: 'Password@123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("Logged in successfully. Token length:", token ? token.length : 'undefined');

    const res = await fetch('http://localhost:5000/api/analytics/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Dashboard Summary:", JSON.stringify(await res.json(), null, 2));

    const revRes = await fetch('http://localhost:5000/api/analytics/revenue', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Revenue Summary:", JSON.stringify(await revRes.json(), null, 2));
  } catch (err) {
    console.error("API Error:", err);
  }
}
test();
