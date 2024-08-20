export const getBlobDuration = (blob: Blob | string) => {
  const tempVideoEl = document.createElement('video');

  const durationP = new Promise<number>((resolve, reject) => {
    tempVideoEl.addEventListener('loadedmetadata', () => {
      // Chrome bug: https://bugs.chromium.org/p/chromium/issues/detail?id=642012
      if (tempVideoEl.duration === Infinity) {
        tempVideoEl.currentTime = Number.MAX_SAFE_INTEGER;
        tempVideoEl.ontimeupdate = () => {
          tempVideoEl.ontimeupdate = null;
          resolve(tempVideoEl.duration);
          tempVideoEl.currentTime = 0;
        };
      }
      // Normal behavior
      else resolve(tempVideoEl.duration);
    });
    tempVideoEl.onerror = (event: Event | string) =>
      reject(typeof event === 'string' ? event : event.target);
  });

  tempVideoEl.src = typeof blob === 'string' ? blob : window.URL.createObjectURL(blob);

  return durationP;
};
