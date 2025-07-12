export const generateEmbedUrl = (url: string) => {
  if (!url.includes('embed')) {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}?rel=0&controls=1`;
    }
    return url;
  }

  return url
}