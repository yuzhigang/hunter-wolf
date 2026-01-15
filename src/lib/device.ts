let isMobileCache: boolean | null = null;

export function isMobile(): boolean {
  if (isMobileCache !== null) {
    return isMobileCache;
  }

  // Check for touch device
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Check screen size
  const isSmallScreen = window.innerWidth <= 768;

  // Check user agent
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // Consider mobile if touch OR small screen OR mobile UA
  isMobileCache = hasTouchScreen || isSmallScreen || isMobileUA;

  return isMobileCache;
}

export function isDesktop(): boolean {
  return !isMobile();
}

export function resetDeviceCache(): void {
  isMobileCache = null;
}
