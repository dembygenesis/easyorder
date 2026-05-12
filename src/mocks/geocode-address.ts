import type { Coordinates } from '../types/index.js';
import { delay } from './delay.js';

const COORDINATES: Record<string, Coordinates> = {
  'new york, ny': { latitude: 40.7128, longitude: -74.006 },
  'new york city, ny': { latitude: 40.7128, longitude: -74.006 },
  'boston, ma': { latitude: 42.3601, longitude: -71.0589 },
  'philadelphia, pa': { latitude: 39.9526, longitude: -75.1652 },
  'baltimore, md': { latitude: 39.2904, longitude: -76.6122 },
  'washington, dc': { latitude: 38.9072, longitude: -77.0369 },

  'miami, fl': { latitude: 25.7617, longitude: -80.1918 },
  'orlando, fl': { latitude: 28.5383, longitude: -81.3792 },
  'atlanta, ga': { latitude: 33.749, longitude: -84.388 },
  'charlotte, nc': { latitude: 35.2271, longitude: -80.8431 },

  'chicago, il': { latitude: 41.8781, longitude: -87.6298 },
  'detroit, mi': { latitude: 42.3314, longitude: -83.0458 },
  'minneapolis, mn': { latitude: 44.9778, longitude: -93.265 },
  'st. louis, mo': { latitude: 38.627, longitude: -90.1994 },
  'cleveland, oh': { latitude: 41.4993, longitude: -81.6944 },

  'dallas, tx': { latitude: 32.7767, longitude: -96.797 },
  'houston, tx': { latitude: 29.7604, longitude: -95.3698 },
  'austin, tx': { latitude: 30.2672, longitude: -97.7431 },
  'phoenix, az': { latitude: 33.4484, longitude: -112.074 },
  'las vegas, nv': { latitude: 36.1699, longitude: -115.1398 },

  'los angeles, ca': { latitude: 34.0522, longitude: -118.2437 },
  'san francisco, ca': { latitude: 37.7749, longitude: -122.4194 },
  'san diego, ca': { latitude: 32.7157, longitude: -117.1611 },
  'seattle, wa': { latitude: 47.6062, longitude: -122.3321 },
  'portland, or': { latitude: 45.5051, longitude: -122.675 },

  'denver, co': { latitude: 39.7392, longitude: -104.9903 },
  'salt lake city, ut': { latitude: 40.7608, longitude: -111.891 },
};

export const geocodeAddress = async (address: string): Promise<Coordinates> => {
  console.log(`POST https://api.easygeocode.com/geocode`, { address });

  await delay(100);

  const [, city, state] = /([A-Za-z\s]+),\s*([A-Z]{2})/.exec(address) ?? [];

  if (city === undefined || state === undefined) {
    console.error(`422 https://api.easygeo.com/geocode`, { address });
    throw new Error(`Failed to extract city and state from "${address}"`);
  }

  const coordinates = COORDINATES[`${city.toLowerCase()}, ${state.toLowerCase()}`];

  if (coordinates === undefined) {
    console.error(`404 https://api.easygeo.com/geocode`, { address });
    throw new Error(`Failed to geocode "${address}"`);
  }

  console.log(`200 https://api.easygeo.com/geocode`, coordinates);

  return coordinates;
};
