const assert = require('assert');
const { login } = require('../controllers/authController');

(async () => {
  global.__dbConnected = false;

  let statusCode = 200;
  let payload = null;

  const req = {
    body: {
      email: 'admin@ebi-services.com',
      password: 'password123',
    },
  };

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      payload = data;
      return this;
    },
  };

  await login(req, res);

  assert.strictEqual(statusCode, 200, 'fallback login should succeed when the database is offline');
  assert.ok(payload && payload.access_token, 'fallback login should return a token');
  assert.strictEqual(payload.email, 'admin@ebi-services.com');
  console.log('auth fallback test passed');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
