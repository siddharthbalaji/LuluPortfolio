/**
 * Injects on-the-fly Cloudinary transforms so we serve right-sized,
 * auto-format thumbnails instead of full-resolution PNGs in the grid.
 * Safe no-op for any URL that isn't a standard Cloudinary /upload/ path.
 */
function transform(url: string, t: string): string {
  const marker = "/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  const after = url.slice(i + marker.length);
  // avoid stacking a transform if one is already present right after /upload/
  if (/^(q_|f_|w_|h_|c_)/.test(after)) {
    // already has q_auto,f_auto etc — prepend width only
    return url.replace(marker, `${marker}w_700/`);
  }
  return url.replace(marker, `${marker}${t}/`);
}

export const thumb = (url: string) =>
  transform(url, "w_700,q_auto,f_auto,c_limit");

export const full = (url: string) =>
  transform(url, "w_1600,q_auto,f_auto,c_limit");

export const poster = (url: string) =>
  // first frame poster for a video
  url.replace("/video/upload/", "/video/upload/so_0,w_700,q_auto/").replace(/\.mp4$/, ".jpg");
