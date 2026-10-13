import type { Request } from 'express';

/**
 * The API's own public origin, for building absolute links back to it (e.g.
 * proxied images). API_PUBLIC_URL wins when set; otherwise it is derived from
 * the request, honouring the X-Forwarded-* headers set by the reverse proxy.
 */
export function publicBaseUrl(req: Request): string {
  const configured = process.env.API_PUBLIC_URL;
  if (configured) return configured.replace(/\/+$/, '');

  const header = (name: string) => {
    const value = req.headers[name];
    return (Array.isArray(value) ? value[0] : value)?.split(',')[0].trim();
  };
  const proto = header('x-forwarded-proto') ?? req.protocol;
  const host = header('x-forwarded-host') ?? header('host');
  return `${proto}://${host}`;
}
