import { Mission } from "@/types/game";

export const MISSIONS: Mission[] = [
  // ------------------------------------------------------------------ HOME
  {
    id: "m-home-01", locationId: "home", order: 1,
    title: "First Steps", description: "Talk to Grandma Rose before you head out.",
    npcId: "guide", dialogueId: "dlg-home-guide",
    questionIds: ["home-01", "home-02"],
    rewardXp: 40, rewardCoins: 20,
    unlocksVocabularyIds: ["v-hi"],
  },

  // ------------------------------------------------------------------ PARK
  {
    id: "m-park-01", locationId: "park", order: 1,
    title: "Meet Emma", description: "Introduce yourself to Emma at the park.",
    npcId: "emma", dialogueId: "dlg-park-emma-intro",
    questionIds: ["park-01", "park-02"],
    rewardXp: 50, rewardCoins: 20,
    unlocksVocabularyIds: ["v-name", "v-nice-meet", "v-friend"],
  },
  {
    id: "m-park-02", locationId: "park", order: 2,
    title: "Ask for Directions", description: "Ask Emma how to get around town.",
    npcId: "emma", dialogueId: "dlg-park-emma-directions",
    questionIds: ["park-03", "park-08"],
    rewardXp: 50, rewardCoins: 25,
    unlocksVocabularyIds: ["v-directions", "v-straight"],
  },
  {
    id: "m-park-03", locationId: "park", order: 3,
    title: "Make a Friend", description: "Practice greetings and grammar with Emma.",
    npcId: "emma",
    questionIds: ["park-04", "park-05", "park-06", "park-07"],
    rewardXp: 80, rewardCoins: 40,
    unlocksLocation: "market",
  },

  // ------------------------------------------------------------------ CAFE
  {
    id: "m-cafe-01", locationId: "cafe", order: 1,
    title: "Order a Drink", description: "Order your first coffee from James.",
    npcId: "james", dialogueId: "dlg-cafe-james-order",
    questionIds: ["cafe-order-01", "cafe-02"],
    rewardXp: 50, rewardCoins: 25,
    unlocksVocabularyIds: ["v-coffee", "v-order", "v-menu", "v-would-like"],
  },
  {
    id: "m-cafe-02", locationId: "cafe", order: 2,
    title: "Ask for the Price", description: "Practice asking about prices at the café.",
    npcId: "james",
    questionIds: ["cafe-03", "cafe-05"],
    rewardXp: 50, rewardCoins: 25,
  },
  {
    id: "m-cafe-03", locationId: "cafe", order: 3,
    title: "Pay the Bill", description: "Finish your visit and pay James.",
    npcId: "james", dialogueId: "dlg-cafe-james-bill",
    questionIds: ["cafe-04", "cafe-06", "cafe-07", "cafe-08"],
    rewardXp: 100, rewardCoins: 60,
    unlocksVocabularyIds: ["v-bill"],
    unlocksLocation: "school",
  },

  // ---------------------------------------------------------------- MARKET
  {
    id: "m-market-01", locationId: "market", order: 1,
    title: "Shop for Fruit", description: "Buy something fresh from Daniel.",
    npcId: "daniel", dialogueId: "dlg-market-daniel-shopping",
    questionIds: ["market-01", "market-02"],
    rewardXp: 50, rewardCoins: 25,
    unlocksVocabularyIds: ["v-price", "v-fresh", "v-how-much"],
  },
  {
    id: "m-market-02", locationId: "market", order: 2,
    title: "Ask for a Discount", description: "Try to get a better price from Daniel.",
    npcId: "daniel", dialogueId: "dlg-market-daniel-discount",
    questionIds: ["market-03", "market-06"],
    rewardXp: 50, rewardCoins: 25,
    unlocksVocabularyIds: ["v-cheap", "v-expensive"],
  },
  {
    id: "m-market-03", locationId: "market", order: 3,
    title: "Compare Prices", description: "Use comparatives to talk about prices.",
    npcId: "daniel",
    questionIds: ["market-04", "market-05", "market-07"],
    rewardXp: 90, rewardCoins: 45,
    unlocksLocation: "library",
  },

  // ---------------------------------------------------------------- SCHOOL
  {
    id: "m-school-01", locationId: "school", order: 1,
    title: "Start the Lesson", description: "Greet Sarah and begin class.",
    npcId: "sarah", dialogueId: "dlg-school-sarah-lesson",
    questionIds: ["school-01", "school-02"],
    rewardXp: 50, rewardCoins: 25,
    unlocksVocabularyIds: ["v-classroom", "v-question"],
  },
  {
    id: "m-school-02", locationId: "school", order: 2,
    title: "Do Grammar Practice", description: "Practice present simple sentences.",
    npcId: "sarah",
    questionIds: ["school-03", "school-04"],
    rewardXp: 50, rewardCoins: 25,
    unlocksVocabularyIds: ["v-homework", "v-understand"],
  },
  {
    id: "m-school-03", locationId: "school", order: 3,
    title: "Finish Homework", description: "Complete a harder grammar challenge.",
    npcId: "sarah",
    questionIds: ["school-05", "school-06", "school-07"],
    rewardXp: 100, rewardCoins: 60,
    unlocksLocation: "hospital",
  },

  // --------------------------------------------------------------- LIBRARY
  {
    id: "m-library-01", locationId: "library", order: 1,
    title: "Borrow a Book", description: "Ask Olivia to borrow a book.",
    npcId: "olivia", dialogueId: "dlg-library-olivia-borrow",
    questionIds: ["library-01", "library-02"],
    rewardXp: 50, rewardCoins: 25,
    unlocksVocabularyIds: ["v-book", "v-borrow", "v-quiet"],
  },
  {
    id: "m-library-02", locationId: "library", order: 2,
    title: "Return on Time", description: "Learn how to talk about returning books.",
    npcId: "olivia",
    questionIds: ["library-03", "library-04", "library-05", "library-06"],
    rewardXp: 90, rewardCoins: 45,
    unlocksVocabularyIds: ["v-return"],
    unlocksLocation: "hotel",
  },

  // -------------------------------------------------------------- HOSPITAL
  {
    id: "m-hospital-01", locationId: "hospital", order: 1,
    title: "Describe Symptoms", description: "Tell Dr. Robert how you feel.",
    npcId: "robert", dialogueId: "dlg-hospital-robert-checkup",
    questionIds: ["hospital-01", "hospital-02"],
    rewardXp: 50, rewardCoins: 25,
    unlocksVocabularyIds: ["v-headache", "v-doctor", "v-feel"],
  },
  {
    id: "m-hospital-02", locationId: "hospital", order: 2,
    title: "Follow the Doctor's Advice", description: "Practice more health vocabulary.",
    npcId: "robert",
    questionIds: ["hospital-03", "hospital-04", "hospital-05", "hospital-06", "hospital-07"],
    rewardXp: 100, rewardCoins: 60,
    unlocksVocabularyIds: ["v-appointment"],
  },

  // ----------------------------------------------------------------- HOTEL
  {
    id: "m-hotel-01", locationId: "hotel", order: 1,
    title: "Check In", description: "Check in with Michael at the front desk.",
    npcId: "michael", dialogueId: "dlg-hotel-michael-checkin",
    questionIds: ["hotel-01", "hotel-02"],
    rewardXp: 50, rewardCoins: 25,
    unlocksVocabularyIds: ["v-reservation", "v-check-in", "v-luggage"],
  },
  {
    id: "m-hotel-02", locationId: "hotel", order: 2,
    title: "Ask About the Room", description: "Ask Michael about your room.",
    npcId: "michael",
    questionIds: ["hotel-03", "hotel-04"],
    rewardXp: 50, rewardCoins: 25,
    unlocksVocabularyIds: ["v-room"],
  },
  {
    id: "m-hotel-03", locationId: "hotel", order: 3,
    title: "Request a Wake-up Call", description: "Finish your stay like a pro traveler.",
    npcId: "michael",
    questionIds: ["hotel-05", "hotel-06", "hotel-07"],
    rewardXp: 120, rewardCoins: 70,
  },
];

export function missionsByLocation(locationId: string): Mission[] {
  return MISSIONS.filter((m) => m.locationId === locationId).sort((a, b) => a.order - b.order);
}

export function missionById(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}

/** The next incomplete mission for a location, respecting order. */
export function nextMissionFor(locationId: string, completedIds: string[]): Mission | undefined {
  return missionsByLocation(locationId).find((m) => !completedIds.includes(m.id));
}
