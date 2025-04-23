// eslint-disable-next-line import/no-unresolved
import http from 'k6/http';
// eslint-disable-next-line import/no-unresolved
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1s', target: 3500 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
  },
};

export default function () {
  const res = http.get('http://localhost:3000/productId/XXX719449-39-39');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(0.01);
}
