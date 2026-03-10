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

  headers.delete("content-security-policy");
  headers.delete("content-security-policy-report-only");
  headers.delete("x-frame-options");

  return headers;
};

export const proxyToOrigin = async (request, targetPath) => {
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
