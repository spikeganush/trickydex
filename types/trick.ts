export interface Trick {
  id: number;
  name: string;
  description: string;
  difficulty: number;
  category: TrickCategory;
  variations?: Variation[];
  possibleEntrances?: Entrance[];
  popularity?: number; // 1-10 scale, how common/popular the trick is (10 = very common)
}

export interface Variation {
  name: string;
  difficulty: number; // 1-30 scale, how difficult the variation is
}

export interface Entrance {
  name: string;
  difficulty: number; // 1-30 scale, how difficult the entrance is
}

export type TrickCategory = 'soul_grinds' | 'groove_grinds' | 'special_grinds' | 'topside_grinds' | 'air_tricks' | 'spins' | 'flips' | 'entrances' | 'variations';

export const trickCategories: Record<TrickCategory, string> = {
  soul_grinds: 'Soul Grinds',
  groove_grinds: 'Groove Grinds',
  special_grinds: 'Special Grinds',
  topside_grinds: 'Topside Grinds',
  air_tricks: 'Air Tricks',
  spins: 'Spins',
  flips: 'Flips',
  entrances: 'Entrances',
  variations: 'Variations'
};

export const initialTricks: Trick[] = [
  {
    "id": 1,
    "name": "Soul",
    "description": "A soul grind is seemingly an easy grind, however it requires extra coordination of your body to be able to hold on to. As with any regular soul grind, your dominant (back) foot will be locked on the soul plate, and your front foot will be moved forward towards the direction you're grinding in, extending the reach of your leg. You will lock your front foot on the groove of the frame.",
    "difficulty": 2,
    "category": "soul_grinds",
    "variations": [{"name": "Soul Torque", "difficulty": 2}],
    "possibleEntrances": [{"name": "Alleyoop", "difficulty": 3}, {"name": "Truespin", "difficulty": 4}, {"name": "Half Cab", "difficulty": 3}, {"name": "Full Cab", "difficulty": 5}, {"name": "360", "difficulty": 6}, {"name": "540", "difficulty": 8}],
    "popularity": 8
  },
  {
    "id": 2,
    "name": "Makio",
    "description": "This is one of the beginner grinds. You grind an object with your soul foot, resting the soul plate on top of the object. Your other foot is lifted in the air and you perform this grind with one foot only. It is a beginner grind because it does not require you to twist your body or legs and is easy to practice with lifting one foot and locking onto the object you're grinding.",
    "difficulty": 1,
    "category": "soul_grinds",
    "variations": [{"name": "Freestyle Makio", "difficulty": 0}, {"name": "Rocket Makio", "difficulty": 4}, {"name": "Christ Makio", "difficulty": 2}],
    "possibleEntrances": [{"name": "Alleyoop", "difficulty": 3}, {"name": "Truespin", "difficulty": 4}, {"name": "Half Cab", "difficulty": 3}, {"name": "Full Cab", "difficulty": 5}, {"name": "360", "difficulty": 5}, {"name": "540", "difficulty": 8}],
    "popularity": 9
  },
  {
    "id": 3,
    "name": "Mizou",
    "description": "Another one of beginner grinds, but more difficult than a Makio. With this grind you will lock your soul foot to the object you are grinding and swing your other leg behind your soul skate. This will require twisting your body a little to keep this position. The back skate should be locked on the groove in the frame.",
    "difficulty": 2,
    "category": "soul_grinds",
    "possibleEntrances": [{"name": "Alleyoop", "difficulty": 4}, {"name": "Truespin", "difficulty": 3}, {"name": "Half Cab", "difficulty": 3}, {"name": "Full Cab", "difficulty": 5}, {"name": "360", "difficulty": 5}, {"name": "540", "difficulty": 8}],
    "popularity": 7
  },
  {
    "id": 4,
    "name": "Acid",
    "description": "A variation of the soul grind where the front skate is 'on Acid'. The Soul Grind is the 'Normal' position and in the Acid Soul the front skate is positioned differently, with the soul plate facing away from the grinding surface.",
    "difficulty": 3,
    "category": "soul_grinds",
    "possibleEntrances": [{"name": "Alleyoop", "difficulty": 4}, {"name": "Truespin", "difficulty": 5}, {"name": "Half Cab", "difficulty": 3}, {"name": "Full Cab", "difficulty": 5}, {"name": "360", "difficulty": 5}, {"name": "540", "difficulty": 9}],
    "popularity": 6
  },
  {
    "id": 5,
    "name": "Pornstar",
    "description": "Also known as PStar, this is a soul grind variation where the soul foot is positioned differently on the grinding surface, creating a unique stance while grinding.",
    "difficulty": 3,
    "category": "soul_grinds",
    "possibleEntrances": [{"name": "Alleyoop", "difficulty": 3}, {"name": "Truespin", "difficulty": 4}, {"name": "Half Cab", "difficulty": 3}, {"name": "Full Cab", "difficulty": 5}, {"name": "360", "difficulty": 9}, {"name": "540", "difficulty": 10}],
    "popularity": 5
  },
  {
    "id": 6,
    "name": "Mistrial",
    "description": "A soul grind variation that combines elements of other grinds, creating a unique position on the grinding surface that requires good balance and body control.",
    "difficulty": 4,
    "category": "soul_grinds",
    "possibleEntrances": [{"name": "Alleyoop", "difficulty": 3}, {"name": "Truespin", "difficulty": 4}, {"name": "Half Cab", "difficulty": 3}, {"name": "Full Cab", "difficulty": 5}, {"name": "360", "difficulty": 5}, {"name": "540", "difficulty": 8}],
    "popularity": 4
  },
  {
    "id": 7,
    "name": "X Grind",
    "description": "A soul grind where the legs form an X shape while grinding, requiring good flexibility and balance to maintain the position throughout the grind.",
    "difficulty": 5,
    "category": "soul_grinds",
    "possibleEntrances": [{"name": "Alleyoop", "difficulty": 3}, {"name": "Truespin", "difficulty": 4}, {"name": "Half Cab", "difficulty": 3}, {"name": "Full Cab", "difficulty": 5}, {"name": "360", "difficulty": 5}, {"name": "540", "difficulty": 8}],
    "popularity": 3
  },
  {
    "id": 8,
    "name": "Top Soul",
    "description": "A soul grind performed on the opposite side of the grinding surface than usual, requiring more balance and precision to maintain the position throughout the grind.",
    "difficulty": 5,
    "category": "topside_grinds",
    "possibleEntrances": [{"name": "Alleyoop", "difficulty": 6}, {"name": "Truespin", "difficulty": 5}, {"name": "Half Cab", "difficulty": 3}, {"name": "Full Cab", "difficulty": 7}, {"name": "360", "difficulty": 4}, {"name": "540", "difficulty": 9}],
    "popularity": 5
  },
  {
    "id": 9,
    "name": "Fishbrain",
    "description": "Also known as Top Makio, this is a special named grind where the skater performs a Makio on the opposite side of the grinding surface than usual, requiring excellent balance and precision.",
    "difficulty": 6,
    "category": "topside_grinds",
    "variations": [{"name": "Freestyle Fishbrain", "difficulty": 0}, {"name": "Rocket Fishbrain", "difficulty": 3}, {"name": "Christ Fishbrain", "difficulty": 2}],
    "possibleEntrances": [{"name": "Alleyoop", "difficulty": 3}, {"name": "Truespin", "difficulty": 6}, {"name": "Half Cab", "difficulty": 4}, {"name": "Full Cab", "difficulty": 7}, {"name": "360", "difficulty": 8}, {"name": "540", "difficulty": 11}],
    "popularity": 3
  },
  {
    "id": 10,
    "name": "Sweatstance",
    "description": "A Mizou grind performed on the opposite side of the grinding surface than usual, requiring more balance and precision. Also known as Sweatstance.",
    "difficulty": 5,
    "category": "topside_grinds",
    "possibleEntrances": [{"name": "Alleyoop", "difficulty": 3}, {"name": "Truespin", "difficulty": 7}, {"name": "Half Cab", "difficulty": 3}, {"name": "Full Cab", "difficulty": 7}, {"name": "360", "difficulty": 8}, {"name": "540", "difficulty": 9}],
    "popularity": 4
  },
  {
    "id": 11,
    "name": "Top Mistrial",
    "description": "A Mistrial grind performed on the opposite side of the grinding surface than usual, requiring more balance and precision. Also known as Overpuss.",
    "difficulty": 7,
    "category": "topside_grinds",
    "possibleEntrances": [{"name": "Alleyoop", "difficulty": 4}, {"name": "Truespin", "difficulty": 6}, {"name": "Half Cab", "difficulty": 3}, {"name": "Full Cab", "difficulty": 5}, {"name": "360", "difficulty": 8}, {"name": "540", "difficulty": 11}],
    "popularity": 3
  },
  {
    "id": 12,
    "name": "Frontside",
    "description": "This is a beginner groove grind. Also called UFO. Even though it is a beginner grind it requires a full commit - you want both of your skates to be up in the air and lock to the grind relatively at the same time, otherwise you risk slipping out. In this grind you are facing the object with the front of your body, your legs spread apart, and you are locking both skates on the (inner) groove in your frame.",
    "difficulty": 2,
    "category": "groove_grinds",
    "variations": [{"name": "Low Frontside", "difficulty": 1}],
    "possibleEntrances": [{"name": "270", "difficulty": 8}, {"name": "450", "difficulty": 11}],
    "popularity": 8
  },
  {
    "id": 13,
    "name": "Backside",
    "description": "Similar to the Frontside but performed with your back facing the grinding surface. This requires more body awareness as you can't see the surface you're grinding on as easily, making it more challenging to maintain balance throughout the grind.",
    "difficulty": 3,
    "category": "groove_grinds",
    "variations": [{"name": "Low Backside", "difficulty": 1}],
    "possibleEntrances": [{"name": "270", "difficulty": 8}, {"name": "450", "difficulty": 12}],
    "popularity": 7
  },
  {
    "id": 14,
    "name": "Royale",
    "description": "A fundamental groove grind where one foot is positioned with the soul plate on the grinding surface and the other foot is locked with the h-block on the same surface, creating a stable but challenging position to maintain.",
    "difficulty": 3,
    "category": "groove_grinds",
    "possibleEntrances": [{"name": "270", "difficulty": 8}, {"name": "450", "difficulty": 12}],
    "popularity": 6
  },
  {
    "id": 15,
    "name": "Back Royale",
    "description": "A Royale grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 4,
    "category": "groove_grinds",
    "possibleEntrances": [{"name": "270", "difficulty": 8}, {"name": "450", "difficulty": 13}],
    "popularity": 5
  },
  {
    "id": 16,
    "name": "Unity",
    "description": "A groove grind where both feet are positioned on the same side of the grinding surface, requiring good balance and coordination to maintain the position throughout the grind.",
    "difficulty": 5,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": [{"name": "270", "difficulty": 8}, {"name": "450", "difficulty": 13}],
    "popularity": 4
  },
  {
    "id": 17,
    "name": "Back Unity",
    "description": "A Unity grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 4,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": [{"name": "270", "difficulty": 7}, {"name": "450", "difficulty": 12}],
    "popularity": 3
  },
  {
    "id": 18,
    "name": "Front Torque",
    "description": "A groove grind where the body is twisted while grinding, with feet positioned in a specific configuration on the grinding surface that requires good flexibility and balance.",
    "difficulty": 5,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": [{"name": "270", "difficulty": 8}, {"name": "450", "difficulty": 13}],
    "popularity": 2
  },
  {
    "id": 19,
    "name": "Back Torque",
    "description": "A Torque grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 4,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": [{"name": "270", "difficulty": 7}, {"name": "450", "difficulty": 14}],
    "popularity": 3
  },
  {
    "id": 20,
    "name": "Front Full Torque",
    "description": "A variation of the Torque grind with a different foot positioning, creating a more complex balance requirement and body position while grinding.",
    "difficulty": 5,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": [{"name": "270", "difficulty": 8}, {"name": "450", "difficulty": 11}],
    "popularity": 1
  },
  {
    "id": 21,
    "name": "Back Full Torque",
    "description": "A Full Torque grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 3,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": [{"name": "270", "difficulty": 8}, {"name": "450", "difficulty": 12}],
    "popularity": 1
  },
  {
    "id": 22,
    "name": "Backslide",
    "description": "A groove grind where the feet are positioned in a specific way on the grinding surface, creating a unique stance that requires good balance and coordination.",
    "difficulty": 4,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": [{"name": "270", "difficulty": 10}, {"name": "450", "difficulty": 13}],
    "popularity": 3
  },
  {
    "id": 23,
    "name": "Back Backslide",
    "description": "A Backslide grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 5,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": [{"name": "270", "difficulty": 6}, {"name": "450", "difficulty": 13}],
    "popularity": 1
  },
  {
    "id": 24,
    "name": "Cab Driver",
    "description": "A groove grind where the feet are positioned in a specific way on the grinding surface, creating a unique stance that requires good balance and coordination.",
    "difficulty": 6,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": [{"name": "270", "difficulty": 8}, {"name": "450", "difficulty": 9}],
    "popularity": 2
  },
  {
    "id": 25,
    "name": "Back Cab Driver",
    "description": "A Cab Driver grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 5,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": [{"name": "270", "difficulty": 8}, {"name": "450", "difficulty": 11}],
    "popularity": 1
  },
  {
    "id": 26,
    "name": "Fastslide",
    "description": "A groove grind where the feet are positioned in a specific way on the grinding surface, creating a unique stance that requires good balance and coordination.",
    "difficulty": 8,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": [{"name": "270", "difficulty": 11}, {"name": "450", "difficulty": 12}],
    "popularity": 1
  },
  {
    "id": 27,
    "name": "Back Fastslide",
    "description": "A Fastslide grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 9,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": [{"name": "270", "difficulty": 6}, {"name": "450", "difficulty": 11}],
    "popularity": 1
  },
  {
    "id": 28,
    "name": "Pudslide",
    "description": "A groove grind where the feet are positioned in a specific way on the grinding surface, creating a unique stance that requires good balance and coordination.",
    "difficulty": 10,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": [{"name": "270", "difficulty": 9}, {"name": "450", "difficulty": 10}],
    "popularity": 1
  },
  {
    "id": 29,
    "name": "Back Pudslide",
    "description": "A Pudslide grind performed from a backside approach, adding complexity to the trick and requiring more body awareness to execute properly.",
    "difficulty": 10,
    "category": "groove_grinds",
    "variations": [],
    "possibleEntrances": [{"name": "270", "difficulty": 9}, {"name": "450", "difficulty": 10}],
    "popularity": 1
  },
  {
    "id": 30,
    "name": "Savannah",
    "description": "Also known as AO Unity, this special named grind combines an Alleyoop approach with a Unity position, creating a complex trick that requires excellent body control.",
    "difficulty": 6,
    "category": "special_grinds",
    "possibleEntrances": [{"name": "270", "difficulty": 8}, {"name": "450", "difficulty": 10}],
    "popularity": 3
  },
  {
    "id": 31,
    "name": "Back Savannah",
    "description": "Also known as AO BS Unity, this special named grind combines an Alleyoop approach with a Backside Unity position, creating a very complex trick that requires excellent body control.",
    "difficulty": 7,
    "category": "special_grinds",
    "possibleEntrances": [{"name": "270", "difficulty": 6}, {"name": "450", "difficulty": 11}],
    "popularity": 3
  },
  {
    "id": 32,
    "name": "Soyale",
    "description": "Also known as AO Torque Soul, this special named grind combines an Alleyoop approach with a Torque Soul position, creating a complex trick that requires excellent body control.",
    "difficulty": 6,
    "category": "special_grinds",
    "possibleEntrances": [{"name": "Alleyoop", "difficulty": 0}, {"name": "Truespin", "difficulty": 6}, {"name": "Full Cab", "difficulty": 8}, {"name": "540", "difficulty": 10}],
    "popularity": 4
  },
  {
    "id": 33,
    "name": "Sunny Day",
    "description": "Also known as Top PStar, this special named grind involves performing a PStar on the opposite side of the grinding surface than usual, requiring excellent balance and precision.",
    "difficulty": 6,
    "category": "topside_grinds",
    "possibleEntrances": [{"name": "Alleyoop", "difficulty": 6}, {"name": "Truespin", "difficulty": 8}, {"name": "Half Cab", "difficulty": 6}, {"name": "Full Cab", "difficulty": 8}, {"name": "360", "difficulty": 9}, {"name": "540", "difficulty": 12}],
    "popularity": 4
  },
  {
    "id": 34,
    "name": "Misfit",
    "description": "Also known as AO Top Mistrial, this special named grind combines an Alleyoop approach with a Top Mistrial position, creating a very complex trick that requires excellent body control.",
    "difficulty": 10,
    "category": "topside_grinds",
    "possibleEntrances": [{"name": "Alleyoop", "difficulty": 0}, {"name": "Truespin", "difficulty": 4}, {"name": "Half Cab", "difficulty": 3}, {"name": "Full Cab", "difficulty": 5}, {"name": "540", "difficulty": 7}],
    "popularity": 4
  },
  {
    "id": 35,
    "name": "Alleyoop",
    "description": "Alleyoop or AO is a trick performed backwards. When normally grinding and facing forward towards your grind, an AO would be the opposite. You would in this case be facing backwards to the direction of travel. An AO happens when you spin (the easier way) into the object you're grinding.",
    "difficulty": 3,
    "category": "entrances",
    "possibleEntrances": [],
    "popularity": 5
  },
  {
    "id": 36,
    "name": "Truespin",
    "description": "Similar to Alleyoop but spinning the 'long way' away from the object you're grinding, making it more difficult to execute properly.",
    "difficulty": 4,
    "category": "entrances",
    "possibleEntrances": [],
    "popularity": 3
  },
  {
    "id": 37,
    "name": "Topside",
    "description": "Performing a grind on the opposite side of the grinding surface than usual, often requiring more balance and precision to maintain the position throughout the grind.",
    "difficulty": 0,
    "category": "variations",
    "possibleEntrances": [],
    "popularity": 3
  },
  {
    "id": 38,
    "name": "Switch",
    "description": "Performing a trick with your non-dominant foot forward, adding complexity to the execution of the trick.",
    "difficulty": 6,
    "category": "variations",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 39,
    "name": "Fakie",
    "description": "Performing a trick while skating backwards, adding complexity to the approach and execution of the trick.",
    "difficulty": 3,
    "category": "entrances",
    "possibleEntrances": [],
    "popularity": 4
  },
  {
    "id": 40,
    "name": "Half Cab",
    "description": "A 180-degree rotation performed while skating fakie, landing forward, often used as an approach to grinds.",
    "difficulty": 0,
    "category": "entrances",
    "possibleEntrances": [],
    "popularity": 3
  },
  {
    "id": 41,
    "name": "Full Cab",
    "description": "A 360-degree rotation performed while skating fakie, landing fakie again, often used as an approach to grinds.",
    "difficulty": 0,
    "category": "entrances",
    "possibleEntrances": [],
    "popularity": 3
  },
  {
    "id": 42,
    "name": "Rocket",
    "description": "A variation where one leg is extended straight upward during a grind, adding style and difficulty to the trick.",
    "difficulty": 0,
    "category": "variations",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 43,
    "name": "Tough",
    "description": "Also known as Toe, this is a variation where the grind is performed primarily on the toe area of the skate, requiring precise balance and control.",
    "difficulty": 4,
    "category": "variations",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 44,
    "name": "Rough",
    "description": "Also known as Heel, this is a variation where the grind is performed primarily on the heel area of the skate, requiring precise balance and control.",
    "difficulty": 4,
    "category": "variations",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 45,
    "name": "Negative",
    "description": "A variation where the grind is performed on the opposite side of the foot than usual, creating a more challenging position to maintain.",
    "difficulty": 7,
    "category": "variations",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 46,
    "name": "Farside",
    "description": "A variation where the grind is performed on the far side of the obstacle, requiring more commitment and precision.",
    "difficulty": 5,
    "category": "entrances",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 47,
    "name": "Darkside",
    "description": "A variation where the grind is performed on the dark side (non-natural side) of the obstacle, requiring more body awareness and control.",
    "difficulty": 5,
    "category": "entrances",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 48,
    "name": "Disaster",
    "description": "A variation where the skater lands on the obstacle with the wheels instead of grinding, then transitions into a grind, adding complexity to the trick.",
    "difficulty": 5,
    "category": "entrances",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 49,
    "name": "Zero Spin",
    "description": "A variation where the skater approaches the grind without any rotation, focusing on clean execution and style.",
    "difficulty": 3,
    "category": "entrances",
    "possibleEntrances": [],
    "popularity": 1
  }, 
  {
    "id": 50,
    "name": "180",
    "description": "A half rotation (180 degrees) performed in the air before landing, often used as an entrance to grinds or as a standalone trick.",
    "difficulty": 2,
    "category": "spins",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 51,
    "name": "270",
    "description": "A three-quarter rotation (270 degrees) performed in the air, often used as an entrance to grinds. This spin is particularly common for groove trick entrances.",
    "difficulty": 3,
    "category": "spins",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 52,
    "name": "360",
    "description": "A full rotation (360 degrees) performed in the air before landing, requiring good air awareness and rotation control.",
    "difficulty": 4,
    "category": "spins",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 53,
    "name": "450",
    "description": "A one-and-a-quarter rotation (450 degrees) performed in the air, often used as an entrance to grinds. This advanced spin requires excellent air awareness and rotation control.",
    "difficulty": 5,
    "category": "spins",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 54,
    "name": "540",
    "description": "A one-and-a-half rotation (540 degrees) performed in the air before landing, requiring excellent air awareness and rotation control.",
    "difficulty": 6,
    "category": "spins",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 55,
    "name": "720",
    "description": "A double rotation (720 degrees) performed in the air before landing, requiring exceptional air awareness and rotation control.",
    "difficulty": 8,
    "category": "spins",
     "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 56,
    "name": "900",
    "description": "A two-and-a-half rotation (900 degrees) performed in the air before landing, requiring elite level air awareness and rotation control.",
    "difficulty": 9,
    "category": "spins",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 57,
    "name": "1080",
    "description": "A triple rotation (1080 degrees) performed in the air before landing, requiring professional level air awareness and rotation control.",
    "difficulty": 10,
    "category": "spins",
     "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 58,
    "name": "1260",
    "description": "A quadruple rotation (1260 degrees) performed in the air before landing, requiring elite level air awareness and rotation control.",
    "difficulty": 10,
    "category": "spins",
     "possibleEntrances": [],
    "popularity": 1
  }, 
  {
    "id": 59,
    "name": "Backflip",
    "description": "A backwards somersault performed in the air, requiring good air awareness and commitment.",
    "difficulty": 7,
    "category": "flips",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 60,
    "name": "Frontflip",
    "description": "A forward somersault performed in the air, requiring good air awareness and commitment.",
    "difficulty": 7,
    "category": "flips",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 61,
    "name": "Misty Flip",
    "description": "A diagonal flip that combines elements of a backflip and a 180-degree spin, creating a unique aerial trick that requires good body control.",
    "difficulty": 8,
    "category": "flips",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 62,
    "name": "Cork",
    "description": "An off-axis rotation that combines elements of a flip and a spin, creating a complex aerial trick that requires excellent body control.",
    "difficulty": 8,
    "category": "flips",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 63,
    "name": "Rodeo",
    "description": "An off-axis backflip combined with a spin, creating a complex aerial trick that requires excellent body control and air awareness.",
    "difficulty": 8,
    "category": "flips",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 64,
    "name": "Bio",
    "description": "A forward-flipping cork, combining elements of a frontflip with an off-axis rotation, requiring excellent body control and air awareness.",
    "difficulty": 9,
    "category": "flips",
    "possibleEntrances": [],
    "popularity": 1
  },    
  {
    "id": 65,
    "name": "Flat Spin",
    "description": "Same start than a back flip, but instead of using the head as the center of the spin, the center of the spin is the shoulder.",
    "difficulty": 7,
    "category": "flips",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 66,
    "name": "Mute Grab",
    "description": "An aerial trick where the skater grabs the outside of their skate with their opposite hand, adding style and control to the trick.",
    "difficulty": 3,
    "category": "air_tricks",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 67,
    "name": "Japan Grab",
    "description": "An aerial trick where the skater grabs the inside of their skate with their same hand, creating a distinctive pose in the air that requires good flexibility.",
    "difficulty": 4,
    "category": "air_tricks",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 68,
    "name": "Stale Grab",
    "description": "An aerial trick where the skater grabs the outside of their skate with their same hand, requiring a good stretch and body control to execute properly.",
    "difficulty": 4,
    "category": "air_tricks",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 69,
    "name": "Method",
    "description": "An aerial trick where the skater grabs the heel of their skate while extending their legs and arching their back, creating a stylish pose in the air.",
    "difficulty": 4,
    "category": "air_tricks",
    "possibleEntrances": [],
    "popularity": 1
  },
  {
    "id": 70,
    "name": "Rocket Air",
    "description": "An aerial trick where the skater grabs the toe of their skate and pulls it up toward their body, creating a compact pose in the air.",
    "difficulty": 3,
    "category": "air_tricks",
    "possibleEntrances": [],
    "popularity": 1
  },  
  {
    "id": 71,
    "name": "Truck Driver",
    "description": "An aerial trick where the skater grabs both skates simultaneously, creating a challenging pose in the air that requires good flexibility and control.",
    "difficulty": 6,
    "category": "air_tricks",
    "possibleEntrances": [],
    "popularity": 1
  }
];

export const getRandomVariation = (
  trick: Trick, 
  difficultyPreference?: 'easy' | 'medium' | 'hard',
  maxDifficulty: number = 30
): Variation | null => {
  if (!trick.variations || trick.variations.length === 0) {
    return null;
  }

  // Filter variations based on difficulty preference and max difficulty
  let filteredVariations: Variation[] = [];
  
  if (difficultyPreference === 'easy') {
    // For easy, only include variations with difficulty <= 9 and <= maxDifficulty
    filteredVariations = trick.variations.filter(v => v.difficulty <= 9 && v.difficulty <= maxDifficulty);
  } else if (difficultyPreference === 'medium') {
    // For medium, only include variations with difficulty between 6 and 18 and <= maxDifficulty
    filteredVariations = trick.variations.filter(v => v.difficulty >= 6 && v.difficulty <= 18 && v.difficulty <= maxDifficulty);
  } else if (difficultyPreference === 'hard') {
    // For hard, only include variations with difficulty >= 12 and <= maxDifficulty
    filteredVariations = trick.variations.filter(v => v.difficulty >= 12 && v.difficulty <= maxDifficulty);
  } else {
    // If no preference, include all variations <= maxDifficulty
    filteredVariations = trick.variations.filter(v => v.difficulty <= maxDifficulty);
  }

  // If no variations match the criteria, return null
  if (filteredVariations.length === 0) {
    return null;
  }

  // Select a random variation from the filtered list
  const randomIndex = Math.floor(Math.random() * filteredVariations.length);
  return filteredVariations[randomIndex];
};

export const getRandomEntrance = (
  trick: Trick, 
  difficultyPreference?: 'easy' | 'medium' | 'hard',
  maxDifficulty: number = 30
): Entrance | null => {
  if (!trick.possibleEntrances || trick.possibleEntrances.length === 0) {
    return null;
  }

  // Filter entrances based on difficulty preference and max difficulty
  let filteredEntrances: Entrance[] = [];
  
  if (difficultyPreference === 'easy') {
    // For easy, only include entrances with difficulty <= 9 and <= maxDifficulty
    filteredEntrances = trick.possibleEntrances.filter(e => e.difficulty <= 9 && e.difficulty <= maxDifficulty);
  } else if (difficultyPreference === 'medium') {
    // For medium, only include entrances with difficulty between 6 and 18 and <= maxDifficulty
    filteredEntrances = trick.possibleEntrances.filter(e => e.difficulty >= 6 && e.difficulty <= 18 && e.difficulty <= maxDifficulty);
  } else if (difficultyPreference === 'hard') {
    // For hard, only include entrances with difficulty >= 12 and <= maxDifficulty
    filteredEntrances = trick.possibleEntrances.filter(e => e.difficulty >= 12 && e.difficulty <= maxDifficulty);
  } else {
    // If no preference, include all entrances <= maxDifficulty
    filteredEntrances = trick.possibleEntrances.filter(e => e.difficulty <= maxDifficulty);
  }

  // If no entrances match the criteria, return null
  if (filteredEntrances.length === 0) {
    // 30% chance to not have an entrance at all
    if (Math.random() < 0.3) {
      return null;
    }
    // Otherwise, try to find any entrance that's below max difficulty
    filteredEntrances = trick.possibleEntrances.filter(e => e.difficulty <= maxDifficulty);
    if (filteredEntrances.length === 0) {
      return null;
    }
  }

  // Select a random entrance from the filtered list
  const randomIndex = Math.floor(Math.random() * filteredEntrances.length);
  return filteredEntrances[randomIndex];
};

export const getCompleteRandomTrick = (
  categories: TrickCategory[],
  difficultyPreference: 'easy' | 'medium' | 'hard' = 'medium',
  includeVariation: boolean = true,
  includeEntrance: boolean = true,
  maxDifficulty: number = 30
): { 
  trick: Trick; 
  variation: Variation | null; 
  entrance: Entrance | null; 
  totalDifficulty: number;
} => {
  // Filter tricks by the selected categories
  const filteredTricks = initialTricks.filter((trick) =>
    categories.includes(trick.category as TrickCategory)
  );

  if (filteredTricks.length === 0) {
    throw new Error('No tricks found for the selected categories');
  }

  // STRICT ENFORCEMENT: Filter tricks by max difficulty - if no tricks match,
  // find tricks with the lowest available difficulty even if above maxDifficulty
  const difficultyFilteredTricks = filteredTricks.filter(trick => trick.difficulty <= maxDifficulty);
  
  // If no tricks match the max difficulty, use the easiest tricks available
  let tricksToUse: Trick[];
  if (difficultyFilteredTricks.length > 0) {
    tricksToUse = difficultyFilteredTricks;
  } else {
    // This is a critical change - instead of ignoring maxDifficulty, we'll
    // still use the easiest available tricks, but will adjust their effective difficulty
    const easiestDifficulty = Math.min(...filteredTricks.map(t => t.difficulty));
    tricksToUse = filteredTricks.filter(t => t.difficulty === easiestDifficulty);
    
    // Log this situation for debugging
    console.warn(`No tricks found with difficulty <= ${maxDifficulty}. Using tricks with difficulty ${easiestDifficulty} instead.`);
  }

  // Weight tricks by popularity and difficulty preference
  const weightedTricks = tricksToUse.map(trick => {
    // Default popularity to 5 if not specified
    const popularity = trick.popularity || 5;
    
    // Calculate weight based on difficulty preference and popularity
    let weight = popularity;
    
    if (difficultyPreference === 'easy') {
      // For easy, favor easier tricks and popular tricks
      weight = popularity * (11 - trick.difficulty); // Higher weight for easier tricks
    } else if (difficultyPreference === 'medium') {
      // For medium, balance between difficulty and popularity
      weight = popularity * (6 - Math.abs(trick.difficulty - 5)); // Higher weight for medium difficulty
    } else if (difficultyPreference === 'hard') {
      // For hard, favor harder tricks but still consider popularity
      weight = popularity * (trick.difficulty); // Higher weight for harder tricks
    }
    
    return { trick, weight };
  });

  // Calculate total weight
  const totalWeight = weightedTricks.reduce((sum, item) => sum + item.weight, 0);
  
  // Select a random trick based on weights
  let randomValue = Math.random() * totalWeight;
  let selectedTrick: Trick | null = null;
  
  for (const item of weightedTricks) {
    randomValue -= item.weight;
    if (randomValue <= 0) {
      selectedTrick = item.trick;
      break;
    }
  }
  
  // Fallback in case weighted selection fails
  if (!selectedTrick) {
    const randomIndex = Math.floor(Math.random() * tricksToUse.length);
    selectedTrick = tricksToUse[randomIndex];
  }

  // Try to find a variation and entrance combination that keeps total difficulty under maxDifficulty
  let variation: Variation | null = null;
  let entrance: Entrance | null = null;
  
  // IMPORTANT: Cap the base trick difficulty at maxDifficulty for calculation purposes
  // This ensures the total difficulty respects maxDifficulty even if we had to use a trick
  // with higher than desired difficulty
  let totalDifficulty = Math.min(selectedTrick.difficulty, maxDifficulty);
  
  // First, try to get a variation if requested
  if (includeVariation && selectedTrick.variations && selectedTrick.variations.length > 0) {
    // Filter variations that would keep total difficulty under maxDifficulty
    const possibleVariations = selectedTrick.variations.filter(v => 
      (totalDifficulty + v.difficulty) <= maxDifficulty
    );
    
    if (possibleVariations.length > 0) {
      // Apply difficulty preference filter
      let filteredVariations = [...possibleVariations];
      
      if (difficultyPreference === 'easy') {
        const easyVariations = possibleVariations.filter(v => v.difficulty <= 9);
        if (easyVariations.length > 0) filteredVariations = easyVariations;
      } else if (difficultyPreference === 'medium') {
        const mediumVariations = possibleVariations.filter(v => v.difficulty >= 6 && v.difficulty <= 18);
        if (mediumVariations.length > 0) filteredVariations = mediumVariations;
      } else if (difficultyPreference === 'hard') {
        const hardVariations = possibleVariations.filter(v => v.difficulty >= 12);
        if (hardVariations.length > 0) filteredVariations = hardVariations;
      }
      
      // Select a random variation from filtered list
      const randomIndex = Math.floor(Math.random() * filteredVariations.length);
      variation = filteredVariations[randomIndex];
      totalDifficulty += variation.difficulty;
    }
  }
  
  // Then, try to get an entrance if requested and if there's still room under maxDifficulty
  if (includeEntrance && selectedTrick.possibleEntrances && selectedTrick.possibleEntrances.length > 0) {
    // Filter entrances that would keep total difficulty under maxDifficulty
    const possibleEntrances = selectedTrick.possibleEntrances.filter(e => 
      (totalDifficulty + e.difficulty) <= maxDifficulty
    );
    
    // 30% chance to not have an entrance at all for variety
    if (possibleEntrances.length > 0 && Math.random() > 0.3) {
      // Apply difficulty preference filter
      let filteredEntrances = [...possibleEntrances];
      
      if (difficultyPreference === 'easy') {
        const easyEntrances = possibleEntrances.filter(e => e.difficulty <= 9);
        if (easyEntrances.length > 0) filteredEntrances = easyEntrances;
      } else if (difficultyPreference === 'medium') {
        const mediumEntrances = possibleEntrances.filter(e => e.difficulty >= 6 && e.difficulty <= 18);
        if (mediumEntrances.length > 0) filteredEntrances = mediumEntrances;
      } else if (difficultyPreference === 'hard') {
        const hardEntrances = possibleEntrances.filter(e => e.difficulty >= 12);
        if (hardEntrances.length > 0) filteredEntrances = hardEntrances;
      }
      
      // Select a random entrance from filtered list
      const randomIndex = Math.floor(Math.random() * filteredEntrances.length);
      entrance = filteredEntrances[randomIndex];
      totalDifficulty += entrance.difficulty;
    }
  }
  
  // Ensure total difficulty never exceeds maxDifficulty (which defaults to 30 now)
  totalDifficulty = Math.min(maxDifficulty, totalDifficulty);

  return {
    trick: selectedTrick,
    variation,
    entrance,
    totalDifficulty
  };
};

export const getTricksByCategory = (category: string): Trick[] => {
  return initialTricks.filter(trick => trick.category === category);
};

export const getTrickById = (id: number): Trick | undefined => {
  return initialTricks.find(trick => trick.id === id);
};