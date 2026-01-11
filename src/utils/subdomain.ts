/**
 * Extract subdomain from current hostname
 * For admin app, REQUIRE the "admin" prefix for security
 * Examples:
 * - admin.spice.localhost:5175 → spice ✅
 * - admin.restaurant.patlinks.com → restaurant ✅
 * - spice.localhost:5175 → ERROR (missing admin prefix) ❌
 * - localhost:5175 → null
 */
export function extractSubdomain(): string | null {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // Handle admin.subdomain.localhost (e.g., admin.spice.localhost)
  if (parts.length === 3 && parts[2] === 'localhost') {
    if (parts[0] === 'admin') {
      return parts[1]; // Return "spice" from "admin.spice.localhost" ✅
    } else {
      // Missing "admin" prefix - this is a security issue!
      console.error('⚠️ Admin app must be accessed via admin.{restaurant}.localhost');
      throw new Error('Invalid URL: Admin app requires "admin" prefix (e.g., admin.spice.localhost)');
    }
  }

  // Handle subdomain.localhost (REJECT - missing admin prefix)
  if (parts.length === 2 && parts[1] === 'localhost') {
    console.error('⚠️ Admin app accessed without "admin" prefix:', hostname);
    throw new Error('Invalid URL: Admin app requires "admin" prefix (e.g., admin.spice.localhost)');
  }

  // Handle admin.subdomain.domain.com (production)
  if (parts.length >= 4) {
    if (parts[0] === 'admin') {
      return parts[1]; // Return "restaurant" from "admin.restaurant.yourdomain.com" ✅
    } else {
      throw new Error('Invalid URL: Admin app requires "admin" prefix');
    }
  }

  // Handle subdomain.domain.com (production - REJECT)
  if (parts.length === 3) {
    console.error('⚠️ Admin app accessed without "admin" prefix:', hostname);
    throw new Error('Invalid URL: Admin app requires "admin" prefix');
  }

  // No subdomain (localhost only - allow for development)
  if (hostname === 'localhost') {
    return null; // Allow plain localhost for testing
  }

  throw new Error('Invalid hostname for admin app');
}

/**
 * Validate that current URL has proper admin prefix
 * Throws error if accessed without "admin" subdomain
 */
export function validateAdminUrl(): void {
  try {
    extractSubdomain();
  } catch (error) {
    // Show user-friendly error page
    throw error;
  }
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
