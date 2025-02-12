import http from "k6/http";
import { check } from "k6";

export const options = {
  duration: "10s",
  vus: 10,
  summaryTrendStats: ["med", "p(99)"],
};

export default function () {
  const url = "http://localhost:7800/api/ask-question";

  const payload = JSON.stringify({
    user: `test_user_${__VU}_${__ITER}`,
    course: 1,
    question: `Test question from k6: ${__VU}_${__ITER}`,
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