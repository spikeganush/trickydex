export interface Trick {
  id: number;
  name: string;
  description: string;
  difficulty: number;
  category: TrickCategory;
  variations?: string[];
  possibleEntrances?: string[];
}

export type TrickCategory = 'soul_grinds' | 'groove_grinds' | 'special_grinds' | 'topside_grinds' | 'air_tricks' | 'spins' | 'flips' | 'entrance' | 'variations';

export const trickCategories: Record<TrickCategory, string> = {
  soul_grinds: 'Soul Grinds',
  groove_grinds: 'Groove Grinds',
  special_grinds: 'Special Grinds',
  topside_grinds: 'Topside Grinds',
  air_tricks: 'Air Tricks',
  spins: 'Spins',
  flips: 'Flips',
  entrance: 'Entrance',
  variations: 'Variations'
};

export const initialTricks: Trick[] = [
  {
    "id": 1,
    "name": "Soul",
    "description": "A soul grind is seemingly an easy grind, however it requires extra coordination of your body to be able to hold on to. As with any regular soul grind, your dominant (back) foot will be locked on the soul plate, and your front foot will be moved forward towards the direction you're grinding in, extending the reach of your leg. You will lock your front foot on the groove of the frame.",
    "difficulty": 2,
    "category": "soul_grinds",
    "variations": ["Soul Torque"],
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 2,
    "name": "Makio",
    "description": "This is one of the beginner grinds. You grind an object with your soul foot, resting the soul plate on top of the object. Your other foot is lifted in the air and you perform this grind with one foot only. It is a beginner grind because it does not require you to twist your body or legs and is easy to practice with lifting one foot and locking onto the object you're grinding.",
    "difficulty": 1,
    "category": "soul_grinds",
    "variations": ["Freestyle Makio", "Rocket Makio", "Christ Makio"],
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 3,
    "name": "Mizou",
    "description": "Another one of beginner grinds, but more difficult than a Makio. With this grind you will lock your soul foot to the object you are grinding and swing your other leg behind your soul skate. This will require twisting your body a little to keep this position. The back skate should be locked on the groove in the frame.",
    "difficulty": 2,
    "category": "soul_grinds",
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 4,
    "name": "Acid",
    "description": "A variation of the soul grind where the front skate is 'on Acid'. The Soul Grind is the 'Normal' position and in the Acid Soul the front skate is positioned differently, with the soul plate facing away from the grinding surface.",
    "difficulty": 3,
    "category": "soul_grinds",
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 5,
    "name": "PStar",
    "description": "Also known as Pornstar, this is a soul grind variation where the soul foot is positioned differently on the grinding surface, creating a unique stance while grinding.",
    "difficulty": 3,
    "category": "soul_grinds",
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 6,
    "name": "Mistrial",
    "description": "A soul grind variation that combines elements of other grinds, creating a unique position on the grinding surface that requires good balance and body control.",
    "difficulty": 4,
    "category": "soul_grinds",
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 7,
    "name": "X Grind",
    "description": "A soul grind where the legs form an X shape while grinding, requiring good flexibility and balance to maintain the position throughout the grind.",
    "difficulty": 5,
    "category": "soul_grinds",
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 8,
    "name": "Topside Soul",
    "description": "A soul grind performed on the opposite side of the grinding surface than usual, requiring more balance and precision to maintain the position throughout the grind.",
    "difficulty": 6,
    "category": "topside_grinds",
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 9,
    "name": "Fishbrain",
    "description": "Also known as Topside Makio, this is a special named grind where the skater performs a Makio on the opposite side of the grinding surface than usual, requiring excellent balance and precision.",
    "difficulty": 5,
    "category": "topside_grinds",
    "variations": ["Freestyle Fishbrain", "Rocket Fishbrain", "Christ Fishbrain"],
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 10,
    "name": "Sweatstance",
    "description": "A Mizou grind performed on the opposite side of the grinding surface than usual, requiring more balance and precision. Also known as Sweatstance.",
    "difficulty": 5,
    "category": "topside_grinds",
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 11,
    "name": "Topside Mistrial",
    "description": "A Mistrial grind performed on the opposite side of the grinding surface than usual, requiring more balance and precision. Also known as Overpuss.",
    "difficulty": 7,
    "category": "topside_grinds",
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 12,
    "name": "Frontside",
    "description": "This is a beginner groove grind. Even though it is a beginner grind it requires a full commit - you want both of your skates to be up in the air and lock to the grind relatively at the same time, otherwise you risk slipping out. In this grind you are facing the object with the front of your body, your legs spread apart, and you are locking both skates on the (inner) groove in your frame.",
    "difficulty": 2,
    "category": "groove_grinds",
    "variations": ["Low Frontside"],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 13,
    "name": "Backside",
    "description": "Similar to the Frontside but performed with your back facing the grinding surface. This requires more body awareness as you can't see the surface you're grinding on as easily, making it more challenging to maintain balance throughout the grind.",
    "difficulty": 3,
    "category": "groove_grinds",
    "variations": ["Low Backside"],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 14,
    "name": "Royale",
    "description": "A fundamental groove grind where one foot is positioned with the soul plate on the grinding surface and the other foot is locked with the h-block on the same surface, creating a stable but challenging position to maintain.",
    "difficulty": 3,
    "category": "groove_grinds",
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 15,
    "name": "Backside Royale",
    "description": "A Royale grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 4,
    "category": "groove_grinds",
    "variations": ["Negative Backside Royale"],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 16,
    "name": "Unity",
    "description": "A groove grind where both feet are positioned on the same side of the grinding surface, requiring good balance and coordination to maintain the position throughout the grind.",
    "difficulty": 4,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 17,
    "name": "Backside Unity",
    "description": "A Unity grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 5,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 18,
    "name": "Torque",
    "description": "A groove grind where the body is twisted while grinding, with feet positioned in a specific configuration on the grinding surface that requires good flexibility and balance.",
    "difficulty": 5,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 19,
    "name": "Backside Torque",
    "description": "A Torque grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 4,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 20,
    "name": "Full Torque",
    "description": "A variation of the Torque grind with a different foot positioning, creating a more complex balance requirement and body position while grinding.",
    "difficulty": 5,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 21,
    "name": "Backside Full Torque",
    "description": "A Full Torque grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 3,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 22,
    "name": "Backslide",
    "description": "A groove grind where the feet are positioned in a specific way on the grinding surface, creating a unique stance that requires good balance and coordination.",
    "difficulty": 4,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 23,
    "name": "Backside Backslide",
    "description": "A Backslide grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 5,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 24,
    "name": "Cab Driver",
    "description": "A groove grind where the feet are positioned in a specific way on the grinding surface, creating a unique stance that requires good balance and coordination.",
    "difficulty": 6,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 25,
    "name": "Backside Cab Driver",
    "description": "A Cab Driver grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 5,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 26,
    "name": "Fastslide",
    "description": "A groove grind where the feet are positioned in a specific way on the grinding surface, creating a unique stance that requires good balance and coordination.",
    "difficulty": 8,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 27,
    "name": "Backside Fastslide",
    "description": "A Fastslide grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 9,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 28,
    "name": "Pudslide",
    "description": "A groove grind where the feet are positioned in a specific way on the grinding surface, creating a unique stance that requires good balance and coordination.",
    "difficulty": 10,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 29,
    "name": "Backside Pudslide",
    "description": "A Pudslide grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 10,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": ["270", "450"]
  },
  {
    "id": 30,
    "name": "Savannah",
    "description": "Also known as AO Unity, this special named grind combines an Alleyoop approach with a Unity position, creating a complex trick that requires excellent body control.",
    "difficulty": 5,
    "category": "special_grinds",
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 31,
    "name": "Backside Savannah",
    "description": "Also known as AO BS Unity, this special named grind combines an Alleyoop approach with a Backside Unity position, creating a very complex trick that requires excellent body control.",
    "difficulty": 6,
    "category": "special_grinds",
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 32,
    "name": "Soyale",
    "description": "Also known as AO Torque Soul, this special named grind combines an Alleyoop approach with a Torque Soul position, creating a complex trick that requires excellent body control.",
    "difficulty": 6,
    "category": "special_grinds",
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 33,
    "name": "Sunny Day",
    "description": "Also known as Topside PStar, this special named grind involves performing a PStar on the opposite side of the grinding surface than usual, requiring excellent balance and precision.",
    "difficulty": 6,
    "category": "topside_grinds",
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 34,
    "name": "Misfit",
    "description": "Also known as AO Topside Mistrial, this special named grind combines an Alleyoop approach with a Topside Mistrial position, creating a very complex trick that requires excellent body control.",
    "difficulty": 8,
    "category": "topside_grinds",
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 35,
    "name": "UFO",
    "description": "A really low and stretched out Frontside or Backside grind, requiring excellent flexibility and balance to maintain the position throughout the grind.",
    "difficulty": 5,
    "category": "special_grinds",
    "possibleEntrances": ["Alleyoop", "Truespin", "Half Cab", "Full Cab", "360", "540"]
  },
  {
    "id": 36,
    "name": "Alleyoop",
    "description": "Alleyoop or AO is a trick performed backwards. When normally grinding and facing forward towards your grind, an AO would be the opposite. You would in this case be facing backwards to the direction of travel. An AO happens when you spin (the easier way) into the object you're grinding.",
    "difficulty": 3,
    "category": "entrance",
    "possibleEntrances": []
  },
  {
    "id": 37,
    "name": "Truespin",
    "description": "Similar to Alleyoop but spinning the 'long way' away from the object you're grinding, making it more difficult to execute properly.",
    "difficulty": 4,
    "category": "entrance",
    "possibleEntrances": []
  },
  {
    "id": 38,
    "name": "Topside",
    "description": "Performing a grind on the opposite side of the grinding surface than usual, often requiring more balance and precision to maintain the position throughout the grind.",
    "difficulty": 5,
    "category": "variations",
    "possibleEntrances": []
  },
  {
    "id": 39,
    "name": "Switch",
    "description": "Performing a trick with your non-dominant foot forward, adding complexity to the execution of the trick.",
    "difficulty": 4,
    "category": "variations",
    "possibleEntrances": []
  },
  {
    "id": 40,
    "name": "Fakie",
    "description": "Performing a trick while skating backwards, adding complexity to the approach and execution of the trick.",
    "difficulty": 3,
    "category": "entrance",
    "possibleEntrances": []
  },
  {
    "id": 41,
    "name": "Half Cab",
    "description": "A 180-degree rotation performed while skating fakie, landing forward, often used as an approach to grinds.",
    "difficulty": 3,
    "category": "entrance",
    "possibleEntrances": []
  },
  {
    "id": 42,
    "name": "Full Cab",
    "description": "A 360-degree rotation performed while skating fakie, landing fakie again, often used as an approach to grinds.",
    "difficulty": 5,
    "category": "entrance",
    "possibleEntrances": []
  },
  {
    "id": 43,
    "name": "Rocket",
    "description": "A variation where one leg is extended straight upward during a grind, adding style and difficulty to the trick.",
    "difficulty": 4,
    "category": "variations",
    "possibleEntrances": []
  },
  {
    "id": 44,
    "name": "Tough",
    "description": "Also known as Toe, this is a variation where the grind is performed primarily on the toe area of the skate, requiring precise balance and control.",
    "difficulty": 4,
    "category": "variations",
    "possibleEntrances": []
  },
  {
    "id": 45,
    "name": "Rough",
    "description": "Also known as Heel, this is a variation where the grind is performed primarily on the heel area of the skate, requiring precise balance and control.",
    "difficulty": 4,
    "category": "variations",
    "possibleEntrances": []
  },
  {
    "id": 46,
    "name": "Negative",
    "description": "A variation where the grind is performed on the opposite side of the foot than usual, creating a more challenging position to maintain.",
    "difficulty": 5,
    "category": "variations",
    "possibleEntrances": []
  },
  {
    "id": 47,
    "name": "Farside",
    "description": "A variation where the grind is performed on the far side of the obstacle, requiring more commitment and precision.",
    "difficulty": 5,
    "category": "entrance",
    "possibleEntrances": []
  },
  {
    "id": 48,
    "name": "Darkside",
    "description": "A variation where the grind is performed on the dark side (non-natural side) of the obstacle, requiring more body awareness and control.",
    "difficulty": 5,
    "category": "entrance",
    "possibleEntrances": []
  },
  {
    "id": 49,
    "name": "Disaster",
    "description": "A variation where the skater lands on the obstacle with the wheels instead of grinding, then transitions into a grind, adding complexity to the trick.",
    "difficulty": 5,
    "category": "entrance",
    "possibleEntrances": []
  },
  {
    "id": 50,
    "name": "Zero Spin",
    "description": "A variation where the skater approaches the grind without any rotation, focusing on clean execution and style.",
    "difficulty": 2,
    "category": "entrance",
    "possibleEntrances": []
  }, 
  {
    "id": 51,
    "name": "180",
    "description": "A half rotation (180 degrees) performed in the air before landing, often used as an entrance to grinds or as a standalone trick.",
    "difficulty": 2,
    "category": "spins",
    "variations": ["Frontside 180", "Backside 180", "Fakie 180"],
    "possibleEntrances": []
  },
  {
    "id": 52,
    "name": "270",
    "description": "A three-quarter rotation (270 degrees) performed in the air, often used as an entrance to grinds. This spin is particularly common for groove trick entrances.",
    "difficulty": 3,
    "category": "spins",
    "variations": ["Frontside 270", "Backside 270", "Fakie 270"],
    "possibleEntrances": []
  },
  {
    "id": 53,
    "name": "360",
    "description": "A full rotation (360 degrees) performed in the air before landing, requiring good air awareness and rotation control.",
    "difficulty": 4,
    "category": "spins",
    "variations": ["Frontside 360", "Backside 360", "Alleyoop 360"],
    "possibleEntrances": []
  },
  {
    "id": 54,
    "name": "450",
    "description": "A one-and-a-quarter rotation (450 degrees) performed in the air, often used as an entrance to grinds. This advanced spin requires excellent air awareness and rotation control.",
    "difficulty": 5,
    "category": "spins",
    "variations": ["Frontside 450", "Backside 450", "Fakie 450"],
    "possibleEntrances": []
  },
  {
    "id": 55,
    "name": "540",
    "description": "A one-and-a-half rotation (540 degrees) performed in the air before landing, requiring excellent air awareness and rotation control.",
    "difficulty": 6,
    "category": "spins",
    "variations": ["Frontside 540", "Backside 540", "Alleyoop 540"],
    "possibleEntrances": []
  },
  {
    "id": 56,
    "name": "720",
    "description": "A double rotation (720 degrees) performed in the air before landing, requiring exceptional air awareness and rotation control.",
    "difficulty": 8,
    "category": "spins",
    "variations": ["Frontside 720", "Backside 720", "Fakie 720"],
    "possibleEntrances": []
  },
  {
    "id": 57,
    "name": "900",
    "description": "A two-and-a-half rotation (900 degrees) performed in the air before landing, requiring elite level air awareness and rotation control.",
    "difficulty": 9,
    "category": "spins",
    "variations": ["Frontside 900", "Backside 900", "Alleyoop 900"],
    "possibleEntrances": []
  },
  {
    "id": 58,
    "name": "1080",
    "description": "A triple rotation (1080 degrees) performed in the air before landing, requiring professional level air awareness and rotation control.",
    "difficulty": 10,
    "category": "spins",
    "variations": ["Frontside 1080", "Backside 1080", "Fakie 1080"],
    "possibleEntrances": []
  },
  {
    "id": 59,
    "name": "1260",
    "description": "A quadruple rotation (1260 degrees) performed in the air before landing, requiring elite level air awareness and rotation control.",
    "difficulty": 10,
    "category": "spins",
    "variations": ["Frontside 1260", "Backside 1260", "Alleyoop 1260"],
    "possibleEntrances": []
  }, 
  {
    "id": 60,
    "name": "Backflip",
    "description": "A backwards somersault performed in the air, requiring good air awareness and commitment.",
    "difficulty": 7,
    "category": "flips",
    "possibleEntrances": []
  },
  {
    "id": 61,
    "name": "Frontflip",
    "description": "A forward somersault performed in the air, requiring good air awareness and commitment.",
    "difficulty": 7,
    "category": "flips",
    "possibleEntrances": []
  },
  {
    "id": 62,
    "name": "Misty Flip",
    "description": "A diagonal flip that combines elements of a backflip and a 180-degree spin, creating a unique aerial trick that requires good body control.",
    "difficulty": 8,
    "category": "flips",
    "possibleEntrances": []
  },
  {
    "id": 63,
    "name": "Cork",
    "description": "An off-axis rotation that combines elements of a flip and a spin, creating a complex aerial trick that requires excellent body control.",
    "difficulty": 8,
    "category": "flips",
    "possibleEntrances": []
  },
  {
    "id": 64,
    "name": "Rodeo",
    "description": "An off-axis backflip combined with a spin, creating a complex aerial trick that requires excellent body control and air awareness.",
    "difficulty": 8,
    "category": "flips",
    "possibleEntrances": []
  },
  {
    "id": 65,
    "name": "Bio",
    "description": "A forward-flipping cork, combining elements of a frontflip with an off-axis rotation, requiring excellent body control and air awareness.",
    "difficulty": 9,
    "category": "flips",
    "possibleEntrances": []
  },    
  {
    "id": 66,
    "name": "Mute Grab",
    "description": "An aerial trick where the skater grabs the outside of their skate with their opposite hand, adding style and control to the trick.",
    "difficulty": 3,
    "category": "air_tricks",
    "possibleEntrances": []
  },
  {
    "id": 67,
    "name": "Japan Grab",
    "description": "An aerial trick where the skater grabs the inside of their skate with their same hand, creating a distinctive pose in the air that requires good flexibility.",
    "difficulty": 4,
    "category": "air_tricks",
    "possibleEntrances": []
  },
  {
    "id": 68,
    "name": "Stale Grab",
    "description": "An aerial trick where the skater grabs the outside of their skate with their same hand, requiring a good stretch and body control to execute properly.",
    "difficulty": 4,
    "category": "air_tricks",
    "possibleEntrances": []
  },
  {
    "id": 69,
    "name": "Method",
    "description": "An aerial trick where the skater grabs the heel of their skate while extending their legs and arching their back, creating a stylish pose in the air.",
    "difficulty": 4,
    "category": "air_tricks",
    "possibleEntrances": []
  },
  {
    "id": 70,
    "name": "Rocket Air",
    "description": "An aerial trick where the skater grabs the toe of their skate and pulls it up toward their body, creating a compact pose in the air.",
    "difficulty": 3,
    "category": "air_tricks",
    "possibleEntrances": []
  },  
  {
    "id": 71,
    "name": "Truck Driver",
    "description": "An aerial trick where the skater grabs both skates simultaneously, creating a challenging pose in the air that requires good flexibility and control.",
    "difficulty": 6,
    "category": "air_tricks",
    "possibleEntrances": []
  }
  
];

export const getTricksByCategory = (category: string): Trick[] => {
  return initialTricks.filter(trick => trick.category === category);
};

export const getTrickById = (id: number): Trick | undefined => {
  return initialTricks.find(trick => trick.id === id);
};