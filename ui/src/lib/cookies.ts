export interface CookiesOpts {
  domain?: string | undefined;
  encode?(value: string): string;
  expires?: Date | undefined;
  httpOnly?: boolean | undefined;
  maxAge?: number | undefined;
  partitioned?: boolean | undefined;
  path?: string | undefined;
  sameSite?: true | false | "lax" | "strict" | "none" | undefined;
  secure?: boolean | undefined;
}

export type BrowserCookieOpts = {
  days?: number;
  sameSite?: "Lax" | "Strict" | "None";
  maxAge?: number;
  secure?: boolean;
  domain?: string;
  path?: string;
};

export interface Cookie {
  key: string;
  value: string;
  opts: CookiesOpts;
}

export class CookieParser {
  static parser(plainCookies: string | string[]) {
    const cookiesStr = Array.isArray(plainCookies)
      ? plainCookies
      : [plainCookies];
    const cookies: Array<Cookie> = [];

    cookiesStr.forEach((cookieStr) => {
      const parts = cookieStr.split(";").map((part) => part.trim());
      const [key_value, ...options] = parts;
      const [key, value] = key_value.split("=");

      const cookieOptions: CookiesOpts = { path: "/" };

      options.forEach((option) => {
        if (option.toLowerCase() === "httponly") cookieOptions.httpOnly = true;
        if (option.toLowerCase() === "secure") cookieOptions.secure = true;
        if (option.toLowerCase().startsWith("samesite="))
          cookieOptions.sameSite = option.split("=")[1] as
            | "lax"
            | "strict"
            | "none";
        if (option.toLowerCase().startsWith("max-age="))
          cookieOptions.maxAge = parseInt(option.split("=")[1], 10);
        if (option.toLowerCase().startsWith("expires"))
          cookieOptions.expires = new Date(option.split("=")[1]);
      });

      cookies.push({
        key: key.trim(),
        value: value.trim(),
        opts: cookieOptions,
      });
    });

    return cookies;
  }

  static fromEntries(cookies: Cookie[]) {
    const obj: Record<string, Cookie> = {};
    cookies.forEach((cookie) => {
      obj[cookie.key] = cookie;
    });
    return obj;
  }
}

export const getCookies = () => {
  if (typeof document === "undefined") return {};

  const cookies: Record<string, string> = {};

  if (document.cookie) {
    document.cookie.split(";").forEach((cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key && value) {
        cookies[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
  }

  return cookies;
};

export const getCookie = (key: string) => {
  const cookies = getCookies();
  return cookies[key];
};

export const setCookie = (
  name: string,
  value: string,
  options: BrowserCookieOpts = {}
) => {
  if (typeof document === "undefined") return;

  const {
    days = 1,
    maxAge,
    sameSite = "Lax",
    secure = false,
    domain,
    path = "/",
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (days && !maxAge) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (maxAge) {
    cookieString += `; max-age=${maxAge}`;
  }

  cookieString += `; path=${path}`;

  cookieString += `; SameSite=${sameSite}`;

  if (secure) {
    cookieString += `; Secure`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  document.cookie = cookieString;
};

export const hasCookie = (key: string) => {
  if (!key) return false;
  const cookies = getCookies();
  return Object.prototype.hasOwnProperty.call(cookies, key);
};

export const deleteCookie = (key: string, opts?: BrowserCookieOpts) => {
  setCookie(key, "", { ...opts, maxAge: -1, days: -1 });
};

export const cookie = {
  getCookies,
  getCookie,
  setCookie,
  hasCookie,
  deleteCookie,
};
