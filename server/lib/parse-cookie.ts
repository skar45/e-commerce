const parseCookie = (
  cookie: string | undefined,
  type: string
): string | undefined => {
  if (!cookie) return undefined;
  const cookieRe = new RegExp(`(?<=(?<![^ ;])${type}=)[^;]*`, 'g');
  const decodeCookie = decodeURIComponent(cookie);
  const getCookie = decodeCookie.match(cookieRe)?.[0];
  return getCookie ? getCookie : undefined;
};

export default parseCookie;
