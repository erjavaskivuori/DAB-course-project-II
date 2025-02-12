import http from "k6/http";
import { check } from "k6";

export const options = {
  duration: "10s",
  vus: 10,
  summaryTrendStats: ["med", "p(99)"],
};

export default function () {
  const response = http.get("http://localhost:7800/api/question?id=1");

  check(response, {
    'is status 200': (r) => r.status === 200,
  });
  }