import http from "k6/http";
import { check } from "k6";

export const options = {
  duration: "10s",
  vus: 10,
  summaryTrendStats: ["med", "p(99)"],
};

export default function () {
  const url = "http://localhost:7800/api/upvote";

  const payload = JSON.stringify({
    // user can upvote only once and if the tests are run again, K6 might use
    // the same VU and ITER values, so we need to add a random number to the user
    user: `test_user_${__VU}_${__ITER}_${Math.random().toString(36).substring(7)}`,
    id: 1,
    type: 'question',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = http.post(url, payload, params);
    const responseBody = JSON.parse(response.body);

  check(responseBody, {
    'is status 201': (r) => r.status === 201,
  });
}