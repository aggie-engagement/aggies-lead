export type CampusNavigationPerson = {
  name: string;
  title: string;
  headshot: string;
};

export type CampusNavigationLocation = {
  id: string;
  folderName: string;
  locationName: string;
  nickname: string;
  description: string;
  exteriorImage: string;
  mapImage: string;
  additionalImages: string[];
  buildingDetails: string;
  peopleToKnow: CampusNavigationPerson[];
};

const imageBase = "/images/campus-navigation";

export const campusNavigationLocations: CampusNavigationLocation[] = [
  {
    id: "laub",
    folderName: "laub",
    locationName: "Jim and Carol Laub Athletics-Academic Center",
    nickname: "the stadium",
    description:
      'Often referred to as "the stadium," the Jim and Carol Laub Athletics-Academic Center is home to many of the primary resources and support services available to Utah State student-athletes.',
    exteriorImage: `${imageBase}/laub/laub-exterior.jpg`,
    mapImage: `${imageBase}/laub/laub-map.jpg`,
    additionalImages: [],
    buildingDetails:
      "1st Floor\n- Training Room (Dr. Trevor Short and Sports Medicine)\n- Equipment Room\n- Football Locker Room\n\n2nd Floor\n- Spetman Auditorium\n- Freshman Connections Classes\n- SAAC Meetings\n- Special Events and Guest Speakers\n- Football Offices\n\n3rd Floor\n- Study Hall\n- Academic Services (Justice Smith)\n- Track & Field Offices (Artie Gulden)\n- Aggie Engagement Offices (Isaiah Jones)\n- Compliance Offices (Tony Hearrell)",
    peopleToKnow: [
      {
        name: "Tony Hearrell",
        title: "Senior Associate AD, Compliance & Student-Athlete Services",
        headshot: `${imageBase}/laub/tony-hearrell-headshot.jpg`,
      },
      {
        name: "Justice Smith",
        title: "Associate AD, Academic Services",
        headshot: `${imageBase}/laub/justice-smith-headshot.jpg`,
      },
      {
        name: "Isaiah Jones",
        title: "Associate AD, Aggie Engagement",
        headshot: `${imageBase}/laub/isaiah-jones-headshot.jpg`,
      },
      {
        name: "Dr. Trevor Short",
        title: "Senior Associate AD, Health, Wellness and Performance",
        headshot: `${imageBase}/laub/trevor-short-headshot.jpg`,
      },
      {
        name: "Artie Gulden",
        title: "Head Coach, Track & Field and Cross Country",
        headshot: `${imageBase}/laub/artie-gulden-headshot.jpg`,
      },
      {
        name: "Bronco Mendenhall",
        title: "Head Coach, Football",
        headshot: `${imageBase}/laub/bronco-mendenhall-headshot.jpg`,
      },
    ],
  },
  {
    id: "icon",
    folderName: "icon",
    locationName: "ICON",
    nickname: "the weight room",
    description:
      'Often referred to as "the weight room," ICON serves as the primary strength and conditioning facility for Utah State student-athletes. The facility offers a variety of weight training equipment, recovery resources, and protein shakes. Student-athletes interested in using the facility outside of scheduled team activities must receive approval from [Insert Name].',
    exteriorImage: `${imageBase}/icon/icon-exterior.jpg`,
    mapImage: `${imageBase}/icon/icon-map.jpg`,
    additionalImages: [],
    buildingDetails:
      'Often referred to as "the weight room," ICON serves as the primary strength and conditioning facility for Utah State student-athletes. The facility offers a variety of weight training equipment, recovery resources, and protein shakes. Student-athletes interested in using the facility outside of scheduled team activities must receive approval from [Insert Name].',
    peopleToKnow: [],
  },
  {
    id: "fueling-station",
    folderName: "fueling-station",
    locationName: "Fueling Station",
    nickname: "fueling",
    description:
      'Often referred to as "fueling," the Fueling Station provides student-athletes with access to nutritious food and beverages before and after training, practices, and competitions. Available exclusively to student-athletes, the Fueling Station offers a variety of options designed to support performance, energy, recovery, and overall wellness.',
    exteriorImage: `${imageBase}/fueling-station/fueling-station-exterior.jpg`,
    mapImage: `${imageBase}/fueling-station/fueling-station-map.jpg`,
    additionalImages: [],
    buildingDetails:
      'Often referred to as "fueling," the Fueling Station provides student-athletes with access to nutritious food and beverages before and after training, practices, and competitions. Available exclusively to student-athletes, the Fueling Station offers a variety of options designed to support performance, energy, recovery, and overall wellness.',
    peopleToKnow: [
      {
        name: "Natalie Norris",
        title: "Director of Sports Nutrition",
        headshot: `${imageBase}/fueling-station/natalie-norris-headshot.jpg`,
      },
    ],
  },
  {
    id: "olympic-complex",
    folderName: "olympic-complex",
    locationName: "Olympic Complex & Student Health",
    nickname: "Olympic Complex",
    description:
      "The Olympic Complex is home to several Olympic sport offices and locker rooms, including soccer, softball, and tennis. Connected to the facility is the Student Health and Wellness Center, which serves all Utah State students by providing medical care, wellness resources, and mental health support. This is also where Olivia Huffman, Director of Mental Wellness, is located.",
    exteriorImage: `${imageBase}/olympic-complex/olympic-complex-exterior.jpg`,
    mapImage: `${imageBase}/olympic-complex/olympic-complex-map.jpg`,
    additionalImages: [
      `${imageBase}/olympic-complex/student-health-exterior.jpg`,
      `${imageBase}/olympic-complex/student-health-map.jpg`,
    ],
    buildingDetails:
      "The Olympic Complex is home to several Olympic sport offices and locker rooms, including soccer, softball, and tennis. Connected to the facility is the Student Health and Wellness Center, which serves all Utah State students by providing medical care, wellness resources, and mental health support. This is also where Olivia Huffman, Director of Mental Wellness, is located.",
    peopleToKnow: [
      {
        name: "Manny Martins",
        title: "Head Coach, Soccer",
        headshot: `${imageBase}/olympic-complex/manny-martins-headshot.jpg`,
      },
      {
        name: "Shelby Thompson",
        title: "Interim Head Coach, Softball",
        headshot: `${imageBase}/olympic-complex/shelby-thompson-headshot.jpg`,
      },
      {
        name: "Aaron Paajanen",
        title: "Head Coach, Men's Tennis",
        headshot: `${imageBase}/olympic-complex/aaron-paajanen-headshot.jpg`,
      },
      {
        name: "Veronika Golanova",
        title: "Head Coach, Women's Tennis",
        headshot: `${imageBase}/olympic-complex/veronika-golanova-headshot.jpg`,
      },
      {
        name: "Olivia Huffman",
        title: "Director of Mental Wellness",
        headshot: `${imageBase}/olympic-complex/olivia-huffman-headshot.jpg`,
      },
    ],
  },
  {
    id: "west-stadium",
    folderName: "west-stadium",
    locationName: "West Stadium Center",
    nickname: "the west stadium",
    description:
      'Often referred to as the "West Stadium" or the "WSC," the West Stadium Center hosts a variety of student-athlete and university events. The third floor is commonly used for career fairs, alumni events, networking opportunities, guest speakers, leadership programming, and other special events throughout the year.',
    exteriorImage: `${imageBase}/west-stadium/west-stadium-exterior.jpg`,
    mapImage: `${imageBase}/west-stadium/west-stadium-map.jpg`,
    additionalImages: [],
    buildingDetails:
      'Often referred to as the "West Stadium" or the "WSC," the West Stadium Center hosts a variety of student-athlete and university events. The third floor is commonly used for career fairs, alumni events, networking opportunities, guest speakers, leadership programming, and other special events throughout the year.',
    peopleToKnow: [],
  },
  {
    id: "indoor-laub",
    folderName: "indoor-laub",
    locationName: "Stan Laub Indoor Training Center",
    nickname: "the indoor",
    description:
      'Often referred to as "the indoor," the Stan Laub Indoor Training Center serves as Utah State Athletics\' primary indoor practice facility. Many teams utilize the facility throughout the year, particularly during the winter months when outdoor conditions are limited.',
    exteriorImage: `${imageBase}/indoor-laub/indoor-laub-interior.jpg`,
    mapImage: `${imageBase}/indoor-laub/indoor-laub-map.jpg`,
    additionalImages: [],
    buildingDetails:
      'Often referred to as "the indoor," the Stan Laub Indoor Training Center serves as Utah State Athletics\' primary indoor practice facility. Many teams utilize the facility throughout the year, particularly during the winter months when outdoor conditions are limited.',
    peopleToKnow: [],
  },
  {
    id: "spectrum",
    folderName: "spectrum",
    locationName: "Dee Glen Smith Spectrum",
    nickname: "the spec",
    description:
      'Often referred to as "the Spec," the Dee Glen Smith Spectrum is home to Utah State Basketball and Gymnastics and occasionally hosts Volleyball events.',
    exteriorImage: `${imageBase}/spectrum/spectrum-exterior.jpg`,
    mapImage: `${imageBase}/spectrum/spectrum-map.jpg`,
    additionalImages: [],
    buildingDetails:
      "1st Floor\n- Ticketing Offices\n- Locker Rooms\n\n2nd Floor\n- Main Athletics Offices\n- Senior Administration Offices (Cameron Walker)\n- Marketing & Creative Content\n- Business Services\n\n3rd Floor\n- Gymnastics Coaches Offices (Kristin White)",
    peopleToKnow: [
      {
        name: "Cameron Walker",
        title: "Vice President and Director of Athletics",
        headshot: `${imageBase}/spectrum/cameron-walker-headshot.jpg`,
      },
      {
        name: "Kristin White",
        title: "Head Coach, Gymnastics",
        headshot: `${imageBase}/spectrum/kristin-white-headshot.jpg`,
      },
    ],
  },
  {
    id: "wayne-estes",
    folderName: "wayne-estes",
    locationName: "Wayne Estes Center",
    nickname: "the Estes",
    description:
      'Often referred to as "the Estes," the Wayne Estes Center serves as the home venue for Utah State Volleyball and houses the offices of the Men\'s Basketball, Women\'s Basketball, and Volleyball coaching staffs.',
    exteriorImage: `${imageBase}/wayne-estes/wayne-estes-exterior.jpg`,
    mapImage: `${imageBase}/wayne-estes/wayne-estes-map.jpg`,
    additionalImages: [],
    buildingDetails:
      'Often referred to as "the Estes," the Wayne Estes Center serves as the home venue for Utah State Volleyball and houses the offices of the Men\'s Basketball, Women\'s Basketball, and Volleyball coaching staffs.',
    peopleToKnow: [
      {
        name: "Ben Jacobsen",
        title: "Head Coach, Men's Basketball",
        headshot: `${imageBase}/wayne-estes/ben-jacobsen-headshot.jpg`,
      },
      {
        name: "Wesley Brooks",
        title: "Head Coach, Women's Basketball",
        headshot: `${imageBase}/wayne-estes/wesley-brooks-headshot.jpg`,
      },
      {
        name: "Keith Smith",
        title: "Head Coach, Volleyball",
        headshot: `${imageBase}/wayne-estes/keith-smith-headshot.jpg`,
      },
    ],
  },
  {
    id: "tsc",
    folderName: "tsc",
    locationName: "Taggart Student Center",
    nickname: "TSC",
    description:
      "The Taggart Student Center, commonly referred to as the TSC, is one of the main student hubs on campus. The building includes the Campus Store, Admissions, Student Media, the Marketplace, meeting spaces, dining options, and a variety of student resources and services.",
    exteriorImage: `${imageBase}/tsc/tsc-exterior.jpg`,
    mapImage: `${imageBase}/tsc/tsc-map.jpg`,
    additionalImages: [],
    buildingDetails:
      "The Taggart Student Center, commonly referred to as the TSC, is one of the main student hubs on campus. The building includes the Campus Store, Admissions, Student Media, the Marketplace, meeting spaces, dining options, and a variety of student resources and services.",
    peopleToKnow: [],
  },
  {
    id: "hper",
    folderName: "hper",
    locationName: "HPER / ARC",
    nickname: "",
    description:
      "The ARC, also known as the Aggie Recreation Center, serves as the university's primary recreation and fitness facility. The HPER building is home to the Ray Corn Gymnastics Training Facility and includes swimming pools, basketball courts, racquetball courts, locker rooms, and additional recreational spaces for students.",
    exteriorImage: `${imageBase}/hper/arc-exterior.jpg`,
    mapImage: `${imageBase}/hper/hper-arc-map.jpg`,
    additionalImages: [`${imageBase}/hper/hper-exterior.jpg`],
    buildingDetails:
      "The ARC, also known as the Aggie Recreation Center, serves as the university's primary recreation and fitness facility. The HPER building is home to the Ray Corn Gymnastics Training Facility and includes swimming pools, basketball courts, racquetball courts, locker rooms, and additional recreational spaces for students.",
    peopleToKnow: [],
  },
  {
    id: "library",
    folderName: "library",
    locationName: "Library / Testing Center",
    nickname: "",
    description:
      "The Merrill-Cazier Library serves as Utah State University's main library and provides study spaces, research support, tutoring resources, and academic assistance. The Testing Center is frequently used by student-athletes for accommodated exams. Be sure to schedule exams well in advance, especially during midterms and finals, as appointment times fill quickly.",
    exteriorImage: `${imageBase}/library/library-exterior.jpg`,
    mapImage: `${imageBase}/library/library-map.jpg`,
    additionalImages: [`${imageBase}/library/testing-center-map.jpg`],
    buildingDetails:
      "The Merrill-Cazier Library serves as Utah State University's main library and provides study spaces, research support, tutoring resources, and academic assistance. The Testing Center is frequently used by student-athletes for accommodated exams. Be sure to schedule exams well in advance, especially during midterms and finals, as appointment times fill quickly.",
    peopleToKnow: [],
  },
  {
    id: "old-main",
    folderName: "old-main",
    locationName: "Old Main",
    nickname: "",
    description:
      'Old Main is the oldest building on Utah State University\'s campus and remains one of its most recognizable landmarks. Fun fact: the iconic "A" on Old Main lights up blue whenever a Utah State Athletics team wins. The Quad surrounding Old Main hosts many campus traditions, events, activities, and student gatherings throughout the year.',
    exteriorImage: `${imageBase}/old-main/old-main-quad-exterior.jpg`,
    mapImage: `${imageBase}/old-main/old-main-quad-map.jpg`,
    additionalImages: [],
    buildingDetails:
      'Old Main is the oldest building on Utah State University\'s campus and remains one of its most recognizable landmarks. Fun fact: the iconic "A" on Old Main lights up blue whenever a Utah State Athletics team wins. The Quad surrounding Old Main hosts many campus traditions, events, activities, and student gatherings throughout the year.',
    peopleToKnow: [],
  },
];
