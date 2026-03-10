import { proxyToOrigin } from "../_shared/proxy.js";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  return proxyToOrigin(context.request, `/platform${url.pathname}${url.search}`);
}
