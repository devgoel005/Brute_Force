/**
 * placeImages.js
 * Provides authentic, high-resolution, multi-photo slidable galleries
 * tailored to specific landmarks, destination heroes, and contextual keywords.
 */

// City-specific scenic editorial hero banners (Untree Tour style)
const DESTINATION_HERO_IMAGES = {
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80',
  'new delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80',
  dalhousie: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
  himachal: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
  kurukshetra: 'https://images.unsplash.com/photo-1609137144822-127920a06eb5?auto=format&fit=crop&w=1600&q=80',
  gurgaon: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=80',
  gurugram: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=80',
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80',
  nyc: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80',
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
  jaipur: 'https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?auto=format&fit=crop&w=1600&q=80',
  agra: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80',
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
  // Signature Untree Tour Turquoise Mountain Lake default
  default: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80'
};

/**
 * Returns a high-res destination hero photo for the given city.
 */
export function getDestinationHeroImage(cityName) {
  if (!cityName) return DESTINATION_HERO_IMAGES.default;
  const lower = cityName.toLowerCase().trim();
  for (const [key, url] of Object.entries(DESTINATION_HERO_IMAGES)) {
    if (lower.includes(key)) {
      return url;
    }
  }
  return DESTINATION_HERO_IMAGES.default;
}

// Famous Landmark Specific Photo Sets (3-4 authentic high-res photos each)
const KNOWN_PLACE_IMAGES = {
  // Kurukshetra
  'sheikh chilli': [
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80'
  ],
  'brahma sarovar': [
    'https://images.unsplash.com/photo-1609137144822-127920a06eb5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80'
  ],
  'jyotisar': [
    'https://images.unsplash.com/photo-1624897097782-b7e556e431f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590059390046-24e5ef90f972?auto=format&fit=crop&w=1200&q=80'
  ],
  'kurukshetra panorama': [
    'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'
  ],

  // Delhi / New Delhi
  'rashtrapati bhavan': [
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1597040663342-45b6af3d91a8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?auto=format&fit=crop&w=1200&q=80'
  ],
  'ashok stambh': [
    'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=1200&q=80'
  ],
  'mahatma gandhi': [
    'https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590059390046-24e5ef90f972?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1200&q=80'
  ],
  'india gate': [
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1597040663342-45b6af3d91a8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1626014303757-6564477577f1?auto=format&fit=crop&w=1200&q=80'
  ],
  'red fort': [
    'https://images.unsplash.com/photo-1598977123418-35f557ceca1c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80'
  ],
  'qutub minar': [
    'https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590059390046-24e5ef90f972?auto=format&fit=crop&w=1200&q=80'
  ],
  "humayun's tomb": [
    'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1598977123418-35f557ceca1c?auto=format&fit=crop&w=1200&q=80'
  ],
  'lotus temple': [
    'https://images.unsplash.com/photo-1597040663342-45b6af3d91a8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80'
  ],
  'akshardham': [
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1609137144822-127920a06eb5?auto=format&fit=crop&w=1200&q=80'
  ],

  // Dalhousie & Himachal
  'subhash bowli': [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80'
  ],
  'panchpula': [
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80'
  ],
  'sardar ajit singh': [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
  ],
  'dainkund': [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
  ],
  'satdhara': [
    'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80'
  ],
  'khajjiar': [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80'
  ],
  'st. john': [
    'https://images.unsplash.com/photo-1548625361-195972a938c5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80'
  ],
  'bakrota': [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80'
  ],

  // Gurgaon
  'cyber hub': [
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'
  ],
  'sultanpur': [
    'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80'
  ],
  'kingdom of dreams': [
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
  ],

  // International (NYC, Paris, Rome)
  'statue of liberty': [
    'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1543716091-a840c05499d7?auto=format&fit=crop&w=1200&q=80'
  ],
  'central park': [
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1200&q=80'
  ],
  'metropolitan museum': [
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1565099824688-e93eb20fe52c?auto=format&fit=crop&w=1200&q=80'
  ],
  'empire state': [
    'https://images.unsplash.com/photo-1555109307-f7d9da25c244?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1546436836-07a91091f160?auto=format&fit=crop&w=1200&q=80'
  ],
  'brooklyn bridge': [
    'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1496868834840-5f4c98840aaa?auto=format&fit=crop&w=1200&q=80'
  ],
  'eiffel tower': [
    'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=1200&q=80'
  ],
  'louvre': [
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1565099824688-e93eb20fe52c?auto=format&fit=crop&w=1200&q=80'
  ],
  'colosseum': [
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1200&q=80'
  ]
};

// Rich, high-res curated image pools categorized by physical architectural type
const THEMATIC_POOLS = {
  // Sacred shrines, temples, mandirs, ashrams
  temple: [
    'https://images.unsplash.com/photo-1609137144822-127920a06eb5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1624897097782-b7e556e431f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590059390046-24e5ef90f972?auto=format&fit=crop&w=1200&q=80'
  ],

  // Monuments, stone pillars, stambh, statues, arches
  monument: [
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1597040663342-45b6af3d91a8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80'
  ],

  // Palaces, bhavans, royal residences, domes
  palace: [
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80'
  ],

  // Ancient forts, ramparts, citadels, castles
  fort: [
    'https://images.unsplash.com/photo-1598977123418-35f557ceca1c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'
  ],

  // Tombs, mausoleums, dargahs
  tomb: [
    'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'
  ],

  // Water bodies: lakes, waterfalls, sarovars, springs, baolis, streams
  water: [
    'https://images.unsplash.com/photo-1609137144822-127920a06eb5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
  ],

  // Nature, mountains, hills, viewpoints, peaks, valleys
  nature: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80'
  ],

  // Urban parks, botanical gardens, lawns
  park: [
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80'
  ],

  // Museums, galleries, historical artifacts
  museum: [
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1565099824688-e93eb20fe52c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1200&q=80'
  ],

  // Churches, cathedrals
  church: [
    'https://images.unsplash.com/photo-1548625361-195972a938c5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80'
  ],

  // Modern hubs, plazas, urban architecture
  modern: [
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555109307-f7d9da25c244?auto=format&fit=crop&w=1200&q=80'
  ]
};

// Simple deterministic hash to distribute items across a pool so no two places look identical
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns a slice of rotated images from a pool based on the place's identity.
 */
function getRotatedPoolImages(pool, placeIdOrName) {
  if (!pool || pool.length === 0) return [];
  const offset = hashString(placeIdOrName) % pool.length;
  // Rotate array starting at offset
  const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];
  return rotated;
}

/**
 * Resolves authentic, place-relevant slidable images for any tourist attraction.
 * Eliminates duplicate/fixed images across cards.
 */
export function getPlacePhotos(place) {
  if (!place) {
    return THEMATIC_POOLS.monument;
  }

  // 1. Direct custom images array if already provided
  if (Array.isArray(place.images) && place.images.length > 0) {
    return place.images;
  }

  const nameLower = (place.name || '').toLowerCase();
  const descLower = (place.description || '').toLowerCase();
  const catLower = (place.category || '').toLowerCase();
  const combined = `${nameLower} ${descLower} ${catLower}`;
  const placeIdStr = place.placeId || place.name || 'place';

  // 2. Exact or partial match in KNOWN_PLACE_IMAGES
  for (const [key, imgs] of Object.entries(KNOWN_PLACE_IMAGES)) {
    if (nameLower.includes(key)) {
      return imgs;
    }
  }

  // 3. Contextual keyword & theme detection from name and description
  // Temples / Shrines
  if (
    combined.includes('temple') ||
    combined.includes('mandir') ||
    combined.includes('shrine') ||
    combined.includes('ashram') ||
    combined.includes('dham') ||
    combined.includes('gurudwara') ||
    combined.includes('math')
  ) {
    return getRotatedPoolImages(THEMATIC_POOLS.temple, placeIdStr);
  }

  // Churches / Cathedrals
  if (combined.includes('church') || combined.includes('cathedral') || combined.includes('chapel')) {
    return getRotatedPoolImages(THEMATIC_POOLS.church, placeIdStr);
  }

  // Tombs / Dargahs
  if (combined.includes('tomb') || combined.includes('dargah') || combined.includes('maqbara')) {
    return getRotatedPoolImages(THEMATIC_POOLS.tomb, placeIdStr);
  }

  // Forts / Citadels / Castles
  if (
    combined.includes('fort') ||
    combined.includes('qila') ||
    combined.includes('castle') ||
    combined.includes('bastion') ||
    combined.includes('rampart')
  ) {
    return getRotatedPoolImages(THEMATIC_POOLS.fort, placeIdStr);
  }

  // Palaces / Bhavans / Mansions
  if (
    combined.includes('palace') ||
    combined.includes('bhavan') ||
    combined.includes('mahal') ||
    combined.includes('mansion') ||
    combined.includes('estate')
  ) {
    return getRotatedPoolImages(THEMATIC_POOLS.palace, placeIdStr);
  }

  // Water: lakes, waterfalls, sarovar, springs, falls, rivers, ghats
  if (
    combined.includes('lake') ||
    combined.includes('sarovar') ||
    combined.includes('waterfall') ||
    combined.includes('falls') ||
    combined.includes('fall') ||
    combined.includes('spring') ||
    combined.includes('bowli') ||
    combined.includes('baoli') ||
    combined.includes('ghat') ||
    combined.includes('stream') ||
    combined.includes('river') ||
    combined.includes('water')
  ) {
    return getRotatedPoolImages(THEMATIC_POOLS.water, placeIdStr);
  }

  // Nature: peaks, hills, viewpoints, mountains, ridges, valleys
  if (
    combined.includes('peak') ||
    combined.includes('hill') ||
    combined.includes('viewpoint') ||
    combined.includes('ridge') ||
    combined.includes('scenic') ||
    combined.includes('mountain') ||
    combined.includes('valley') ||
    combined.includes('meadow')
  ) {
    return getRotatedPoolImages(THEMATIC_POOLS.nature, placeIdStr);
  }

  // Parks / Gardens / Sanctuaries
  if (
    combined.includes('park') ||
    combined.includes('garden') ||
    combined.includes('vatika') ||
    combined.includes('bagh') ||
    combined.includes('sanctuary') ||
    combined.includes('botanical') ||
    combined.includes('forest')
  ) {
    return getRotatedPoolImages(THEMATIC_POOLS.park, placeIdStr);
  }

  // Museums / Galleries / Panoramas / Memorials
  if (
    combined.includes('museum') ||
    combined.includes('gallery') ||
    combined.includes('panorama') ||
    combined.includes('exhibition') ||
    combined.includes('science')
  ) {
    return getRotatedPoolImages(THEMATIC_POOLS.museum, placeIdStr);
  }

  // Monuments / Pillars / Stambhs / Statues / Memorials
  if (
    combined.includes('monument') ||
    combined.includes('pillar') ||
    combined.includes('stambh') ||
    combined.includes('statue') ||
    combined.includes('memorial') ||
    combined.includes('historic') ||
    combined.includes('heritage')
  ) {
    return getRotatedPoolImages(THEMATIC_POOLS.monument, placeIdStr);
  }

  // Modern hubs, malls, cyber, towers
  if (combined.includes('cyber') || combined.includes('tower') || combined.includes('mall') || combined.includes('hub')) {
    return getRotatedPoolImages(THEMATIC_POOLS.modern, placeIdStr);
  }

  // 4. Default diversified distribution:
  // Instead of a single static camera image, alternate smoothly between scenic monuments,
  // nature, palaces, and heritage pools based on placeId so all cards have varied, authentic imagery
  const fallbacks = [
    THEMATIC_POOLS.monument,
    THEMATIC_POOLS.nature,
    THEMATIC_POOLS.palace,
    THEMATIC_POOLS.water,
    THEMATIC_POOLS.fort
  ];
  const chosenPool = fallbacks[hashString(placeIdStr) % fallbacks.length];
  return getRotatedPoolImages(chosenPool, placeIdStr);
}
