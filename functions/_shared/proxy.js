const DEFAULT_ORIGIN = "https://neuronawireless.com";

const copyRequestHeaders = (request) => {
  const headers = new Headers(request.headers);

  headers.delete("host");
  headers.delete("cf-connecting-ip");
  headers.delete("x-forwarded-proto");
  headers.delete("x-real-ip");

  return headers;
};

const copyResponseHeaders = (response) => {
  const headers = new Headers(response.headers);

  // Headers causing CORS issues
  headers.delete("content-security-policy");
  headers.delete("content-security-policy-report-only");
  headers.delete("x-frame-options");

  // Rewrite cookie domains so the browser accepts them on neuronawireless.pages.dev
  const setCookies = response.headers.getSetCookie();
  if (setCookies && setCookies.length > 0) {
    headers.delete("set-cookie"); // Remove the original ones
    setCookies.forEach(cookie => {
      // Strip out the Domain attribute if it specifies neuronawireless.com
      const rewrittenCookie = cookie.replace(/Domain=(?:\.)?neuronawireless\.com;? ?/gi, '');
      headers.append("set-cookie", rewrittenCookie);
    });
  }

  return headers;
};

export const proxyToOrigin = async (request, targetPath) => {
  if (targetPath.length > 1 && targetPath.endsWith("/")) {
    targetPath = targetPath.slice(0, -1);
  }
  const targetURL = new URL(targetPath, DEFAULT_ORIGIN);
  const init = {
    method: request.method,
    headers: copyRequestHeaders(request),
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(targetURL, init);
  const headers = copyResponseHeaders(upstream);

  if (headers.has("location")) {
    const location = headers.get("location");
    if (location.startsWith(DEFAULT_ORIGIN + "/platform")) {
      headers.set("location", location.replace(DEFAULT_ORIGIN + "/platform", ""));
    } else if (location.startsWith(DEFAULT_ORIGIN)) {
      headers.set("location", location.replace(DEFAULT_ORIGIN, ""));
    }
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
};
