// Tests the Cloudflare Access token verification against a local JWKS (valid, forged, expired, wrong audience ...).
// Run: pnpm test:access
import http from 'node:http';
import { generateKeyPair, exportJWK, SignJWT } from 'jose';
import { verifyAccess, AccessError } from '../src/lib/server/access.ts';

const { publicKey, privateKey } = await generateKeyPair('RS256');
const jwk = { ...(await exportJWK(publicKey)), kid: 'k1', alg: 'RS256', use: 'sig' };
const server = http.createServer((req, res) => {
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({ keys: [jwk], public_cert: {}, public_certs: [] }));
}).listen(0);
await new Promise(r => server.once('listening', r));
const team = `http://localhost:${server.address().port}`;
const sign = (claims = {}, { iss = team, aud = 'AUD1', exp = '5m' } = {}) =>
  new SignJWT({ email: 'Tante@Example.com', ...claims }).setProtectedHeader({ alg: 'RS256', kid: 'k1' })
    .setIssuer(iss).setAudience(aud).setIssuedAt().setExpirationTime(exp).sign(privateKey);
const req = (t) => new Request('http://x/admin', { headers: t ? { 'cf-access-jwt-assertion': t } : {} });
const env = { ACCESS_TEAM_DOMAIN: team, ACCESS_AUD: 'AUD1', ADMIN_EMAILS: 'tante@example.com' };
async function expect(name, fn, want) {
  try { const r = await fn(); console.log(want === 'ok' ? 'PASS' : 'FAIL', name, '->', r); }
  catch (e) { const got = e instanceof AccessError ? e.status : 'other:' + e.message; console.log(String(got) === want ? 'PASS' : 'FAIL', name, '->', got); }
}
await expect('valid token', async () => verifyAccess(req(await sign()), env), 'ok');
await expect('no token', async () => verifyAccess(req(null), env), '401');
await expect('wrong audience', async () => verifyAccess(req(await sign({}, { aud: 'EVIL' })), env), '403');
await expect('wrong issuer', async () => verifyAccess(req(await sign({}, { iss: 'https://evil.cloudflareaccess.com' })), env), '403');
await expect('expired', async () => verifyAccess(req(await sign({}, { exp: '-1m' })), env), '403');
await expect('garbage token', async () => verifyAccess(req('abc.def.ghi'), env), '403');
const evil = await generateKeyPair('RS256');
const forged = await new SignJWT({ email: 'tante@example.com' }).setProtectedHeader({ alg: 'RS256', kid: 'k1' }).setIssuer(team).setAudience('AUD1').setExpirationTime('5m').sign(evil.privateKey);
await expect('forged signature', async () => verifyAccess(req(forged), env), '403');
await expect('email not allow-listed', async () => verifyAccess(req(await sign({ email: 'x@y.de' })), env), '403');
await expect('no email claim', async () => verifyAccess(req(await sign({ email: undefined })), env), '403');
await expect('not configured (fail closed)', async () => verifyAccess(req(await sign()), {}), '503');
server.close();
