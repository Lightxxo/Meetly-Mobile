export default function replaceLocalhost(thumbnail: string, ipAddress: string) {
  if (!thumbnail || !ipAddress) return null;

  return thumbnail.replace("localhost", ipAddress);
}
