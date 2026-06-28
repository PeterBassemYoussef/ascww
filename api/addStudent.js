import { proxyGuardedSchoolSubmissionRequest } from './_schoolSubmissionGuard.js';

export default async function handler(req, res) {
  await proxyGuardedSchoolSubmissionRequest(req, res, '/addStudent');
}
