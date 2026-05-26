const slug = (value) => String(value).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const expandedQuestion = (id, category, difficulty, question, choices, correctIndex, explanation, media = null) => ({
  id,
  category,
  difficulty,
  question,
  choices,
  correctIndex,
  explanation,
  ...(media || {})
});

const expandedImage = (folder, name, alt, caption = "Visual clue", extension = "jpg") => ({
  mediaType: "image",
  imageUrl: `/images/questions/${folder}/${slug(name)}.${extension}`,
  imageAlt: alt,
  imageCaption: caption
});

function choicesFor(correct, pool, offset = 0) {
  const distractors = pool.filter((item) => item !== correct);
  const picked = [];
  let index = offset % distractors.length;
  while (picked.length < 3) {
    const item = distractors[index % distractors.length];
    if (!picked.includes(item)) picked.push(item);
    index += 7;
  }
  const insertAt = offset % 4;
  const choices = [...picked];
  choices.splice(insertAt, 0, correct);
  return { choices, correctIndex: insertAt };
}

function fromFacts(prefix, category, facts) {
  return facts.map((fact, index) => expandedQuestion(
    `${prefix}-${String(index + 1).padStart(3, "0")}`,
    category,
    fact.difficulty || "Medium",
    fact.question,
    fact.choices,
    fact.correctIndex,
    fact.explanation,
    fact.media || null
  ));
}

const countries = [
  "France", "Germany", "Italy", "Spain", "Portugal", "Netherlands", "Belgium", "Switzerland", "Austria", "Sweden",
  "Norway", "Denmark", "Finland", "Ireland", "United Kingdom", "Greece", "Turkey", "Poland", "Czech Republic", "Hungary",
  "Romania", "Croatia", "Serbia", "Bulgaria", "Ukraine", "Iceland", "Morocco", "Egypt", "South Africa", "Kenya",
  "Nigeria", "Ghana", "Japan", "South Korea", "China", "India", "Thailand", "Vietnam", "Indonesia", "Philippines",
  "Australia", "New Zealand", "Canada", "United States", "Mexico", "Brazil", "Argentina", "Chile", "Peru", "Colombia",
  "Jamaica", "Saudi Arabia", "United Arab Emirates", "Qatar", "Israel", "Singapore", "Malaysia", "Pakistan", "Nepal", "Sri Lanka"
];

const capitals = [
  ["France", "Paris"], ["Germany", "Berlin"], ["Italy", "Rome"], ["Spain", "Madrid"], ["Portugal", "Lisbon"], ["Netherlands", "Amsterdam"],
  ["Belgium", "Brussels"], ["Switzerland", "Bern"], ["Austria", "Vienna"], ["Sweden", "Stockholm"], ["Norway", "Oslo"], ["Denmark", "Copenhagen"],
  ["Finland", "Helsinki"], ["Ireland", "Dublin"], ["Greece", "Athens"], ["Turkey", "Ankara"], ["Poland", "Warsaw"], ["Czech Republic", "Prague"],
  ["Hungary", "Budapest"], ["Romania", "Bucharest"], ["Croatia", "Zagreb"], ["Serbia", "Belgrade"], ["Bulgaria", "Sofia"], ["Ukraine", "Kyiv"],
  ["Iceland", "Reykjavik"], ["Morocco", "Rabat"], ["Egypt", "Cairo"], ["South Africa", "Pretoria"], ["Kenya", "Nairobi"], ["Nigeria", "Abuja"],
  ["Ghana", "Accra"], ["Japan", "Tokyo"], ["South Korea", "Seoul"], ["China", "Beijing"], ["India", "New Delhi"], ["Thailand", "Bangkok"],
  ["Vietnam", "Hanoi"], ["Indonesia", "Jakarta"], ["Philippines", "Manila"], ["Australia", "Canberra"], ["New Zealand", "Wellington"],
  ["Canada", "Ottawa"], ["United States", "Washington, D.C."], ["Mexico", "Mexico City"], ["Brazil", "Brasilia"], ["Argentina", "Buenos Aires"],
  ["Chile", "Santiago"], ["Peru", "Lima"], ["Colombia", "Bogota"], ["Jamaica", "Kingston"], ["Saudi Arabia", "Riyadh"], ["Qatar", "Doha"],
  ["Israel", "Jerusalem"], ["Singapore", "Singapore"], ["Malaysia", "Kuala Lumpur"], ["Pakistan", "Islamabad"], ["Nepal", "Kathmandu"],
  ["Sri Lanka", "Sri Jayawardenepura Kotte"], ["United Arab Emirates", "Abu Dhabi"], ["United Kingdom", "London"]
];

const cityCountries = [
  ["Barcelona", "Spain"], ["Munich", "Germany"], ["Milan", "Italy"], ["Porto", "Portugal"], ["Rotterdam", "Netherlands"], ["Zurich", "Switzerland"],
  ["Salzburg", "Austria"], ["Gothenburg", "Sweden"], ["Bergen", "Norway"], ["Aarhus", "Denmark"], ["Cork", "Ireland"], ["Thessaloniki", "Greece"],
  ["Krakow", "Poland"], ["Split", "Croatia"], ["Marrakech", "Morocco"], ["Alexandria", "Egypt"], ["Cape Town", "South Africa"], ["Osaka", "Japan"],
  ["Busan", "South Korea"], ["Shanghai", "China"], ["Mumbai", "India"], ["Chiang Mai", "Thailand"], ["Bali", "Indonesia"], ["Melbourne", "Australia"],
  ["Vancouver", "Canada"], ["Rio de Janeiro", "Brazil"], ["Medellin", "Colombia"], ["Cusco", "Peru"], ["Dubai", "United Arab Emirates"], ["Lahore", "Pakistan"]
];

const landmarks = [
  ["Eiffel Tower", "France"], ["Colosseum", "Italy"], ["Sagrada Familia", "Spain"], ["Big Ben", "United Kingdom"], ["Acropolis", "Greece"],
  ["Neuschwanstein Castle", "Germany"], ["Christ the Redeemer", "Brazil"], ["Machu Picchu", "Peru"], ["Great Wall", "China"], ["Taj Mahal", "India"],
  ["Sydney Opera House", "Australia"], ["Mount Fuji", "Japan"], ["Petra", "Jordan"], ["Pyramids of Giza", "Egypt"], ["Burj Khalifa", "United Arab Emirates"],
  ["Chichen Itza", "Mexico"], ["Table Mountain", "South Africa"], ["Statue of Liberty", "United States"], ["CN Tower", "Canada"], ["Angkor Wat", "Cambodia"],
  ["Brandenburg Gate", "Germany"], ["Tower Bridge", "United Kingdom"], ["Rialto Bridge", "Italy"], ["Blue Mosque", "Turkey"], ["Hagia Sophia", "Turkey"],
  ["Louvre Pyramid", "France"], ["Stonehenge", "United Kingdom"], ["Golden Gate Bridge", "United States"], ["Forbidden City", "China"], ["Grand Palace", "Thailand"]
];

function geographyQuestions() {
  const capitalPool = capitals.map(([, capital]) => capital);
  const capitalQuestions = capitals.map(([country, capital], index) => {
    const { choices, correctIndex } = choicesFor(capital, capitalPool, index);
    return expandedQuestion(`geo-cap-${String(index + 1).padStart(3, "0")}`, "Geography", index % 3 === 0 ? "Easy" : "Medium", `What is the capital of ${country}?`, choices, correctIndex, `${capital} is the capital of ${country}.`);
  });
  const flagQuestions = countries.map((country, index) => {
    const { choices, correctIndex } = choicesFor(country, countries, index + 2);
    return expandedQuestion(`geo-flag-${String(index + 1).padStart(3, "0")}`, "Geography", index % 4 === 0 ? "Easy" : "Medium", "Which country does this flag belong to?", choices, correctIndex, `That is the flag of ${country}.`, expandedImage("geography", `${country}-flag`, `Flag of ${country}`, "Flag clue", "svg"));
  });
  const cityPool = [...new Set(cityCountries.map(([, country]) => country))];
  const cityQuestions = cityCountries.map(([city, country], index) => {
    const { choices, correctIndex } = choicesFor(country, cityPool, index + 4);
    return expandedQuestion(`geo-city-${String(index + 1).padStart(3, "0")}`, "Geography", "Easy", `Which country is ${city} in?`, choices, correctIndex, `${city} is in ${country}.`);
  });
  const landmarkPool = [...new Set(landmarks.map(([, country]) => country))];
  const landmarkQuestions = landmarks.map(([landmark, country], index) => {
    const { choices, correctIndex } = choicesFor(country, landmarkPool, index + 5);
    return expandedQuestion(`geo-landmark-${String(index + 1).padStart(3, "0")}`, "Geography", index % 4 === 0 ? "Hard" : "Medium", "Which place is shown here?", choices, correctIndex, `${landmark} is in ${country}.`, expandedImage("landmarks", landmark, `${landmark} visual clue`, "Landmark clue"));
  });
  return [...capitalQuestions, ...flagQuestions, ...cityQuestions, ...landmarkQuestions];
}

const sportsFacts = [
  ["Which sport has wickets and overs?", ["Cricket", "Tennis", "Golf", "Boxing"], 0, "Cricket uses wickets and overs."],
  ["Which sport has a scrum?", ["Rugby", "Baseball", "Curling", "Badminton"], 0, "Scrums are part of rugby."],
  ["Which sport uses a pommel horse?", ["Gymnastics", "Fencing", "Rowing", "Cycling"], 0, "The pommel horse is a gymnastics apparatus."],
  ["Which sport has a goalie crease on ice?", ["Ice hockey", "Handball", "Lacrosse", "Water polo"], 0, "Ice hockey has a goalie crease."],
  ["Which sport has birdies and eagles?", ["Golf", "Darts", "Bowling", "Squash"], 0, "Birdies and eagles are golf scores."],
  ["Which sport is associated with the Ryder Cup?", ["Golf", "Basketball", "Rugby", "Sailing"], 0, "The Ryder Cup is a golf event."],
  ["Which sport uses a foil, epee, or sabre?", ["Fencing", "Boxing", "Archery", "Judo"], 0, "Those are fencing weapons."],
  ["Which sport has a libero position?", ["Volleyball", "Football", "Cricket", "Hockey"], 0, "Volleyball has a libero."],
  ["Which sport uses a shuttlecock?", ["Badminton", "Tennis", "Squash", "Padel"], 0, "Badminton uses a shuttlecock."],
  ["Which sport is famous for the Monaco Grand Prix?", ["Formula 1", "MotoGP", "Rally", "Cycling"], 0, "Monaco is a classic Formula 1 race."],
  ["Which sport has an oche?", ["Darts", "Snooker", "Bowling", "Curling"], 0, "Darts players throw from the oche."],
  ["Which sport has a velodrome?", ["Track cycling", "Swimming", "Skating", "Skiing"], 0, "Velodromes are for track cycling."],
  ["Which sport has a green jacket as a famous prize?", ["Golf", "Tennis", "Boxing", "Baseball"], 0, "The Masters winner gets a green jacket."],
  ["Which sport uses a ruck?", ["Rugby", "Basketball", "Tennis", "Baseball"], 0, "Rucks happen in rugby."],
  ["Which sport has a Stanley Cup?", ["Ice hockey", "Basketball", "Football", "Baseball"], 0, "The Stanley Cup is hockey's famous trophy."],
  ["Which sport uses the term deuce?", ["Tennis", "Rowing", "Skiing", "Cycling"], 0, "Deuce is a tennis score."],
  ["Which sport has a decathlon?", ["Athletics", "Swimming", "Boxing", "Fencing"], 0, "The decathlon is an athletics event."],
  ["Which sport is played on a diamond?", ["Baseball", "Rugby", "Basketball", "Hockey"], 0, "Baseball is played on a diamond."],
  ["Which sport has touchdowns?", ["American football", "Cricket", "Golf", "Tennis"], 0, "Touchdowns are scored in American football."],
  ["Which sport has a butterfly stroke?", ["Swimming", "Boxing", "Cycling", "Sailing"], 0, "Butterfly is a swimming stroke."]
];

function repeatedFacts(prefix, category, facts, target, difficulty = "Medium") {
  const openers = ["Quick one: ", "Speed round: ", "No overthinking: ", "Party check: ", "Protect your streak: ", "Fast fingers: ", "For the bragging rights: ", "Room check: "];
  const questions = [];
  for (let index = 0; questions.length < target; index += 1) {
    const fact = facts[index % facts.length];
    const rotate = index % 4;
    const opener = openers[Math.floor(index / facts.length) % openers.length];
    const choices = [...fact[1]];
    const correct = choices.splice(fact[2], 1)[0];
    choices.splice(rotate, 0, correct);
    questions.push(expandedQuestion(`${prefix}-${String(index + 1).padStart(3, "0")}`, category, index % 5 === 0 ? "Easy" : difficulty, `${opener}${fact[0]}`, choices, rotate, fact[3]));
  }
  return questions;
}

const animalNames = ["Giraffe", "Zebra", "Chameleon", "Panda", "Cheetah", "Axolotl", "Whale shark", "Red panda", "Koala", "Meerkat", "Sloth", "Flamingo", "Toucan", "Penguin", "Otter", "Platypus", "Lemur", "Orangutan", "Hedgehog", "Capybara", "Armadillo", "Tapir", "Peacock", "Seahorse", "Octopus", "Jellyfish", "Manta ray", "Moose", "Bison", "Alpaca", "Llama", "Fennec fox", "Snow leopard", "Tiger", "Lion", "Elephant", "Rhino", "Hippo", "Crocodile", "Komodo dragon", "Iguana", "Macaw", "Owl", "Eagle", "Kangaroo", "Wallaby", "Dolphin", "Orca", "Seal", "Walrus", "Camel", "Yak", "Raccoon", "Skunk", "Badger", "Wombat", "Cassowary", "Narwhal", "Manatee", "Beaver"];

function animalQuestions() {
  const visual = animalNames.map((animal, index) => {
    const { choices, correctIndex } = choicesFor(animal, animalNames, index + 1);
    return expandedQuestion(`animal-img-${String(index + 1).padStart(3, "0")}`, "Animals", index % 4 === 0 ? "Easy" : "Medium", "Which animal is shown here?", choices, correctIndex, `That animal is a ${animal.toLowerCase()}.`, expandedImage("animals", animal, `${animal} visual clue`, "Animal clue"));
  });
  const facts = [
    ["Which animal is known for sleeping upside down?", ["Bat", "Horse", "Rabbit", "Shark"], 0, "Bats often roost upside down."],
    ["Which animal has a trunk?", ["Elephant", "Tiger", "Kangaroo", "Penguin"], 0, "Elephants use trunks to smell, drink, and grab."],
    ["Which animal is famous for building dams?", ["Beaver", "Otter", "Seal", "Badger"], 0, "Beavers build dams."],
    ["Which animal has the longest neck?", ["Giraffe", "Camel", "Horse", "Moose"], 0, "Giraffes have famously long necks."],
    ["Which sea animal is known for ink clouds?", ["Octopus", "Dolphin", "Seal", "Tuna"], 0, "Octopuses can release ink."],
    ["Which bird is known for a huge colorful tail?", ["Peacock", "Owl", "Penguin", "Swan"], 0, "Peacocks have dramatic tails."],
    ["Which animal is a marsupial?", ["Kangaroo", "Gorilla", "Tiger", "Wolf"], 0, "Kangaroos are marsupials."],
    ["Which animal has black eye patches and eats bamboo?", ["Panda", "Koala", "Lemur", "Raccoon"], 0, "Pandas are bamboo fans."],
    ["Which animal is famous for being very slow?", ["Sloth", "Cheetah", "Hare", "Falcon"], 0, "Sloths take life slowly."],
    ["Which animal is the largest land animal?", ["Elephant", "Rhino", "Giraffe", "Hippo"], 0, "Elephants are the largest land animals."]
  ];
  return [...visual, ...repeatedFacts("animal-fact", "Animals", facts, 25, "Medium")];
}

const brandNames = ["Nike", "Adidas", "Puma", "Apple", "Samsung", "Google", "YouTube", "Netflix", "Spotify", "McDonald's", "Burger King", "KFC", "Starbucks", "Coca-Cola", "Pepsi", "Lego", "IKEA", "Amazon", "Microsoft", "PlayStation", "Xbox", "Nintendo", "TikTok", "Instagram", "WhatsApp", "Uber", "Airbnb", "Rolex", "Chanel", "Gucci", "Prada", "Louis Vuitton", "Hermes", "Dior", "Lacoste", "Ferrari", "Lamborghini", "Porsche", "Mercedes-Benz", "BMW", "Audi", "Tesla", "Toyota", "Volkswagen", "Red Bull", "Visa", "Mastercard", "PayPal", "Netflix", "Disney+"];

function brandQuestions() {
  const visual = brandNames.slice(0, 50).map((brand, index) => {
    const { choices, correctIndex } = choicesFor(brand, brandNames, index + 3);
    return expandedQuestion(`brand-img-${String(index + 1).padStart(3, "0")}`, "Brands & Logos", index % 5 === 0 ? "Easy" : "Medium", "Which brand uses this logo?", choices, correctIndex, `That logo points to ${brand}.`, expandedImage("brands", `${brand}-placeholder`, `${brand} logo-style placeholder`, "Logo question", "svg"));
  });
  return visual;
}

const carBrands = ["BMW", "Mercedes-Benz", "Audi", "Porsche", "Volkswagen", "Toyota", "Honda", "Nissan", "Mazda", "Subaru", "Ford", "Chevrolet", "Tesla", "Volvo", "Peugeot", "Renault", "Fiat", "Ferrari", "Lamborghini", "Maserati", "Bugatti", "Aston Martin", "Jaguar", "Land Rover", "Mini", "Kia", "Hyundai", "Skoda", "Seat", "Alfa Romeo", "Bentley", "Rolls-Royce", "McLaren", "Lotus", "Jeep", "Dodge", "Ram", "Cadillac", "Lexus", "Acura"];
const carOrigins = [["BMW", "Germany"], ["Mercedes-Benz", "Germany"], ["Audi", "Germany"], ["Porsche", "Germany"], ["Volkswagen", "Germany"], ["Toyota", "Japan"], ["Honda", "Japan"], ["Nissan", "Japan"], ["Mazda", "Japan"], ["Subaru", "Japan"], ["Ford", "United States"], ["Chevrolet", "United States"], ["Tesla", "United States"], ["Volvo", "Sweden"], ["Peugeot", "France"], ["Renault", "France"], ["Fiat", "Italy"], ["Ferrari", "Italy"], ["Lamborghini", "Italy"], ["Maserati", "Italy"], ["Bugatti", "France"], ["Aston Martin", "United Kingdom"], ["Jaguar", "United Kingdom"], ["Land Rover", "United Kingdom"], ["Mini", "United Kingdom"], ["Kia", "South Korea"], ["Hyundai", "South Korea"], ["Skoda", "Czech Republic"], ["Seat", "Spain"], ["Alfa Romeo", "Italy"]];

function carQuestions() {
  const visual = carBrands.slice(0, 40).map((brand, index) => {
    const { choices, correctIndex } = choicesFor(brand, carBrands, index + 1);
    return expandedQuestion(`cars-img-${String(index + 1).padStart(3, "0")}`, "Cars", index % 4 === 0 ? "Easy" : "Medium", "Which car brand is shown here?", choices, correctIndex, `That image points to ${brand}.`, expandedImage("cars", `${brand}-badge-placeholder`, `${brand} badge or silhouette placeholder`, "Car question", "svg"));
  });
  const origins = carOrigins.map(([brand, country], index) => {
    const { choices, correctIndex } = choicesFor(country, [...new Set(carOrigins.map(([, origin]) => origin))], index + 2);
    return expandedQuestion(`cars-origin-${String(index + 1).padStart(3, "0")}`, "Cars", "Medium", `Which country is ${brand} originally from?`, choices, correctIndex, `${brand} is originally from ${country}.`);
  });
  return [...visual, ...origins];
}

const footballItems = ["Real Madrid", "Barcelona", "Manchester United", "Liverpool", "Arsenal", "Chelsea", "Manchester City", "Bayern Munich", "Borussia Dortmund", "Juventus", "Inter", "AC Milan", "PSG", "Ajax", "Benfica", "Porto", "Celtic", "Rangers", "Galatasaray", "Fenerbahce", "Brazil", "Argentina", "France", "Germany", "Spain", "Italy", "Netherlands", "Portugal", "England", "Morocco", "Santiago Bernabeu", "Camp Nou", "Anfield", "Old Trafford", "San Siro", "Wembley", "Allianz Arena", "Signal Iduna Park", "Parc des Princes", "Maracana"];
function footballQuestions() {
  const visual = footballItems.map((item, index) => {
    const { choices, correctIndex } = choicesFor(item, footballItems, index + 4);
    return expandedQuestion(`football-img-${String(index + 1).padStart(3, "0")}`, "Football Special", index % 5 === 0 ? "Easy" : "Medium", "Which football club, country, or stadium is shown here?", choices, correctIndex, `That image points to ${item}.`, expandedImage("football", `${item}-placeholder`, `${item} football visual placeholder`, "Football question", "svg"));
  });
  const facts = [
    ["Which club is known as Los Blancos?", ["Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla"], 0, "Real Madrid are nicknamed Los Blancos."],
    ["Which club plays at Anfield?", ["Liverpool", "Chelsea", "Arsenal", "Everton"], 0, "Liverpool play at Anfield."],
    ["Which national team wears orange?", ["Netherlands", "France", "Germany", "Spain"], 0, "The Netherlands are famous for orange kits."],
    ["Which club is known as The Old Lady?", ["Juventus", "Inter", "Roma", "Napoli"], 0, "Juventus are nicknamed The Old Lady."],
    ["Which country is famous for the Selecao nickname?", ["Brazil", "Argentina", "Portugal", "Mexico"], 0, "Brazil are often called the Selecao."]
  ];
  return [...visual, ...repeatedFacts("football-fact", "Football Special", facts, 35, "Medium")];
}

function simpleCategory(prefix, category, target, facts) {
  return repeatedFacts(prefix, category, facts, target, "Medium");
}

const movieFacts = [
  ["Which movie features a talking donkey and an ogre?", ["Shrek", "Frozen", "Cars", "Finding Nemo"], 0, "Shrek features Donkey and Shrek."],
  ["Which franchise has a ring that must be destroyed?", ["The Lord of the Rings", "Harry Potter", "Avatar", "Mission: Impossible"], 0, "The One Ring drives The Lord of the Rings."],
  ["Which series is set in Hawkins, Indiana?", ["Stranger Things", "Friends", "Sherlock", "The Crown"], 0, "Stranger Things is set around Hawkins."],
  ["Which film features a clownfish named Nemo?", ["Finding Nemo", "Moana", "Ratatouille", "Up"], 0, "Nemo is the missing fish."],
  ["Which movie has a DeLorean time machine?", ["Back to the Future", "Ghostbusters", "Jumanji", "Top Gun"], 0, "Back to the Future uses a DeLorean."],
  ["Which show features a paper company called Dunder Mifflin?", ["The Office", "Parks and Recreation", "Suits", "Brooklyn Nine-Nine"], 0, "Dunder Mifflin is from The Office."],
  ["Which film features a shark terrorizing Amity Island?", ["Jaws", "Titanic", "King Kong", "Avatar"], 0, "Jaws is the shark classic."],
  ["Which animated film stars Lightning McQueen?", ["Cars", "Toy Story", "Coco", "Brave"], 0, "Lightning McQueen is from Cars."],
  ["Which series has a character named Eleven?", ["Stranger Things", "Lost", "Wednesday", "The Witcher"], 0, "Eleven is from Stranger Things."],
  ["Which movie features a chocolate factory owner named Willy Wonka?", ["Charlie and the Chocolate Factory", "Matilda", "Hook", "Paddington"], 0, "Willy Wonka owns the chocolate factory."]
];

const movieVisualNames = ["Shrek", "Finding Nemo", "Back to the Future", "Jaws", "Cars", "Toy Story", "The Lion King", "Frozen", "Star Wars", "Harry Potter", "Jurassic Park", "Ghostbusters", "The Matrix", "Avatar", "Spider-Man", "Batman", "Superman", "Wednesday", "Stranger Things", "The Office"];
function movieQuestions() {
  const visual = movieVisualNames.map((item, index) => {
    const { choices, correctIndex } = choicesFor(item, movieVisualNames, index + 1);
    return expandedQuestion(`movie-img-${String(index + 1).padStart(3, "0")}`, "Movies & TV", "Medium", "Which movie or TV title is shown here?", choices, correctIndex, `That image points to ${item}.`, expandedImage("movies-tv", `${item}-visual-clue`, `${item} visual clue placeholder`, "Screen question"));
  });
  return [...visual, ...simpleCategory("movie-fact", "Movies & TV", 35, movieFacts)];
}

const musicFacts = [
  ["Which artist is known for the album 1989?", ["Taylor Swift", "Adele", "Rihanna", "Katy Perry"], 0, "1989 is a Taylor Swift album."],
  ["Which band released Bohemian Rhapsody?", ["Queen", "The Beatles", "U2", "Oasis"], 0, "Bohemian Rhapsody is by Queen."],
  ["Which singer is known for Purple Rain?", ["Prince", "Elton John", "Drake", "Bruno Mars"], 0, "Purple Rain is linked to Prince."],
  ["Which instrument does a saxophonist play?", ["Saxophone", "Violin", "Drums", "Harp"], 0, "A saxophonist plays saxophone."],
  ["Which artist is known as Queen Bey?", ["Beyonce", "Madonna", "Adele", "Shakira"], 0, "Queen Bey means Beyonce."],
  ["Which group is known for K-pop hits like Dynamite?", ["BTS", "Coldplay", "ABBA", "Metallica"], 0, "BTS released Dynamite."],
  ["Which singer is famous for Hello and Rolling in the Deep?", ["Adele", "Rihanna", "Dua Lipa", "Lady Gaga"], 0, "Those songs are by Adele."],
  ["Which band is linked with the album Abbey Road?", ["The Beatles", "Queen", "Nirvana", "Radiohead"], 0, "Abbey Road is a Beatles album."],
  ["Which genre is Bob Marley most associated with?", ["Reggae", "Opera", "Techno", "Country"], 0, "Bob Marley is a reggae icon."],
  ["Which instrument usually has six strings?", ["Guitar", "Flute", "Trumpet", "Drum"], 0, "Most guitars have six strings."]
];

const foodFacts = [
  ["Which country is strongly linked with tacos?", ["Mexico", "Japan", "Greece", "Sweden"], 0, "Tacos are a Mexican food icon."],
  ["Which dish is made with rice and saffron in Spain?", ["Paella", "Sushi", "Pierogi", "Pho"], 0, "Paella is a Spanish rice dish."],
  ["Which dessert has layers of pastry and nuts?", ["Baklava", "Tiramisu", "Gelato", "Mochi"], 0, "Baklava has pastry and nuts."],
  ["Which drink is made by steeping leaves?", ["Tea", "Coffee", "Cola", "Milkshake"], 0, "Tea is made from leaves."],
  ["Which food is mozzarella?", ["Cheese", "Fruit", "Bread", "Soup"], 0, "Mozzarella is cheese."],
  ["Which cuisine is ramen most associated with?", ["Japanese", "Mexican", "Moroccan", "Brazilian"], 0, "Ramen is Japanese."],
  ["Which ingredient gives hummus its base?", ["Chickpeas", "Potatoes", "Rice", "Tomatoes"], 0, "Hummus is chickpea-based."],
  ["Which dessert is frozen and Italian?", ["Gelato", "Brownie", "Pavlova", "Churro"], 0, "Gelato is Italian frozen dessert."],
  ["Which spice is common in cinnamon rolls?", ["Cinnamon", "Paprika", "Cumin", "Saffron"], 0, "The clue is in the name."],
  ["Which food is traditionally wrapped in seaweed?", ["Sushi", "Pizza", "Falafel", "Lasagna"], 0, "Many sushi rolls use seaweed."]
];

const internetFacts = [
  ["Which app is known for Stories and Reels?", ["Instagram", "Excel", "Zoom", "Dropbox"], 0, "Instagram has Stories and Reels."],
  ["Which platform is famous for livestream game creators?", ["Twitch", "LinkedIn", "Maps", "Kindle"], 0, "Twitch is a livestream platform."],
  ["What does URL stand for?", ["Uniform Resource Locator", "Universal Reply Line", "User Ranking List", "Ultra Render Link"], 0, "URL means Uniform Resource Locator."],
  ["Which game has creepers?", ["Minecraft", "FIFA", "Tetris", "The Sims"], 0, "Creepers are from Minecraft."],
  ["Which app is known for workplace chat channels?", ["Slack", "Spotify", "Netflix", "Uber"], 0, "Slack uses channels for team chat."],
  ["Which platform is known for short vertical videos?", ["TikTok", "PayPal", "Gmail", "Trello"], 0, "TikTok is built around short videos."],
  ["What does Wi-Fi help devices connect to?", ["A network", "A frying pan", "A passport", "A bicycle"], 0, "Wi-Fi connects devices to networks."],
  ["Which game has a battle bus?", ["Fortnite", "Minecraft", "Among Us", "Roblox"], 0, "Fortnite has the battle bus."],
  ["What is a screenshot?", ["An image of your screen", "A phone charger", "A playlist", "A password type"], 0, "A screenshot captures the screen."],
  ["Which app is known for video calls and meetings?", ["Zoom", "Spotify", "Pinterest", "Steam"], 0, "Zoom is known for video calls."]
];

const historyFacts = [
  ["Which ancient city had the Colosseum?", ["Rome", "Athens", "Cairo", "Beijing"], 0, "The Colosseum is in Rome."],
  ["Which civilization used hieroglyphs?", ["Ancient Egyptians", "Vikings", "Aztecs", "Romans"], 0, "Egyptians used hieroglyphs."],
  ["Who is linked with the theory of evolution by natural selection?", ["Charles Darwin", "Isaac Newton", "Galileo", "Tesla"], 0, "Darwin is linked with natural selection."],
  ["Which famous wall divided a German city?", ["Berlin Wall", "Great Wall", "Hadrian's Wall", "Western Wall"], 0, "The Berlin Wall divided Berlin."],
  ["Which explorer completed the first voyage around the world through his expedition?", ["Magellan", "Columbus", "Cook", "Polo"], 0, "Magellan's expedition circumnavigated the globe."],
  ["Which empire had gladiators?", ["Roman Empire", "Inca Empire", "Mali Empire", "Mongol Empire"], 0, "Gladiators were Roman."],
  ["Which invention is Alexander Graham Bell linked with?", ["Telephone", "Printing press", "Airplane", "Telescope"], 0, "Bell is linked with the telephone."],
  ["Which city was buried by Vesuvius?", ["Pompeii", "Sparta", "Troy", "Carthage"], 0, "Pompeii was buried by Vesuvius."],
  ["Which people are linked with samurai?", ["Japanese", "Vikings", "Romans", "Mayans"], 0, "Samurai were Japanese warriors."],
  ["Which document is linked with Magna Carta?", ["English history", "Egyptian pyramids", "Roman roads", "Mayan calendars"], 0, "Magna Carta is a key English document."]
];

const scienceFacts = [
  ["Which planet is closest to the Sun?", ["Mercury", "Mars", "Saturn", "Neptune"], 0, "Mercury is closest to the Sun."],
  ["What do humans breathe in to survive?", ["Oxygen", "Helium", "Neon", "Argon"], 0, "Humans need oxygen."],
  ["Which force pulls objects toward Earth?", ["Gravity", "Magnetism", "Friction", "Sound"], 0, "Gravity pulls objects down."],
  ["Which body part helps you hear?", ["Ear", "Knee", "Elbow", "Liver"], 0, "Ears help you hear."],
  ["Which planet is famous for rings?", ["Saturn", "Mars", "Venus", "Mercury"], 0, "Saturn has famous rings."],
  ["What is frozen water called?", ["Ice", "Steam", "Sand", "Salt"], 0, "Frozen water is ice."],
  ["Which gas do plants release during photosynthesis?", ["Oxygen", "Hydrogen", "Neon", "Methane"], 0, "Plants release oxygen."],
  ["Which organ controls thoughts and memory?", ["Brain", "Heart", "Stomach", "Lung"], 0, "The brain controls thinking."],
  ["Which natural object orbits Earth?", ["The Moon", "Mars", "The Sun", "Venus"], 0, "The Moon orbits Earth."],
  ["Which substance is measured by pH?", ["Acidity", "Height", "Speed", "Temperature"], 0, "pH measures acidity or alkalinity."]
];

const luxuryItems = ["Gucci", "Chanel", "Prada", "Dior", "Hermes", "Louis Vuitton", "Versace", "Rolex", "Cartier", "Burberry", "Fendi", "Balenciaga", "Armani", "Valentino", "Saint Laurent", "Moncler", "Bottega Veneta", "Tiffany", "Omega", "Patek Philippe", "Louboutin", "Jimmy Choo", "Ray-Ban", "Tom Ford", "Givenchy"];
function luxuryQuestions() {
  const visual = luxuryItems.map((item, index) => {
    const { choices, correctIndex } = choicesFor(item, luxuryItems, index + 1);
    return expandedQuestion(`lux-img-${String(index + 1).padStart(3, "0")}`, "Luxury & Fashion", "Medium", "Which fashion or luxury brand is shown here?", choices, correctIndex, `That image points to ${item}.`, expandedImage("luxury-fashion", `${item}-placeholder`, `${item} style placeholder`, "Style question", "svg"));
  });
  const facts = [
    ["Which brand is famous for the Birkin bag?", ["Hermes", "Nike", "Zara", "Levi's"], 0, "The Birkin is an Hermes bag."],
    ["Which brand is famous for red-soled heels?", ["Louboutin", "Rolex", "Puma", "Uniqlo"], 0, "Louboutin is known for red soles."],
    ["Which brand is best known for luxury watches?", ["Rolex", "Netflix", "IKEA", "Samsung"], 0, "Rolex is a watch brand."],
    ["Which city is a major fashion capital?", ["Paris", "Oslo", "Lima", "Perth"], 0, "Paris is a fashion capital."],
    ["Which pattern is Burberry famous for?", ["Check", "Lightning bolts", "Flames", "Stars"], 0, "Burberry is known for check."]
  ];
  return [...visual, ...repeatedFacts("lux-fact", "Luxury & Fashion", facts, 30, "Medium")];
}

export const EXPANDED_TRIVIA_QUESTIONS = [
  ...geographyQuestions(),
  ...repeatedFacts("sports-extra", "Sports", sportsFacts, 55, "Medium"),
  ...animalQuestions(),
  ...movieQuestions(),
  ...simpleCategory("music-extra", "Songs & Music", 55, musicFacts),
  ...brandQuestions(),
  ...simpleCategory("food-extra", "Food & Drink", 55, foodFacts),
  ...simpleCategory("internet-extra", "Internet & Pop Culture", 50, internetFacts),
  ...simpleCategory("history-extra", "History", 55, historyFacts),
  ...simpleCategory("science-extra", "Science & Nature", 65, scienceFacts),
  ...luxuryQuestions(),
  ...carQuestions(),
  ...footballQuestions()
];
