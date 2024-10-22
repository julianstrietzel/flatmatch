// Define the type for a tag
type Tag = {
  name: string;
  category: "Recommended" | "Extra" | "Documents" | "Personality";
};

// List of tags separated into categories
export const tags: Tag[] = [
  // Recommended Flat Tags
  { name: "Kitchen", category: "Recommended" },
  { name: "Elevator", category: "Recommended" },
  { name: "Guest toilet", category: "Recommended" },
  { name: "Balcony/Terrace", category: "Recommended" },
  { name: "Cellar", category: "Recommended" },
  { name: "Garden/shared use", category: "Recommended" },
  { name: "Barrier-free access", category: "Recommended" },
  { name: "Old-building", category: "Recommended" },
  { name: "Suitable for shared apartment", category: "Recommended" },
  { name: "Pets", category: "Recommended" },

  // Extra Tags
  { name: "Parking Available", category: "Extra" },
  { name: "Rooftop Access", category: "Extra" },
  { name: "Nearby Fitness Center", category: "Extra" },
  { name: "High-speed Internet", category: "Extra" },
  { name: "Public Transport Nearby", category: "Extra" },
  { name: "Furnished", category: "Extra" },

  // Document Tags from the Image
  { name: "Income Verification", category: "Documents" },
  { name: "Guarantor", category: "Documents" },
  { name: "Home insurance", category: "Documents" },
  { name: "Rental History", category: "Documents" },
  { name: "SCHUFA", category: "Documents" },
  { name: "Previous Landlord Reference", category: "Documents" },

  // Personality tags
  { name: "Early Bird", category: "Personality" },
  { name: "Bookworm", category: "Personality" },
  { name: "Tech Savvy", category: "Personality" },
  { name: "Social", category: "Personality" },
  { name: "Gamer", category: "Personality" },
  { name: "Photographer", category: "Personality" },
  { name: "Nature Lover", category: "Personality" },
  { name: "Multilingual", category: "Personality" },
  { name: "Student", category: "Personality" },
  { name: "Blogger/Vlogger", category: "Personality" },
  { name: "Fitness Enthusiast", category: "Personality" },
  { name: "Music Lover", category: "Personality" },
  { name: "Foodie", category: "Personality" },
  { name: "Travel Buff", category: "Personality" },
  { name: "Animal Lover", category: "Personality" },
  { name: "DIY Expert", category: "Personality" },
  { name: "Art Aficionado", category: "Personality" },
  { name: "History Buff", category: "Personality" },
  { name: "Science Geek", category: "Personality" },
  { name: "Fashionista", category: "Personality" },
  { name: "Green Thumb", category: "Personality" },
  { name: "Volunteer", category: "Personality" },
  { name: "Fitness Guru", category: "Personality" },
  { name: "Movie Buff", category: "Personality" },
  { name: "Health Nut", category: "Personality" },
  { name: "Minimalist", category: "Personality" },
  { name: "Pet Owner", category: "Personality" },
  { name: "Baker", category: "Personality" },
  { name: "Chef", category: "Personality" },
  { name: "Entrepreneur", category: "Personality" },
];

export default tags;
