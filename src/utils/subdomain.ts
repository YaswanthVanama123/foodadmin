/**
 * Extract subdomain from current hostname
 * Examples:
 * - spice.localhost:5175 → spice
 * - restaurant.patlinks.com → restaurant
 * - localhost:5175 → null
 */
export function extractSubdomain(): string | null {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // Handle subdomain.localhost
  if (parts.length === 2 && parts[1] === 'localhost') {
    return parts[0];
  }

  // Handle subdomain.domain.com
  if (parts.length >= 3) {
    return parts[0];
  }

  // No subdomain
  return null;
}

/**
 * Get restaurant ID by subdomain from the backend
 */
export async function getRestaurantIdBySubdomain(subdomain: string): Promise<string | null> {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/public/restaurants/by-subdomain/${subdomain}`;
    console.log('[Subdomain] Fetching restaurant from:', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[Subdomain] Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Subdomain] Error response:', errorData);
      return null;
    }

    const data = await response.json();
    console.log('[Subdomain] Success response:', data);
    return data.data?.restaurantId || null;
  } catch (error) {
    console.error('Error fetching restaurant by subdomain:', error);
    return null;
  }
}
