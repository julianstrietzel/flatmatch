interface Flat {
  id: string;
  name: string;
  imageUrl: string;
}

interface User {
  id: string;
  name: string;
  profileImage: string;
  images: string[];
  tags: string[];
  header: string;
  about: string;
  possibleFlats: string[];
  matchedFlats: string[];
  emailConfirmed: boolean;
}

const mockFlats: Flat[] = [
  {
    id: "1",
    name: "Richardstr. 31",
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: "2",
    name: "Gudrunstr. 31",
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: "3",
    name: "Karlstr. 31",
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: "4",
    name: "Hansstr. 31",
    imageUrl: "https://via.placeholder.com/100",
  },
];

const mockUsers: User[] = [
  {
    id: "1",
    name: "Tom",
    profileImage: "https://eu.ui-avatars.com/api/?name=Tom+Tucker&size=250",
    images: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/200",
      "https://via.placeholder.com/250",
    ],
    tags: [
      "Employed",
      "Cat Owner",
      "Non-Smoker",
      "Early Bird",
      "Gym Member",
      "Healthy",
      "Social",
      "Traveler",
      "Tech Savvy",
      "Pet Friendly",
    ],
    header: "Looking for a cozy flat",
    about:
      "I am Tom, an employed individual with a love for cats. I don't smoke and prefer to wake up early. I am looking for a cozy flat in a quiet neighborhood.",
    possibleFlats: ["66957cbd4694071f12857e51"],
    matchedFlats: [],
    emailConfirmed: true,
  },
  {
    id: "2",
    name: "Clara",
    profileImage: "https://eu.ui-avatars.com/api/?name=Clara+Hagelson&size=250",
    images: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/200",
      "https://via.placeholder.com/250",
    ],
    tags: [
      "Student",
      "Guarantor",
      "Car Owner",
      "Long-Term",
      "Book Lover",
      "Music Enthusiast",
      "Vegetarian",
      "Non-Smoker",
      "Organized",
      "Quiet",
    ],
    header: "Searching for a long-term rental",
    about:
      "I am Clara, a student with a guarantor. I own a car and am looking for a long-term rental. I am responsible and quiet, perfect for a stable living environment.",
    possibleFlats: ["66957cbd4694071f12857e51"],
    matchedFlats: [],
    emailConfirmed: false,
  },
  {
    id: "3",
    name: "Mert",
    profileImage: "https://eu.ui-avatars.com/api/?name=Mert+Abi&size=250",
    images: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/200",
      "https://via.placeholder.com/250",
    ],
    tags: [
      "Student",
      "Smoker",
      "No Pets",
      "Frequently Travels",
      "Night Owl",
      "Flexible",
      "Adventurous",
      "Easygoing",
      "Party Goer",
      "Gamer",
    ],
    header: "Need a place for a frequent traveler",
    about:
      "I am Mert, a student who smokes and has no pets. I travel frequently and need a place to stay when I'm in town. Looking for a flexible and understanding landlord.",
    possibleFlats: ["66957cbd4694071f12857e51"],
    matchedFlats: [],
    emailConfirmed: true,
  },
  {
    id: "4",
    name: "Alice",
    profileImage:
      "https://eu.ui-avatars.com/api/?name=Alice+Wonderland&size=250",
    images: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/200",
      "https://via.placeholder.com/250",
    ],
    tags: [
      "Employed",
      "Non-Smoker",
      "No Pets",
      "Early Bird",
      "Quiet",
      "Clean",
      "Organized",
      "Vegetarian",
      "Social",
      "Tech Savvy",
    ],
    header: "Seeking a quiet and clean place",
    about:
      "I am Alice, an employed individual who doesn't smoke or have pets. I wake up early and am very quiet. I am looking for a clean and organized place to live.",
    possibleFlats: ["66957cbd4694071f12857e51"],
    matchedFlats: [],
    emailConfirmed: false,
  },
  {
    id: "5",
    name: "John",
    profileImage: "https://eu.ui-avatars.com/api/?name=John+Doe&size=250",
    images: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/200",
      "https://via.placeholder.com/250",
    ],
    tags: [
      "Employed",
      "Non-Smoker",
      "No Pets",
      "Early Bird",
      "Quiet",
      "Clean",
      "Organized",
      "Vegetarian",
      "Social",
      "Tech Savvy",
    ],
    header: "Seeking a quiet and clean place",
    about:
      "I am John, an employed individual who doesn't smoke or have pets. I wake up early and am very quiet. I am looking for a clean and organized place to live.",
    possibleFlats: ["66957cbd4694071f12857e51"],
    matchedFlats: [],
    emailConfirmed: true,
  },
];

export { mockFlats, mockUsers };
export type { Flat, User };
