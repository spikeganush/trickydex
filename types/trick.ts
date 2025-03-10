export interface Trick {
  id: number;
  name: string;
  description: string;
  difficulty: number;
  category: string;
  variations?: string[];
  imageUrl?: string;
}

export type TrickCategory = 'soul_grinds' | 'groove_grinds' | 'special_grinds' | 'air_tricks' | 'spins' | 'flips';

export const trickCategories: Record<TrickCategory, string> = {
  soul_grinds: 'Soul Grinds',
  groove_grinds: 'Groove Grinds',
  special_grinds: 'Special Grinds',
  air_tricks: 'Air Tricks',
  spins: 'Spins',
  flips: 'Flips'
};

export const initialTricks: Trick[] = [
  // Soul Grinds
  {
    id: 1,
    name: 'Soul',
    description: 'A classic grind performed on the soul plate (middle part of the frame) with the foot perpendicular to the direction of travel.',
    difficulty: 3,
    category: 'soul_grinds',
    variations: ['Frontside Soul', 'Backside Soul', 'True Soul']
  },
  {
    id: 2,
    name: 'Makio',
    description: 'A grind performed on the soul plate with the foot parallel to the direction of travel, typically on the inside edge.',
    difficulty: 5,
    category: 'soul_grinds',
    variations: ['Frontside Makio', 'Backside Makio']
  },
  {
    id: 3,
    name: 'Mizou',
    description: 'A grind performed on the soul plate with the foot parallel to the direction of travel, typically on the outside edge.',
    difficulty: 6,
    category: 'soul_grinds',
    variations: ['Frontside Mizou', 'Backside Mizou']
  },
  {
    id: 4,
    name: 'Acid',
    description: 'A grind performed on the outside edge of the frame, with the foot turned outward.',
    difficulty: 5,
    category: 'soul_grinds',
    variations: ['Frontside Acid', 'Backside Acid', 'Citric Acid']
  },
  {
    id: 5,
    name: 'Mistrial',
    description: 'A soul-based grind where the foot is positioned at an angle between a soul and mizou position.',
    difficulty: 6,
    category: 'soul_grinds'
  },
  {
    id: 6,
    name: 'X Grind',
    description: 'A soul-based grind where the legs are crossed in an X formation during the grind.',
    difficulty: 7,
    category: 'soul_grinds'
  },
  {
    id: 7,
    name: 'Sidewalk',
    description: 'A soul-based grind performed on the outside edge of the soul plate.',
    difficulty: 6,
    category: 'soul_grinds'
  },
  {
    id: 8,
    name: 'PStar',
    description: 'A soul-based grind with a specific foot position resembling a star shape.',
    difficulty: 7,
    category: 'soul_grinds'
  },
  
  // Groove Grinds
  {
    id: 9,
    name: 'Royale',
    description: 'A grind performed on the groove between the soul plate and the frame of the skate.',
    difficulty: 4,
    category: 'groove_grinds',
    variations: ['Frontside Royale', 'Backside Royale']
  },
  {
    id: 10,
    name: 'Unity',
    description: 'A grind where both feet are on the same rail or ledge, with one foot in a Makio position and the other in a Mizou position.',
    difficulty: 7,
    category: 'groove_grinds',
    variations: ['Frontside Unity', 'Backside Unity']
  },
  {
    id: 11,
    name: 'Torque',
    description: 'A grind performed on the inside edge of the frame, with the foot turned inward.',
    difficulty: 6,
    category: 'groove_grinds',
    variations: ['Frontside Torque', 'Backside Torque', 'Full Torque']
  },
  {
    id: 12,
    name: 'Backslide',
    description: 'A grind performed on the soul plate with the back foot, facing away from the direction of travel.',
    difficulty: 8,
    category: 'groove_grinds',
    variations: ['Frontside Backslide', 'Backside Backslide']
  },
  {
    id: 13,
    name: 'Frontside',
    description: 'A grind where the obstacle is in front of the skater.',
    difficulty: 3,
    category: 'groove_grinds'
  },
  {
    id: 14,
    name: 'Darkslide',
    description: 'A grind performed with the skate upside down, sliding on the top of the boot.',
    difficulty: 9,
    category: 'groove_grinds',
    variations: ['Frontside Darkslide', 'Backside Darkslide']
  },
  {
    id: 15,
    name: 'Fastslide',
    description: 'A grind performed on the outside edge of the frame, with the foot positioned for maximum speed.',
    difficulty: 7,
    category: 'groove_grinds',
    variations: ['Frontside Fastslide', 'Backside Fastslide']
  },
  {
    id: 16,
    name: 'Pudslide',
    description: 'A grind performed on the inside edge of the frame, with the foot in a specific position.',
    difficulty: 6,
    category: 'groove_grinds',
    variations: ['Frontside Pudslide', 'Backside Pudslide']
  },
  
  // Special Grinds
  {
    id: 17,
    name: 'Fishbrain',
    description: 'A topside Makio - performed on top of an obstacle with the foot perpendicular to the direction of travel.',
    difficulty: 8,
    category: 'special_grinds',
    variations: ['Frontside Fishbrain', 'Backside Fishbrain']
  },
  {
    id: 18,
    name: 'Kindgrind',
    description: 'A topside Mizou - performed on top of an obstacle with the foot parallel to the direction of travel.',
    difficulty: 8,
    category: 'special_grinds'
  },
  {
    id: 19,
    name: 'Savannah',
    description: 'An alley-oop Unity grind, approaching from an unexpected angle.',
    difficulty: 9,
    category: 'special_grinds',
    variations: ['Backside Savannah']
  },
  {
    id: 20,
    name: 'Soyale',
    description: 'An alley-oop Torque Soul grind, combining elements of multiple grinds.',
    difficulty: 9,
    category: 'special_grinds'
  },
  {
    id: 21,
    name: 'Sweatstance',
    description: 'A topside Mizou grind with a specific foot position.',
    difficulty: 8,
    category: 'special_grinds'
  },
  {
    id: 22,
    name: 'Misfit',
    description: 'An alley-oop topside Mistrial, combining multiple elements for a complex grind.',
    difficulty: 9,
    category: 'special_grinds'
  },
  {
    id: 23,
    name: 'Sunny Day',
    description: 'A topside PStar grind with a specific foot position.',
    difficulty: 8,
    category: 'special_grinds'
  },
  
  // Air Tricks
  {
    id: 24,
    name: '360',
    description: 'A full rotation in the air, spinning 360 degrees before landing.',
    difficulty: 7,
    category: 'spins',
    variations: ['Frontside 360', 'Backside 360']
  },
  {
    id: 25,
    name: '540',
    description: 'One and a half rotations in the air, spinning 540 degrees before landing.',
    difficulty: 8,
    category: 'spins',
    variations: ['Frontside 540', 'Backside 540']
  },
  {
    id: 26,
    name: 'Misty Flip',
    description: 'An off-axis backflip with a 180-degree rotation.',
    difficulty: 9,
    category: 'flips'
  },
  {
    id: 27,
    name: 'Japan Grab',
    description: 'An aerial trick where the skater grabs the inside of their skate behind their back.',
    difficulty: 7,
    category: 'air_tricks'
  },
  {
    id: 28,
    name: 'Mute Grab',
    description: 'An aerial trick where the skater grabs the outside of their skate with their opposite hand.',
    difficulty: 6,
    category: 'air_tricks'
  },
  {
    id: 29,
    name: 'Method Grab',
    description: 'An aerial trick where the skater grabs the heel of their skate and extends their body in a specific pose.',
    difficulty: 7,
    category: 'air_tricks'
  },
  {
    id: 30,
    name: 'Safety Grab',
    description: 'An aerial trick where the skater grabs the inside of their skate with the same-side hand.',
    difficulty: 5,
    category: 'air_tricks'
  },
  {
    id: 31,
    name: 'Liu Kang Grab',
    description: 'A dynamic aerial trick inspired by the Mortal Kombat character, involving a specific kick position.',
    difficulty: 8,
    category: 'air_tricks'
  },
  {
    id: 32,
    name: 'Rocket Grab',
    description: 'An aerial trick where the skater grabs the toe of their skate and points it forward like a rocket.',
    difficulty: 7,
    category: 'air_tricks'
  }
];

export const getTricksByCategory = (category: string): Trick[] => {
  return initialTricks.filter(trick => trick.category === category);
};

export const getTrickById = (id: number): Trick | undefined => {
  return initialTricks.find(trick => trick.id === id);
};
