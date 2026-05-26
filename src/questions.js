import { EXPANDED_TRIVIA_QUESTIONS } from "./questionExpansion.js";

const q = (id, category, difficulty, question, choices, correctIndex, explanation) => ({
  id,
  category,
  difficulty,
  question,
  choices,
  correctIndex,
  explanation
});

export const CATEGORY_MODES = [
  "Mixed Party",
  "Geography",
  "Sports",
  "Animals",
  "Movies & TV",
  "Songs & Music",
  "Brands & Logos",
  "Food & Drink",
  "Internet & Pop Culture",
  "History",
  "Science & Nature",
  "Luxury & Fashion",
  "Cars",
  "Football Special"
];

const BASE_TRIVIA_QUESTIONS = [
  q("geo-001", "Geography", "Easy", "Which country has the city of Marrakech?", ["Egypt", "Morocco", "Tunisia", "Jordan"], 1, "Marrakech is one of Morocco's most famous cities."),
  q("geo-002", "Geography", "Easy", "Which landmark is in Paris?", ["Colosseum", "Eiffel Tower", "Big Ben", "Sagrada Familia"], 1, "The Eiffel Tower is the classic Paris landmark."),
  q("geo-003", "Geography", "Easy", "Which country is shaped like a boot?", ["Portugal", "Italy", "Greece", "Croatia"], 1, "Italy is famously boot-shaped on the map."),
  q("geo-004", "Geography", "Medium", "Which river runs through London?", ["Seine", "Thames", "Danube", "Rhine"], 1, "The River Thames flows through London."),
  q("geo-005", "Geography", "Medium", "Which city is known as the Big Apple?", ["Los Angeles", "New York City", "Chicago", "Boston"], 1, "New York City is nicknamed the Big Apple."),
  q("geo-006", "Geography", "Easy", "Mount Fuji is in which country?", ["China", "Japan", "South Korea", "Nepal"], 1, "Mount Fuji is Japan's famous volcano."),
  q("geo-007", "Geography", "Medium", "Which country has the most people?", ["India", "United States", "Indonesia", "Brazil"], 0, "India is the world's most populous country."),
  q("geo-008", "Geography", "Easy", "Which ocean is the largest?", ["Atlantic", "Indian", "Pacific", "Arctic"], 2, "The Pacific Ocean is the biggest."),
  q("geo-009", "Geography", "Medium", "Which country is home to Machu Picchu?", ["Mexico", "Peru", "Chile", "Colombia"], 1, "Machu Picchu is in Peru."),
  q("geo-010", "Geography", "Hard", "Which capital city sits on the River Vltava?", ["Prague", "Vienna", "Budapest", "Warsaw"], 0, "Prague is built along the Vltava."),
  q("geo-011", "Geography", "Easy", "Which desert is the largest hot desert?", ["Gobi", "Sahara", "Kalahari", "Atacama"], 1, "The Sahara is the largest hot desert."),
  q("geo-012", "Geography", "Medium", "Which country has the flag with a red maple leaf?", ["Australia", "Canada", "Denmark", "Switzerland"], 1, "Canada's flag features a maple leaf."),
  q("geo-013", "Geography", "Medium", "Which city has the canals called the Grand Canal?", ["Venice", "Amsterdam", "Bruges", "Stockholm"], 0, "Venice is famous for the Grand Canal."),
  q("geo-014", "Geography", "Hard", "Which African country has the capital Kigali?", ["Kenya", "Rwanda", "Uganda", "Ghana"], 1, "Kigali is the capital of Rwanda."),
  q("geo-015", "Geography", "Easy", "Santorini is part of which country?", ["Spain", "Greece", "Turkey", "Malta"], 1, "Santorini is a Greek island."),
  q("geo-016", "Geography", "Medium", "Which mountain range separates Europe and Asia in Russia?", ["Alps", "Urals", "Andes", "Atlas"], 1, "The Ural Mountains are a traditional boundary."),

  q("sports-001", "Sports", "Easy", "How many players are on the court for one basketball team?", ["4", "5", "6", "7"], 1, "Basketball teams play five at a time."),
  q("sports-002", "Sports", "Easy", "Which sport uses a puck?", ["Tennis", "Ice hockey", "Cricket", "Golf"], 1, "Ice hockey is played with a puck."),
  q("sports-003", "Sports", "Medium", "Which Grand Slam tennis tournament is played on grass?", ["US Open", "French Open", "Wimbledon", "Australian Open"], 2, "Wimbledon is the famous grass-court major."),
  q("sports-004", "Sports", "Easy", "In Formula 1, what does a pit stop usually change?", ["Helmet", "Tyres", "Steering wheel", "Number plate"], 1, "Pit stops are mostly for tyre changes."),
  q("sports-005", "Sports", "Medium", "Which country is famous for the haka before rugby matches?", ["Australia", "New Zealand", "South Africa", "Ireland"], 1, "New Zealand teams made the haka world famous."),
  q("sports-006", "Sports", "Easy", "Which sport has a Super Bowl?", ["Baseball", "American football", "Basketball", "Ice hockey"], 1, "The Super Bowl is American football's big final."),
  q("sports-007", "Sports", "Medium", "How many rings are on the Olympic flag?", ["4", "5", "6", "7"], 1, "The Olympic symbol has five rings."),
  q("sports-008", "Sports", "Hard", "Which boxer was nicknamed The Greatest?", ["Mike Tyson", "Muhammad Ali", "Floyd Mayweather", "Joe Frazier"], 1, "Muhammad Ali used the nickname The Greatest."),
  q("sports-009", "Sports", "Medium", "Which sport is played at Augusta National?", ["Tennis", "Golf", "Baseball", "Rugby"], 1, "Augusta National hosts the Masters golf tournament."),
  q("sports-010", "Sports", "Easy", "Which sport uses the terms strike and spare?", ["Bowling", "Darts", "Snooker", "Squash"], 0, "Those are bowling terms."),
  q("sports-011", "Sports", "Medium", "Which NBA team is known for purple and gold?", ["Boston Celtics", "LA Lakers", "Miami Heat", "Chicago Bulls"], 1, "Purple and gold are Lakers colors."),
  q("sports-012", "Sports", "Hard", "Which country hosted the first modern Olympic Games in 1896?", ["France", "Greece", "Italy", "United Kingdom"], 1, "The modern Olympics began in Athens, Greece."),
  q("sports-013", "Sports", "Easy", "Which sport has a Tour de France?", ["Cycling", "Running", "Skiing", "Rowing"], 0, "The Tour de France is cycling's famous race."),
  q("sports-014", "Sports", "Medium", "What color jersey does the Tour de France leader wear?", ["Green", "Yellow", "Red", "Blue"], 1, "The overall leader wears yellow."),
  q("sports-015", "Sports", "Easy", "Which sport uses a shuttlecock?", ["Badminton", "Volleyball", "Table tennis", "Handball"], 0, "Badminton is played with a shuttlecock."),

  q("animals-001", "Animals", "Easy", "Which animal is the tallest on land?", ["Elephant", "Giraffe", "Horse", "Camel"], 1, "Giraffes are the tallest land animals."),
  q("animals-002", "Animals", "Easy", "Which animal is known for black and white stripes?", ["Panda", "Zebra", "Skunk", "Penguin"], 1, "Zebras have iconic stripes."),
  q("animals-003", "Animals", "Medium", "Which bird can fly backwards?", ["Sparrow", "Hummingbird", "Eagle", "Flamingo"], 1, "Hummingbirds can hover and fly backwards."),
  q("animals-004", "Animals", "Medium", "What is a group of lions called?", ["Pack", "Pride", "Herd", "Flock"], 1, "A lion group is a pride."),
  q("animals-005", "Animals", "Easy", "Which animal is famous for changing color?", ["Chameleon", "Koala", "Meerkat", "Otter"], 0, "Chameleons are color-change legends."),
  q("animals-006", "Animals", "Hard", "Which mammal lays eggs?", ["Platypus", "Dolphin", "Kangaroo", "Sloth"], 0, "Platypuses are egg-laying mammals."),
  q("animals-007", "Animals", "Easy", "Which animal is the largest on Earth?", ["Elephant", "Blue whale", "Great white shark", "Giraffe"], 1, "The blue whale is the largest animal."),
  q("animals-008", "Animals", "Medium", "Which animal has a pouch for its young?", ["Kangaroo", "Tiger", "Gorilla", "Seal"], 0, "Kangaroos are marsupials with pouches."),
  q("animals-009", "Animals", "Medium", "Which sea creature has eight arms?", ["Crab", "Octopus", "Lobster", "Jellyfish"], 1, "Octopuses have eight arms."),
  q("animals-010", "Animals", "Easy", "What do pandas mostly eat?", ["Fish", "Bamboo", "Grass", "Fruit"], 1, "Pandas are bamboo specialists."),
  q("animals-011", "Animals", "Medium", "Which animal is the fastest land animal?", ["Cheetah", "Lion", "Horse", "Greyhound"], 0, "Cheetahs are the sprint champions."),
  q("animals-012", "Animals", "Hard", "What is an axolotl?", ["A bird", "A salamander", "A snake", "A fish"], 1, "Axolotls are salamanders."),
  q("animals-013", "Animals", "Easy", "Which animal says ribbit in cartoons?", ["Duck", "Frog", "Goat", "Seal"], 1, "Cartoon frogs say ribbit."),
  q("animals-014", "Animals", "Medium", "Which animal is a meerkat?", ["A bird", "A small mammal", "A reptile", "A fish"], 1, "Meerkats are small mammals."),
  q("animals-015", "Animals", "Hard", "Which shark is the biggest fish in the sea?", ["Hammerhead", "Whale shark", "Tiger shark", "Mako"], 1, "Whale sharks are gentle giants."),

  q("movies-001", "Movies & TV", "Easy", "Who is the main wizard in the Harry Potter series?", ["Ron Weasley", "Harry Potter", "Draco Malfoy", "Neville Longbottom"], 1, "The clue is right in the title."),
  q("movies-002", "Movies & TV", "Easy", "Which movie features a ship called Titanic?", ["Avatar", "Titanic", "Jaws", "Cast Away"], 1, "Titanic is about the famous ship."),
  q("movies-003", "Movies & TV", "Medium", "Which actor plays Iron Man in the Marvel films?", ["Chris Evans", "Robert Downey Jr.", "Mark Ruffalo", "Chris Hemsworth"], 1, "Robert Downey Jr. plays Tony Stark."),
  q("movies-004", "Movies & TV", "Easy", "In Friends, what is the name of the coffee shop?", ["Central Perk", "Daily Grind", "Coffee House", "The Bean"], 0, "Central Perk is the gang's hangout."),
  q("movies-005", "Movies & TV", "Medium", "Which animated movie has a snowman named Olaf?", ["Moana", "Frozen", "Tangled", "Brave"], 1, "Olaf is from Frozen."),
  q("movies-006", "Movies & TV", "Hard", "Which director made Jurassic Park?", ["James Cameron", "Steven Spielberg", "George Lucas", "Ridley Scott"], 1, "Steven Spielberg directed Jurassic Park."),
  q("movies-007", "Movies & TV", "Easy", "Which series features dragons and the Iron Throne?", ["The Crown", "Game of Thrones", "Breaking Bad", "The Office"], 1, "That's Game of Thrones territory."),
  q("movies-008", "Movies & TV", "Medium", "Which film has a character named Jack Sparrow?", ["Pirates of the Caribbean", "The Mummy", "King Kong", "Indiana Jones"], 0, "Captain Jack Sparrow sails with the Pirates franchise."),
  q("movies-009", "Movies & TV", "Easy", "Which yellow family lives in Springfield?", ["The Griffins", "The Simpsons", "The Flintstones", "The Belchers"], 1, "The Simpsons live in Springfield."),
  q("movies-010", "Movies & TV", "Medium", "Which movie franchise has lightsabers?", ["Star Trek", "Star Wars", "Dune", "The Matrix"], 1, "Lightsabers are Star Wars icons."),
  q("movies-011", "Movies & TV", "Hard", "Who played Forrest Gump?", ["Tom Hanks", "Brad Pitt", "Matt Damon", "Jim Carrey"], 0, "Tom Hanks played Forrest Gump."),
  q("movies-012", "Movies & TV", "Easy", "Which movie has toys that come alive?", ["Shrek", "Toy Story", "Cars", "Monsters, Inc."], 1, "Toy Story is all about living toys."),
  q("movies-013", "Movies & TV", "Medium", "Which show follows a chemistry teacher named Walter White?", ["Dexter", "Breaking Bad", "Ozark", "Better Call Saul"], 1, "Walter White is the lead in Breaking Bad."),
  q("movies-014", "Movies & TV", "Hard", "Which film features the line 'I'll be back'?", ["Terminator", "Rocky", "Predator", "Die Hard"], 0, "Arnold made it famous in Terminator."),
  q("movies-015", "Movies & TV", "Easy", "Which Disney film features Simba?", ["Aladdin", "The Lion King", "Hercules", "Mulan"], 1, "Simba is the lion king."),

  q("music-001", "Songs & Music", "Easy", "Which band had four members often called John, Paul, George, and Ringo?", ["Queen", "The Beatles", "ABBA", "Coldplay"], 1, "Those are The Beatles."),
  q("music-002", "Songs & Music", "Easy", "Which singer is known as the Queen of Pop?", ["Madonna", "Adele", "Billie Eilish", "Dua Lipa"], 0, "Madonna is widely called the Queen of Pop."),
  q("music-003", "Songs & Music", "Medium", "Which instrument has black and white keys?", ["Guitar", "Piano", "Trumpet", "Violin"], 1, "Pianos have black and white keys."),
  q("music-004", "Songs & Music", "Medium", "Which artist released the album Thriller?", ["Prince", "Michael Jackson", "Stevie Wonder", "Elton John"], 1, "Thriller is Michael Jackson's blockbuster album."),
  q("music-005", "Songs & Music", "Easy", "Which music genre is strongly linked with Jamaica?", ["Reggae", "Techno", "Country", "Opera"], 0, "Reggae has deep Jamaican roots."),
  q("music-006", "Songs & Music", "Hard", "Which composer became famous despite losing his hearing?", ["Mozart", "Beethoven", "Bach", "Vivaldi"], 1, "Beethoven composed while losing his hearing."),
  q("music-007", "Songs & Music", "Easy", "Which group sang Dancing Queen?", ["ABBA", "Spice Girls", "Bee Gees", "Fleetwood Mac"], 0, "Dancing Queen is ABBA's disco classic."),
  q("music-008", "Songs & Music", "Medium", "Which singer is from Barbados?", ["Rihanna", "Ariana Grande", "Shakira", "Beyonce"], 0, "Rihanna was born in Barbados."),
  q("music-009", "Songs & Music", "Easy", "What do DJs usually mix?", ["Paint", "Tracks", "Books", "Shoes"], 1, "DJs mix tracks."),
  q("music-010", "Songs & Music", "Medium", "Which band was Freddie Mercury the lead singer of?", ["Queen", "U2", "Oasis", "Nirvana"], 0, "Freddie Mercury fronted Queen."),
  q("music-011", "Songs & Music", "Hard", "Which city is strongly linked with The Beatles?", ["Manchester", "Liverpool", "Birmingham", "Glasgow"], 1, "The Beatles came from Liverpool."),
  q("music-012", "Songs & Music", "Easy", "Which artist is known for the alter ego Ziggy Stardust?", ["David Bowie", "Elvis Presley", "Bob Dylan", "Prince"], 0, "Ziggy Stardust was David Bowie's character."),
  q("music-013", "Songs & Music", "Medium", "Which instrument does a drummer play?", ["Cello", "Drum kit", "Flute", "Harp"], 1, "Drummers play drums."),
  q("music-014", "Songs & Music", "Hard", "Which genre is associated with artists like Tupac and Notorious B.I.G.?", ["Rap", "Opera", "Salsa", "Punk"], 0, "They are legendary rap artists."),
  q("music-015", "Songs & Music", "Easy", "Which streaming platform is green and famous for playlists?", ["Netflix", "Spotify", "YouTube", "Twitch"], 1, "Spotify is known for music playlists."),

  q("brand-001", "Brands & Logos", "Easy", "Which brand uses a swoosh logo?", ["Adidas", "Nike", "Puma", "Reebok"], 1, "Nike's swoosh is instantly recognizable."),
  q("brand-002", "Brands & Logos", "Easy", "Which company makes the iPhone?", ["Samsung", "Apple", "Google", "Sony"], 1, "Apple makes the iPhone."),
  q("brand-003", "Brands & Logos", "Medium", "Which fast-food chain has the golden arches?", ["Burger King", "McDonald's", "KFC", "Subway"], 1, "The golden arches belong to McDonald's."),
  q("brand-004", "Brands & Logos", "Easy", "Which brand is famous for red cans of cola?", ["Sprite", "Coca-Cola", "Fanta", "Pepsi"], 1, "Coca-Cola is the red-can classic."),
  q("brand-005", "Brands & Logos", "Medium", "Which brand started as an online bookstore?", ["Amazon", "eBay", "Netflix", "Spotify"], 0, "Amazon began by selling books online."),
  q("brand-006", "Brands & Logos", "Hard", "Which car brand has a prancing horse logo?", ["Lamborghini", "Ferrari", "Porsche", "Maserati"], 1, "Ferrari's logo is the prancing horse."),
  q("brand-007", "Brands & Logos", "Easy", "Which brand makes PlayStation?", ["Nintendo", "Sony", "Microsoft", "Sega"], 1, "PlayStation is a Sony product."),
  q("brand-008", "Brands & Logos", "Medium", "Which sportswear brand has three stripes?", ["Nike", "Adidas", "Under Armour", "Fila"], 1, "Adidas is famous for three stripes."),
  q("brand-009", "Brands & Logos", "Easy", "Which brand makes the Galaxy phones?", ["Apple", "Samsung", "Nokia", "Motorola"], 1, "Galaxy is Samsung's phone line."),
  q("brand-010", "Brands & Logos", "Medium", "Which coffee chain has a siren logo?", ["Costa", "Starbucks", "Tim Hortons", "Dunkin'"], 1, "Starbucks uses a siren logo."),
  q("brand-011", "Brands & Logos", "Hard", "Which brand is known for the slogan 'Just Do It'?", ["Nike", "Puma", "Adidas", "Asics"], 0, "Just Do It is Nike's famous slogan."),
  q("brand-012", "Brands & Logos", "Easy", "Which company owns YouTube?", ["Meta", "Google", "Apple", "Microsoft"], 1, "Google owns YouTube."),
  q("brand-013", "Brands & Logos", "Medium", "Which brand is known for interlocking C's?", ["Chanel", "Gucci", "Prada", "Dior"], 0, "The interlocking C's are Chanel."),
  q("brand-014", "Brands & Logos", "Hard", "Which brand's logo is a crocodile?", ["Lacoste", "Levi's", "Tommy Hilfiger", "Ralph Lauren"], 0, "Lacoste uses the crocodile."),
  q("brand-015", "Brands & Logos", "Easy", "Which app is famous for short vertical videos?", ["TikTok", "Slack", "Uber", "Airbnb"], 0, "TikTok popularized short vertical videos."),

  q("food-001", "Food & Drink", "Easy", "Sushi is most associated with which country?", ["Thailand", "Japan", "India", "Mexico"], 1, "Sushi is a Japanese food icon."),
  q("food-002", "Food & Drink", "Easy", "Which fruit is used to make guacamole?", ["Banana", "Avocado", "Mango", "Pear"], 1, "Guacamole is made from avocado."),
  q("food-003", "Food & Drink", "Medium", "Which pasta shape means little tongues?", ["Penne", "Linguine", "Fusilli", "Rigatoni"], 1, "Linguine roughly means little tongues."),
  q("food-004", "Food & Drink", "Easy", "Which drink is made from coffee beans?", ["Tea", "Coffee", "Lemonade", "Cola"], 1, "Coffee comes from roasted coffee beans."),
  q("food-005", "Food & Drink", "Medium", "Which country is famous for paella?", ["Portugal", "Spain", "France", "Greece"], 1, "Paella is a Spanish dish."),
  q("food-006", "Food & Drink", "Hard", "What is tahini made from?", ["Sesame seeds", "Chickpeas", "Almonds", "Rice"], 0, "Tahini is sesame seed paste."),
  q("food-007", "Food & Drink", "Easy", "Which cheese is commonly used on pizza?", ["Mozzarella", "Blue cheese", "Feta", "Brie"], 0, "Mozzarella is the pizza classic."),
  q("food-008", "Food & Drink", "Medium", "Which dessert is made with mascarpone and coffee?", ["Tiramisu", "Baklava", "Pavlova", "Mochi"], 0, "Tiramisu uses mascarpone and coffee."),
  q("food-009", "Food & Drink", "Easy", "Which spice is bright yellow and common in curry?", ["Cinnamon", "Turmeric", "Nutmeg", "Paprika"], 1, "Turmeric gives many curries a yellow color."),
  q("food-010", "Food & Drink", "Medium", "Falafel is usually made from what?", ["Beef", "Chickpeas", "Potatoes", "Corn"], 1, "Falafel is commonly made from chickpeas."),
  q("food-011", "Food & Drink", "Hard", "Which country gave the world kimchi?", ["Japan", "South Korea", "Vietnam", "China"], 1, "Kimchi is a Korean staple."),
  q("food-012", "Food & Drink", "Easy", "Which nut is used in marzipan?", ["Almond", "Peanut", "Walnut", "Cashew"], 0, "Marzipan is almond-based."),
  q("food-013", "Food & Drink", "Medium", "Which sauce is traditionally used on eggs Benedict?", ["Hollandaise", "Pesto", "Soy sauce", "Salsa"], 0, "Eggs Benedict uses hollandaise."),
  q("food-014", "Food & Drink", "Hard", "Which grain is used to make risotto?", ["Basmati", "Arborio rice", "Quinoa", "Bulgur"], 1, "Arborio rice is a risotto favorite."),
  q("food-015", "Food & Drink", "Easy", "Which food is a croissant?", ["Pastry", "Soup", "Cheese", "Sausage"], 0, "A croissant is a flaky pastry."),

  q("internet-001", "Internet & Pop Culture", "Easy", "Which platform is known for videos and creators with channels?", ["YouTube", "LinkedIn", "Dropbox", "PayPal"], 0, "YouTube is built around video channels."),
  q("internet-002", "Internet & Pop Culture", "Easy", "What does DM usually mean online?", ["Direct message", "Daily meme", "Digital map", "Data mode"], 0, "DM means direct message."),
  q("internet-003", "Internet & Pop Culture", "Medium", "Which game is known for building with blocks and creepers?", ["Minecraft", "Fortnite", "FIFA", "Among Us"], 0, "Minecraft has blocks and creepers."),
  q("internet-004", "Internet & Pop Culture", "Easy", "Which app is strongly linked with disappearing photo messages?", ["Snapchat", "Excel", "Pinterest", "Zoom"], 0, "Snapchat made disappearing snaps famous."),
  q("internet-005", "Internet & Pop Culture", "Medium", "What is a meme?", ["A viral joke format", "A phone charger", "A private email", "A file type only"], 0, "Memes are shareable joke formats or ideas."),
  q("internet-006", "Internet & Pop Culture", "Hard", "Which game uses the phrase 'impostor' as a core mechanic?", ["Among Us", "The Sims", "Rocket League", "Stardew Valley"], 0, "Among Us is all about finding impostors."),
  q("internet-007", "Internet & Pop Culture", "Easy", "Which platform is famous for livestreaming games?", ["Twitch", "Maps", "Word", "Gmail"], 0, "Twitch is the livestreaming hub."),
  q("internet-008", "Internet & Pop Culture", "Medium", "What does 'IRL' mean?", ["In real life", "Instant reply link", "Internet ranking list", "Image render layer"], 0, "IRL means in real life."),
  q("internet-009", "Internet & Pop Culture", "Easy", "Which app is known for swiping on short videos?", ["TikTok", "Teams", "Calendar", "Kindle"], 0, "TikTok is built for short video scrolling."),
  q("internet-010", "Internet & Pop Culture", "Medium", "Which game has a battle bus?", ["Fortnite", "Minecraft", "Tetris", "Animal Crossing"], 0, "Fortnite players drop from the battle bus."),
  q("internet-011", "Internet & Pop Culture", "Hard", "What does NPC stand for in gaming?", ["Non-player character", "New party code", "Next power combo", "No pause challenge"], 0, "NPC means non-player character."),
  q("internet-012", "Internet & Pop Culture", "Easy", "Which device do people use to take selfies?", ["Smartphone", "Toaster", "Router", "Printer"], 0, "Phones made selfies everywhere."),
  q("internet-013", "Internet & Pop Culture", "Medium", "Which app is known for professional networking?", ["LinkedIn", "TikTok", "Spotify", "Steam"], 0, "LinkedIn is the work-network app."),
  q("internet-014", "Internet & Pop Culture", "Hard", "Which game franchise features Pikachu?", ["Pokemon", "Zelda", "Mario Kart", "Sonic"], 0, "Pikachu is the Pokemon mascot."),
  q("internet-015", "Internet & Pop Culture", "Easy", "What is an emoji?", ["A small digital icon", "A type of shoe", "A bank card", "A cooking style"], 0, "Emojis are tiny expressive icons."),

  q("history-001", "History", "Easy", "Which ancient civilization built the pyramids at Giza?", ["Romans", "Egyptians", "Vikings", "Mayans"], 1, "The pyramids are ancient Egyptian monuments."),
  q("history-002", "History", "Easy", "Who was the first person to walk on the Moon?", ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"], 1, "Neil Armstrong stepped on the Moon first."),
  q("history-003", "History", "Medium", "Which city was split by a famous wall during the Cold War?", ["Berlin", "Rome", "Paris", "Madrid"], 0, "The Berlin Wall divided the city."),
  q("history-004", "History", "Medium", "Which empire built many roads across Europe?", ["Roman Empire", "Aztec Empire", "Mongol Empire", "Inca Empire"], 0, "Roman roads were legendary infrastructure."),
  q("history-005", "History", "Easy", "Which ship sank in 1912 after hitting an iceberg?", ["Titanic", "Santa Maria", "Bismarck", "Mayflower"], 0, "The Titanic sank after hitting an iceberg."),
  q("history-006", "History", "Hard", "Which queen ruled ancient Egypt and was linked with Julius Caesar?", ["Cleopatra", "Nefertiti", "Hatshepsut", "Boudica"], 0, "Cleopatra is the famous Egyptian queen."),
  q("history-007", "History", "Easy", "Which invention is Gutenberg famous for?", ["Printing press", "Telephone", "Light bulb", "Airplane"], 0, "Gutenberg helped revolutionize printing."),
  q("history-008", "History", "Medium", "Which civilization built Machu Picchu?", ["Inca", "Aztec", "Maya", "Roman"], 0, "Machu Picchu was built by the Inca."),
  q("history-009", "History", "Easy", "Which war ended in 1945?", ["World War I", "World War II", "Korean War", "Cold War"], 1, "World War II ended in 1945."),
  q("history-010", "History", "Medium", "Which explorer is linked with reaching the Americas in 1492?", ["Christopher Columbus", "Marco Polo", "James Cook", "Ferdinand Magellan"], 0, "Columbus's 1492 voyage is famous."),
  q("history-011", "History", "Hard", "Which city was buried by Mount Vesuvius?", ["Pompeii", "Athens", "Sparta", "Carthage"], 0, "Pompeii was buried by Vesuvius."),
  q("history-012", "History", "Easy", "Which people are associated with longships?", ["Vikings", "Samurai", "Romans", "Mongols"], 0, "Vikings used longships."),
  q("history-013", "History", "Medium", "Who painted the Mona Lisa?", ["Michelangelo", "Leonardo da Vinci", "Van Gogh", "Picasso"], 1, "Leonardo da Vinci painted it."),
  q("history-014", "History", "Hard", "Which leader crossed the Alps with elephants?", ["Hannibal", "Caesar", "Alexander", "Napoleon"], 0, "Hannibal famously crossed the Alps."),
  q("history-015", "History", "Easy", "Which ancient city had gladiators in the Colosseum?", ["Rome", "Cairo", "Beijing", "Lima"], 0, "The Colosseum is in Rome."),

  q("science-001", "Science & Nature", "Easy", "Which planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter", "Mercury"], 1, "Mars looks reddish because of iron oxide."),
  q("science-002", "Science & Nature", "Easy", "What gas do plants take in for photosynthesis?", ["Oxygen", "Carbon dioxide", "Helium", "Nitrogen"], 1, "Plants use carbon dioxide."),
  q("science-003", "Science & Nature", "Medium", "How many bones are in the adult human body?", ["106", "206", "306", "406"], 1, "Adults usually have 206 bones."),
  q("science-004", "Science & Nature", "Easy", "What is H2O?", ["Salt", "Water", "Oxygen", "Sugar"], 1, "H2O is water."),
  q("science-005", "Science & Nature", "Medium", "Which organ pumps blood?", ["Liver", "Heart", "Lung", "Kidney"], 1, "The heart pumps blood."),
  q("science-006", "Science & Nature", "Hard", "Which force keeps planets in orbit around the Sun?", ["Magnetism", "Gravity", "Friction", "Electricity"], 1, "Gravity keeps planets orbiting."),
  q("science-007", "Science & Nature", "Easy", "Which star is closest to Earth?", ["Sirius", "The Sun", "Polaris", "Vega"], 1, "The Sun is our nearest star."),
  q("science-008", "Science & Nature", "Medium", "What is the largest organ of the human body?", ["Skin", "Brain", "Heart", "Liver"], 0, "Skin is the body's largest organ."),
  q("science-009", "Science & Nature", "Easy", "Which natural event creates thunder?", ["Lightning", "Rainbows", "Snow", "Wind"], 0, "Thunder is caused by lightning heating air."),
  q("science-010", "Science & Nature", "Medium", "Which element has the symbol O?", ["Gold", "Oxygen", "Osmium", "Iron"], 1, "O is oxygen."),
  q("science-011", "Science & Nature", "Hard", "What is the hardest natural substance?", ["Diamond", "Quartz", "Granite", "Steel"], 0, "Diamond is famously hard."),
  q("science-012", "Science & Nature", "Easy", "Which animal group do frogs belong to?", ["Reptiles", "Amphibians", "Mammals", "Birds"], 1, "Frogs are amphibians."),
  q("science-013", "Science & Nature", "Medium", "Which layer protects Earth from much UV radiation?", ["Ozone layer", "Cloud layer", "Lava layer", "Ice layer"], 0, "The ozone layer absorbs lots of UV."),
  q("science-014", "Science & Nature", "Hard", "Which planet has the most obvious ring system?", ["Mars", "Saturn", "Venus", "Mercury"], 1, "Saturn is famous for its rings."),
  q("science-015", "Science & Nature", "Easy", "What do bees collect from flowers?", ["Nectar", "Salt", "Sand", "Bark"], 0, "Bees collect nectar from flowers."),

  q("lux-001", "Luxury & Fashion", "Easy", "Which fashion house is known for the interlocking GG logo?", ["Gucci", "Chanel", "Prada", "Fendi"], 0, "GG stands for Gucci founder Guccio Gucci."),
  q("lux-002", "Luxury & Fashion", "Easy", "Which item is Rolex best known for?", ["Sneakers", "Watches", "Handbags", "Perfume"], 1, "Rolex is a luxury watch brand."),
  q("lux-003", "Luxury & Fashion", "Medium", "Which city hosts a famous Fashion Week alongside Paris, Milan, and London?", ["New York", "Oslo", "Dublin", "Lisbon"], 0, "New York is one of the big fashion weeks."),
  q("lux-004", "Luxury & Fashion", "Medium", "Which brand is known for the Birkin bag?", ["Hermes", "Dior", "Versace", "Balenciaga"], 0, "The Birkin is an Hermes icon."),
  q("lux-005", "Luxury & Fashion", "Easy", "Which shoe brand makes Air Jordans?", ["Nike", "Adidas", "Vans", "Converse"], 0, "Air Jordan is a Nike line."),
  q("lux-006", "Luxury & Fashion", "Hard", "Which designer founded Chanel?", ["Coco Chanel", "Donatella Versace", "Miuccia Prada", "Vivienne Westwood"], 0, "Coco Chanel founded Chanel."),
  q("lux-007", "Luxury & Fashion", "Easy", "Which accessory is Ray-Ban famous for?", ["Sunglasses", "Belts", "Watches", "Scarves"], 0, "Ray-Ban is known for sunglasses."),
  q("lux-008", "Luxury & Fashion", "Medium", "Which brand uses a Medusa head logo?", ["Versace", "Gucci", "Armani", "Dior"], 0, "Versace uses the Medusa symbol."),
  q("lux-009", "Luxury & Fashion", "Easy", "What is a tuxedo mainly worn for?", ["Formal events", "Swimming", "Hiking", "Sleeping"], 0, "Tuxedos are formalwear."),
  q("lux-010", "Luxury & Fashion", "Medium", "Which French brand is famous for the LV monogram?", ["Louis Vuitton", "Lacoste", "Cartier", "Celine"], 0, "LV stands for Louis Vuitton."),
  q("lux-011", "Luxury & Fashion", "Hard", "Which brand is famous for red-soled heels?", ["Louboutin", "Jimmy Choo", "Prada", "Fendi"], 0, "Christian Louboutin is known for red soles."),
  q("lux-012", "Luxury & Fashion", "Easy", "Which item is a sneaker?", ["Shoe", "Hat", "Watch", "Bag"], 0, "Sneakers are shoes."),
  q("lux-013", "Luxury & Fashion", "Medium", "Which Italian brand has a triangular logo plaque?", ["Prada", "Chanel", "Burberry", "Rolex"], 0, "Prada often uses a triangle plaque."),
  q("lux-014", "Luxury & Fashion", "Hard", "Which pattern is Burberry famous for?", ["Check", "Polka dots", "Zebra stripes", "Stars"], 0, "Burberry is known for its check pattern."),
  q("lux-015", "Luxury & Fashion", "Easy", "Which product category is Dior Sauvage?", ["Perfume", "Car", "Watch", "Laptop"], 0, "Dior Sauvage is a fragrance."),

  q("cars-001", "Cars", "Easy", "Which country is BMW from?", ["Germany", "Japan", "Italy", "France"], 0, "BMW is a German brand."),
  q("cars-002", "Cars", "Easy", "Which car brand makes the Mustang?", ["Ford", "Toyota", "Fiat", "Volvo"], 0, "The Mustang is a Ford icon."),
  q("cars-003", "Cars", "Medium", "Which company makes the Model S?", ["Tesla", "Nissan", "BMW", "Hyundai"], 0, "The Model S is a Tesla."),
  q("cars-004", "Cars", "Easy", "What does EV stand for?", ["Electric vehicle", "Engine valve", "Extra van", "Eco volume"], 0, "EV means electric vehicle."),
  q("cars-005", "Cars", "Medium", "Which Italian brand is known for the Huracan?", ["Ferrari", "Lamborghini", "Fiat", "Alfa Romeo"], 1, "The Huracan is a Lamborghini."),
  q("cars-006", "Cars", "Hard", "Which brand makes the 911 sports car?", ["Porsche", "Audi", "Mercedes-Benz", "Jaguar"], 0, "The 911 is Porsche's classic sports car."),
  q("cars-007", "Cars", "Easy", "Which car brand has a three-pointed star?", ["Mercedes-Benz", "BMW", "Toyota", "Peugeot"], 0, "Mercedes-Benz uses the three-pointed star."),
  q("cars-008", "Cars", "Medium", "Which Japanese brand makes the Corolla?", ["Honda", "Toyota", "Mazda", "Subaru"], 1, "The Corolla is a Toyota."),
  q("cars-009", "Cars", "Easy", "Which vehicle is built mainly for carrying many passengers?", ["Bus", "Scooter", "Roadster", "Pickup"], 0, "A bus carries many passengers."),
  q("cars-010", "Cars", "Medium", "Which brand is famous for the Golf hatchback?", ["Volkswagen", "Renault", "Opel", "Skoda"], 0, "The Golf is a Volkswagen classic."),
  q("cars-011", "Cars", "Hard", "Which supercar brand uses a bull logo?", ["Lamborghini", "Ferrari", "McLaren", "Bugatti"], 0, "Lamborghini uses a bull."),
  q("cars-012", "Cars", "Easy", "Which fuel is common in traditional cars?", ["Petrol", "Orange juice", "Milk", "Coffee"], 0, "Petrol powers many traditional cars."),
  q("cars-013", "Cars", "Medium", "Which car brand is Swedish?", ["Volvo", "Seat", "Peugeot", "Kia"], 0, "Volvo is from Sweden."),
  q("cars-014", "Cars", "Hard", "Which brand makes the Chiron?", ["Bugatti", "Maserati", "Aston Martin", "Lotus"], 0, "The Chiron is a Bugatti hypercar."),
  q("cars-015", "Cars", "Easy", "Which car part do you use to steer?", ["Steering wheel", "Mirror", "Seatbelt", "Headlight"], 0, "The steering wheel controls direction."),

  q("football-001", "Football Special", "Easy", "How many players does a football team usually have on the pitch?", ["9", "10", "11", "12"], 2, "A football team fields 11 players."),
  q("football-002", "Football Special", "Easy", "Which tournament awards the World Cup trophy?", ["UEFA Champions League", "FIFA World Cup", "Copa del Rey", "Premier League"], 1, "The FIFA World Cup awards the World Cup trophy."),
  q("football-003", "Football Special", "Medium", "Which club is strongly associated with Camp Nou?", ["Real Madrid", "FC Barcelona", "Juventus", "Bayern Munich"], 1, "Camp Nou is Barcelona's famous stadium."),
  q("football-004", "Football Special", "Easy", "Which player is known as CR7?", ["Cristiano Ronaldo", "Kylian Mbappe", "Neymar", "Luka Modric"], 0, "CR7 is Cristiano Ronaldo."),
  q("football-005", "Football Special", "Medium", "Which country has won the most men's World Cups?", ["Germany", "Brazil", "Argentina", "Italy"], 1, "Brazil has the most men's World Cup titles."),
  q("football-006", "Football Special", "Hard", "Which club is nicknamed The Red Devils?", ["Liverpool", "Manchester United", "Arsenal", "Chelsea"], 1, "Manchester United are the Red Devils."),
  q("football-007", "Football Special", "Easy", "What does a goalkeeper mainly try to stop?", ["Goals", "Corner flags", "Throw-ins", "Substitutions"], 0, "Goalkeepers stop goals."),
  q("football-008", "Football Special", "Medium", "Which competition features the anthem before many big European club matches?", ["Champions League", "FA Cup", "MLS Cup", "Copa America"], 0, "The Champions League anthem is famous."),
  q("football-009", "Football Special", "Easy", "Which card means a player is sent off?", ["Blue", "Red", "Green", "White"], 1, "A red card sends a player off."),
  q("football-010", "Football Special", "Medium", "Which position usually wears gloves?", ["Striker", "Goalkeeper", "Winger", "Midfielder"], 1, "Goalkeepers usually wear gloves."),
  q("football-011", "Football Special", "Hard", "Which country is Lionel Messi from?", ["Spain", "Argentina", "Portugal", "Uruguay"], 1, "Messi represents Argentina."),
  q("football-012", "Football Special", "Easy", "What is it called when the ball crosses the goal line into the net?", ["Goal", "Foul", "Corner", "Offside"], 0, "That's a goal."),
  q("football-013", "Football Special", "Medium", "Which club plays in black and white stripes and is based in Turin?", ["AC Milan", "Juventus", "Inter", "Roma"], 1, "Juventus are the Turin club in stripes."),
  q("football-014", "Football Special", "Hard", "Which stadium is home to Real Madrid?", ["Santiago Bernabeu", "Anfield", "San Siro", "Old Trafford"], 0, "Real Madrid play at the Bernabeu."),
  q("football-015", "Football Special", "Easy", "How long is a standard football match before stoppage time?", ["60 minutes", "80 minutes", "90 minutes", "100 minutes"], 2, "A standard match is 90 minutes."),
  q("football-016", "Football Special", "Medium", "Which nation wears orange and is known as Oranje?", ["Netherlands", "Belgium", "Croatia", "Sweden"], 0, "The Netherlands are nicknamed Oranje."),
  q("football-017", "Football Special", "Hard", "Which award is often given to the world's best footballer?", ["Ballon d'Or", "Green Jacket", "Stanley Cup", "Vince Lombardi Trophy"], 0, "The Ballon d'Or is football's famous individual award."),
  q("football-018", "Football Special", "Easy", "What is a hat-trick?", ["Three goals by one player", "A red card", "A goalkeeper save", "A corner kick"], 0, "A hat-trick is three goals by one player."),
  q("football-019", "Football Special", "Medium", "Which club is famous for the anthem You'll Never Walk Alone?", ["Liverpool", "PSG", "Napoli", "Ajax"], 0, "Liverpool fans famously sing it.")
];

const MEDIA_BY_ID = {
  "geo-002": image("/images/questions/landmarks/eiffel-tower.jpg", "The Eiffel Tower in Paris", "Landmark clue"),
  "geo-006": image("/images/questions/landmarks/mount-fuji.jpg", "Mount Fuji with a snowy peak", "Landmark clue"),
  "geo-009": image("/images/questions/landmarks/machu-picchu.jpg", "Machu Picchu ruins in the mountains", "Landmark clue"),
  "geo-012": image("/images/questions/geography/canada-flag.svg", "A red maple leaf flag", "Flag clue"),
  "geo-013": image("/images/questions/landmarks/venice-grand-canal.jpg", "A canal with boats and old buildings", "City clue"),
  "geo-015": image("/images/questions/landmarks/santorini.jpg", "White buildings on a blue sea cliff", "Island clue"),

  "animals-001": image("/images/questions/animals/giraffe.jpg", "A tall spotted animal with a long neck", "Animal clue"),
  "animals-002": image("/images/questions/animals/zebra.jpg", "A striped black and white animal", "Animal clue"),
  "animals-005": image("/images/questions/animals/chameleon.jpg", "A small lizard on a branch", "Animal clue"),
  "animals-010": image("/images/questions/animals/panda.jpg", "A black and white bear eating bamboo", "Animal clue"),
  "animals-011": image("/images/questions/animals/cheetah.jpg", "A spotted big cat running", "Animal clue"),
  "animals-012": image("/images/questions/animals/axolotl.jpg", "A pink aquatic salamander", "Animal clue"),
  "animals-015": image("/images/questions/animals/whale-shark.jpg", "A huge spotted shark underwater", "Animal clue"),

  "movies-005": image("/images/questions/movies-tv/snowman-visual-clue.jpg", "A cheerful snowman visual clue", "Movie clue"),
  "movies-009": image("/images/questions/movies-tv/yellow-family-visual-clue.jpg", "A yellow cartoon family visual clue", "TV clue"),
  "movies-012": image("/images/questions/movies-tv/toy-visual-clue.jpg", "A toy box visual clue", "Movie clue"),
  "movies-015": image("/images/questions/movies-tv/lion-cub-visual-clue.jpg", "A lion cub visual clue", "Movie clue"),

  "brand-001": image("/images/questions/brands/nike-swoosh-placeholder.svg", "A simple swoosh-style logo clue", "Logo clue"),
  "brand-003": image("/images/questions/brands/golden-arches-placeholder.svg", "Two golden arches on a dark background", "Logo clue"),
  "brand-008": image("/images/questions/brands/three-stripes-placeholder.svg", "Three diagonal stripes", "Logo clue"),
  "brand-010": image("/images/questions/brands/siren-placeholder.svg", "A circular coffee logo clue", "Logo clue"),
  "brand-013": image("/images/questions/brands/interlocking-c-placeholder.svg", "Two interlocking letter C shapes", "Logo clue"),
  "brand-014": image("/images/questions/brands/crocodile-placeholder.svg", "A crocodile-shaped logo clue", "Logo clue"),

  "lux-001": image("/images/questions/luxury-fashion/gg-placeholder.svg", "Two interlocking G shapes", "Style clue"),
  "lux-008": image("/images/questions/luxury-fashion/medusa-placeholder.svg", "A luxury medallion visual clue", "Style clue"),
  "lux-010": image("/images/questions/luxury-fashion/lv-placeholder.svg", "A monogram-style LV visual clue", "Style clue"),
  "lux-014": image("/images/questions/luxury-fashion/check-pattern-placeholder.svg", "A check pattern visual clue", "Style clue"),

  "cars-001": image("/images/questions/cars/bmw-badge-placeholder.svg", "A round blue and white badge clue", "Car badge clue"),
  "cars-005": image("/images/questions/cars/lamborghini-silhouette-placeholder.svg", "A low supercar silhouette", "Car clue"),
  "cars-006": image("/images/questions/cars/porsche-911-placeholder.jpg", "A classic sports car silhouette", "Car clue"),
  "cars-007": image("/images/questions/cars/three-pointed-star-placeholder.svg", "A three-pointed star badge clue", "Car badge clue"),
  "cars-011": image("/images/questions/cars/bull-badge-placeholder.svg", "A bull-shaped badge clue", "Car badge clue"),
  "cars-014": image("/images/questions/cars/hypercar-placeholder.jpg", "A dramatic hypercar silhouette", "Car clue"),

  "football-003": image("/images/questions/football/camp-nou-placeholder.jpg", "A large football stadium", "Stadium clue"),
  "football-006": image("/images/questions/football/red-devil-placeholder.svg", "A red devil-style mascot clue", "Club clue"),
  "football-013": image("/images/questions/football/black-white-stripes-placeholder.svg", "Black and white striped football shirt", "Kit clue"),
  "football-014": image("/images/questions/football/bernabeu-placeholder.jpg", "A large white stadium visual clue", "Stadium clue"),
  "football-016": image("/images/questions/football/orange-kit-placeholder.svg", "An orange football shirt", "Kit clue")
};

function image(imageUrl, imageAlt, imageCaption = "Visual clue") {
  return {
    mediaType: "image",
    imageUrl,
    imageAlt,
    imageCaption
  };
}

const COUNTRY_CODE_BY_NAME = {
  France: "fr",
  Germany: "de",
  Italy: "it",
  Spain: "es",
  Portugal: "pt",
  Netherlands: "nl",
  Belgium: "be",
  Switzerland: "ch",
  Austria: "at",
  Sweden: "se",
  Norway: "no",
  Denmark: "dk",
  Finland: "fi",
  Ireland: "ie",
  "United Kingdom": "gb",
  England: "gb-eng",
  Greece: "gr",
  Turkey: "tr",
  Poland: "pl",
  "Czech Republic": "cz",
  Hungary: "hu",
  Romania: "ro",
  Croatia: "hr",
  Serbia: "rs",
  Bulgaria: "bg",
  Ukraine: "ua",
  Iceland: "is",
  Morocco: "ma",
  Egypt: "eg",
  "South Africa": "za",
  Kenya: "ke",
  Nigeria: "ng",
  Ghana: "gh",
  Japan: "jp",
  "South Korea": "kr",
  China: "cn",
  India: "in",
  Thailand: "th",
  Vietnam: "vn",
  Indonesia: "id",
  Philippines: "ph",
  Australia: "au",
  "New Zealand": "nz",
  Canada: "ca",
  "United States": "us",
  Mexico: "mx",
  Brazil: "br",
  Argentina: "ar",
  Chile: "cl",
  Peru: "pe",
  Colombia: "co",
  Jamaica: "jm",
  "Saudi Arabia": "sa",
  "United Arab Emirates": "ae",
  Qatar: "qa",
  Israel: "il",
  Singapore: "sg",
  Malaysia: "my",
  Pakistan: "pk",
  Nepal: "np",
  "Sri Lanka": "lk"
};

const SIMPLE_ICON_SLUG_BY_NAME = {
  Nike: "nike",
  Adidas: "adidas",
  Puma: "puma",
  Apple: "apple",
  Samsung: "samsung",
  Google: "google",
  YouTube: "youtube",
  Netflix: "netflix",
  Spotify: "spotify",
  "McDonald's": "mcdonalds",
  "Burger King": "burgerking",
  KFC: "kfc",
  Starbucks: "starbucks",
  "Coca-Cola": "cocacola",
  Pepsi: "pepsi",
  Lego: "lego",
  IKEA: "ikea",
  Amazon: "amazon",
  Microsoft: "microsoft",
  PlayStation: "playstation",
  Xbox: "xbox",
  Nintendo: "nintendo",
  TikTok: "tiktok",
  Instagram: "instagram",
  WhatsApp: "whatsapp",
  Uber: "uber",
  Airbnb: "airbnb",
  Rolex: "rolex",
  Chanel: "chanel",
  Gucci: "gucci",
  Prada: "prada",
  "Louis Vuitton": "louisvuitton",
  Hermes: "hermes",
  Dior: "dior",
  Lacoste: "lacoste",
  Ferrari: "ferrari",
  Lamborghini: "lamborghini",
  Porsche: "porsche",
  "Mercedes-Benz": "mercedesbenz",
  BMW: "bmw",
  Audi: "audi",
  Tesla: "tesla",
  Toyota: "toyota",
  Volkswagen: "volkswagen",
  "Red Bull": "redbull",
  Visa: "visa",
  Mastercard: "mastercard",
  PayPal: "paypal",
  "Disney+": "disneyplus",
  Versace: "versace",
  Cartier: "cartier",
  Burberry: "burberry",
  Fendi: "fendi",
  Balenciaga: "balenciaga",
  Armani: "giorgioarmani",
  Valentino: "valentino",
  "Saint Laurent": "ysl",
  Moncler: "moncler",
  "Bottega Veneta": "bottegaveneta",
  Tiffany: "tiffanyandco",
  Omega: "omega",
  "Patek Philippe": "patekphilippe",
  Louboutin: "christianlouboutin",
  "Jimmy Choo": "jimmychoo",
  "Ray-Ban": "rayban",
  "Tom Ford": "tomford",
  Givenchy: "givenchy",
  Honda: "honda",
  Nissan: "nissan",
  Mazda: "mazda",
  Subaru: "subaru",
  Ford: "ford",
  Chevrolet: "chevrolet",
  Volvo: "volvo",
  Peugeot: "peugeot",
  Renault: "renault",
  Fiat: "fiat",
  Maserati: "maserati",
  Bugatti: "bugatti",
  "Aston Martin": "astonmartin",
  Jaguar: "jaguar",
  "Land Rover": "landrover",
  Mini: "mini",
  Kia: "kia",
  Hyundai: "hyundai",
  Skoda: "skoda",
  Seat: "seat",
  "Alfa Romeo": "alfaromeo",
  Bentley: "bentley",
  "Rolls-Royce": "rollsroyce",
  McLaren: "mclaren",
  Lotus: "lotus",
  Jeep: "jeep",
  Dodge: "dodge",
  Ram: "ram",
  Cadillac: "cadillac",
  Lexus: "lexus",
  Acura: "acura",
  "Real Madrid": "realmadrid",
  "FC Barcelona": "fcbarcelona",
  Barcelona: "fcbarcelona",
  "Manchester United": "manchesterunited",
  Liverpool: "liverpool",
  Arsenal: "arsenal",
  Chelsea: "chelsea",
  "Manchester City": "manchestercity",
  "Bayern Munich": "fcbayernmunich",
  "Borussia Dortmund": "borussiadortmund",
  Juventus: "juventus",
  Inter: "inter",
  "AC Milan": "acmilan",
  PSG: "parissaintgermain",
  Ajax: "ajax",
  Benfica: "benfica",
  Porto: "porto",
  Celtic: "celtic",
  Rangers: "rangers",
  Galatasaray: "galatasaray",
  Fenerbahce: "fenerbahce"
};

const WIKI_TOPIC_BY_SLUG = {
  chanel: "Chanel",
  lacoste: "Lacoste",
  gucci: "Gucci",
  versace: "Versace",
  "louis-vuitton": "Louis Vuitton",
  burberry: "Burberry",
  mercedesbenz: "Mercedes-Benz",
  "mercedes-benz": "Mercedes-Benz",
  "manchester-united": "Manchester United F.C.",
  juventus: "Juventus FC",
  pepsi: "Pepsi",
  lego: "The Lego Group",
  amazon: "Amazon (company)",
  microsoft: "Microsoft",
  xbox: "Xbox",
  nintendo: "Nintendo",
  rolex: "Rolex",
  prada: "Prada",
  "disney-plus": "Disney+",
  cartier: "Cartier (jeweler)",
  fendi: "Fendi",
  balenciaga: "Balenciaga",
  armani: "Giorgio Armani",
  valentino: "Valentino (fashion house)",
  "saint-laurent": "Yves Saint Laurent (brand)",
  moncler: "Moncler",
  "bottega-veneta": "Bottega Veneta",
  tiffany: "Tiffany & Co.",
  omega: "Omega SA",
  "patek-philippe": "Patek Philippe SA",
  louboutin: "Christian Louboutin",
  "jimmy-choo": "Jimmy Choo Ltd",
  "ray-ban": "Ray-Ban",
  "tom-ford": "Tom Ford",
  givenchy: "Givenchy",
  jaguar: "Jaguar Cars",
  "land-rover": "Land Rover",
  "alfa-romeo": "Alfa Romeo",
  lotus: "Lotus Cars",
  dodge: "Dodge",
  lexus: "Lexus",
  "real-madrid": "Real Madrid CF",
  barcelona: "FC Barcelona",
  "fc-barcelona": "FC Barcelona",
  liverpool: "Liverpool F.C.",
  arsenal: "Arsenal F.C.",
  chelsea: "Chelsea F.C.",
  "manchester-city": "Manchester City F.C.",
  "bayern-munich": "FC Bayern Munich",
  "borussia-dortmund": "Borussia Dortmund",
  inter: "Inter Milan",
  "ac-milan": "AC Milan",
  psg: "Paris Saint-Germain F.C.",
  ajax: "AFC Ajax",
  benfica: "S.L. Benfica",
  porto: "FC Porto",
  celtic: "Celtic F.C.",
  rangers: "Rangers F.C.",
  galatasaray: "Galatasaray S.K. (football)",
  fenerbahce: "Fenerbahce S.K. (football)",
  "venice-grand-canal": "Grand Canal (Venice)",
  "great-wall": "Great Wall of China",
  "blue-mosque": "Sultan Ahmed Mosque",
  "pyramids-of-giza": "Giza pyramid complex",
  "grand-palace": "Grand Palace",
  "louvre-pyramid": "Louvre Pyramid",
  "cn-tower": "CN Tower",
  "golden-gate-bridge": "Golden Gate Bridge",
  "santiago-bernabeu": "Santiago Bernabeu Stadium",
  "camp-nou": "Camp Nou",
  "old-trafford": "Old Trafford",
  "san-siro": "San Siro",
  "allianz-arena": "Allianz Arena",
  "signal-iduna-park": "Westfalenstadion",
  "parc-des-princes": "Parc des Princes",
  maracana: "Maracana Stadium"
};

const WIKI_BACKED_IMAGE_NAMES = new Set([
  "Chanel",
  "Lacoste",
  "Gucci",
  "Versace",
  "Louis Vuitton",
  "Burberry",
  "Mercedes-Benz",
  "Manchester United",
  "Juventus",
  "Pepsi",
  "Lego",
  "Amazon",
  "Microsoft",
  "Xbox",
  "Nintendo",
  "Rolex",
  "Prada",
  "Disney+",
  "Cartier",
  "Fendi",
  "Balenciaga",
  "Armani",
  "Valentino",
  "Saint Laurent",
  "Moncler",
  "Bottega Veneta",
  "Tiffany",
  "Omega",
  "Patek Philippe",
  "Louboutin",
  "Jimmy Choo",
  "Ray-Ban",
  "Tom Ford",
  "Givenchy",
  "Jaguar",
  "Land Rover",
  "Alfa Romeo",
  "Lotus",
  "Dodge",
  "Lexus",
  "Real Madrid",
  "FC Barcelona",
  "Barcelona",
  "Liverpool",
  "Arsenal",
  "Chelsea",
  "Manchester City",
  "Bayern Munich",
  "Borussia Dortmund",
  "Inter",
  "AC Milan",
  "PSG",
  "Ajax",
  "Benfica",
  "Porto",
  "Celtic",
  "Rangers",
  "Galatasaray",
  "Fenerbahce"
]);

const SUBJECT_BY_IMAGE_SLUG = {
  "nike-swoosh": "Nike",
  "golden-arches": "McDonald's",
  "three-stripes": "Adidas",
  siren: "Starbucks",
  "interlocking-c": "Chanel",
  crocodile: "Lacoste",
  gg: "Gucci",
  medusa: "Versace",
  lv: "Louis Vuitton",
  "check-pattern": "Burberry",
  bmw: "BMW",
  "bmw-badge": "BMW",
  lamborghini: "Lamborghini",
  "lamborghini-silhouette": "Lamborghini",
  "porsche-911": "Porsche",
  "three-pointed-star": "Mercedes-Benz",
  bull: "Lamborghini",
  "bull-badge": "Lamborghini",
  hypercar: "Bugatti",
  "red-devil": "Manchester United",
  "black-white-stripes": "Juventus",
  "orange-kit": "Netherlands"
};

const TEXT_CLUE_BY_ANSWER = {
  Shrek: "A green fairy-tale hero and a talking donkey.",
  "Finding Nemo": "A clownfish dad crosses the ocean.",
  "Back to the Future": "A DeLorean turns time travel into chaos.",
  Jaws: "A shark makes everyone rethink swimming.",
  Cars: "Lightning McQueen lives life in the fast lane.",
  "Toy Story": "Toys come alive when nobody is watching.",
  "The Lion King": "A young lion grows into his crown.",
  Frozen: "A snow queen, a sister rescue, and a very cheerful snowman.",
  "Star Wars": "Lightsabers, space battles, and the Force.",
  "Harry Potter": "A young wizard discovers a hidden magical world.",
  "Jurassic Park": "A dinosaur theme park goes very wrong.",
  Ghostbusters: "A crew catches ghosts for a living.",
  "The Matrix": "Reality is not quite what it seems.",
  Avatar: "Blue Na'vi, Pandora, and a huge sci-fi world.",
  "Spider-Man": "A web-slinging hero protects New York.",
  Batman: "A masked detective patrols Gotham.",
  Superman: "A caped hero from Krypton.",
  Wednesday: "A dark, deadpan student solves mysteries.",
  "Stranger Things": "Kids, Hawkins, and a monster-filled other side.",
  "The Office": "A paper company with painfully awkward meetings.",
  "Real Madrid": "The Spanish club known as Los Blancos.",
  Barcelona: "The Catalan club strongly linked with Camp Nou.",
  "Manchester United": "The English club nicknamed the Red Devils.",
  Liverpool: "The club that plays at Anfield.",
  Arsenal: "The London club nicknamed the Gunners.",
  Chelsea: "The London club known for royal blue shirts.",
  "Manchester City": "The sky-blue Manchester club.",
  "Bayern Munich": "The German giant from Bavaria.",
  "Borussia Dortmund": "The German club famous for yellow and black.",
  Juventus: "The Turin club nicknamed the Old Lady.",
  Inter: "The Milan club in blue and black.",
  "AC Milan": "The Milan club in red and black.",
  PSG: "The Paris club with big-star energy.",
  Ajax: "The Amsterdam club famous for its academy.",
  Benfica: "The Lisbon club with an eagle symbol.",
  Porto: "The Portuguese club from Porto.",
  Celtic: "The Glasgow club in green and white hoops.",
  Rangers: "The Glasgow club in royal blue.",
  Galatasaray: "The Istanbul club in red and yellow.",
  Fenerbahce: "The Istanbul club in yellow and navy."
};

function normalizeVisualQuestion(question) {
  if (question.mediaType !== "image" || !question.imageUrl) return question;
  const folder = visualFolder(question.imageUrl);
  const correctAnswer = question.choices?.[question.correctIndex] || "";
  const realImageUrl = realImageUrlForQuestion(folder, question.imageUrl, correctAnswer);

  if (!realImageUrl) return textFallbackQuestion(question, folder, correctAnswer);

  return {
    ...question,
    question: visualQuestionText(folder),
    imageUrl: realImageUrl,
    imageAlt: visualAltText(folder, correctAnswer, question.imageUrl),
    imageCaption: visualCaption(folder)
  };
}

function realImageUrlForQuestion(folder, originalUrl, correctAnswer) {
  const subject = subjectFromImageUrl(originalUrl);
  if (folder === "geography") return flagUrl(correctAnswer);
  if (folder === "landmarks") return wikiImageUrl(topicFromImageUrl(originalUrl));
  if (folder === "animals") return wikiImageUrl(animalTopic(subject));
  if (folder === "brands" || folder === "cars" || folder === "luxury-fashion") {
    return brandLikeImageUrl(correctAnswer) || brandLikeImageUrl(subject);
  }
  if (folder === "football") return footballImageUrl(correctAnswer, subject);
  if (folder === "movies-tv") return wikiImageUrl(movieTopic(correctAnswer));
  return null;
}

function footballImageUrl(correctAnswer, subject) {
  if (COUNTRY_CODE_BY_NAME[correctAnswer]) return flagUrl(correctAnswer);
  if (COUNTRY_CODE_BY_NAME[subject]) return flagUrl(subject);
  const stadiumName = [correctAnswer, subject].find((value) => /stadium|camp nou|anfield|old trafford|san siro|wembley|arena|maracana|bernabeu|parc des princes/i.test(value));
  if (stadiumName) {
    return wikiImageUrl(wikiTopic(stadiumName));
  }
  return brandLikeImageUrl(correctAnswer) || brandLikeImageUrl(subject);
}

function flagUrl(country) {
  const code = COUNTRY_CODE_BY_NAME[country];
  return code ? `https://flagcdn.com/w640/${code}.png` : null;
}

function simpleIconUrl(name) {
  const slug = SIMPLE_ICON_SLUG_BY_NAME[name];
  return slug ? `https://cdn.simpleicons.org/${slug}/ffffff` : null;
}

function brandLikeImageUrl(name) {
  if (!name) return null;
  if (!SIMPLE_ICON_SLUG_BY_NAME[name] && !WIKI_BACKED_IMAGE_NAMES.has(name)) return null;
  if (WIKI_BACKED_IMAGE_NAMES.has(name)) return wikiImageUrl(wikiTopic(name));
  return simpleIconUrl(name) || wikiImageUrl(wikiTopic(name));
}

function wikiImageUrl(topic) {
  return topic ? `/api/wiki-image?topic=${encodeURIComponent(topic)}` : null;
}

function animalTopic(animal) {
  return {
    Panda: "Giant panda",
    Orca: "Killer whale",
    Rhino: "Rhinoceros",
    Hippo: "Hippopotamus",
    "Fennec fox": "Fennec fox",
    "Whale shark": "Whale shark"
  }[animal] || animal;
}

function movieTopic(title) {
  return {
    Cars: "Cars (film)",
    Frozen: "Frozen (2013 film)",
    Avatar: "Avatar (2009 film)",
    Batman: "Batman",
    Wednesday: "Wednesday (TV series)",
    "The Office": "The Office (American TV series)",
    "Spider-Man": "Spider-Man"
  }[title] || title;
}

function visualQuestionText(folder) {
  if (folder === "geography") {
    return "Which country does this flag belong to?";
  }
  if (folder === "landmarks") {
    return "Which place is shown here?";
  }
  if (folder === "brands") return "Which brand uses this logo?";
  if (folder === "animals") return "Which animal is shown here?";
  if (folder === "cars") return "Which car brand uses this badge?";
  if (folder === "football") return "Which football club, country, or stadium is shown here?";
  if (folder === "movies-tv") return "Which movie or TV title is shown here?";
  if (folder === "luxury-fashion") return "Which fashion or luxury brand is shown here?";
  return "What is shown in this image?";
}

function visualCaption(folder) {
  if (folder === "brands") return "Logo question";
  if (folder === "geography") return "Flag question";
  if (folder === "landmarks") return "Landmark question";
  if (folder === "animals") return "Animal question";
  if (folder === "cars") return "Badge question";
  if (folder === "football") return "Football question";
  if (folder === "movies-tv") return "Screen question";
  if (folder === "luxury-fashion") return "Style question";
  return "Image question";
}

function visualAltText(folder, correctAnswer, originalUrl) {
  const subject = subjectFromImageUrl(originalUrl);
  if (folder === "geography") return `Flag for a country trivia question`;
  if (folder === "landmarks") return `Photo of ${topicFromImageUrl(originalUrl)}`;
  if (folder === "animals") return `Photo of an animal`;
  if (folder === "brands" || folder === "luxury-fashion" || folder === "cars") return `${subject || correctAnswer} logo`;
  if (folder === "football") return `${subject || correctAnswer} visual clue`;
  if (folder === "movies-tv") return `${correctAnswer} visual clue`;
  return "Trivia image";
}

function textFallbackQuestion(question, folder, correctAnswer) {
  const { mediaType, imageUrl, imageAlt, imageCaption, ...rest } = question;
  const clue = TEXT_CLUE_BY_ANSWER[correctAnswer];
  if (clue) {
    return {
      ...rest,
      question: `Which answer matches this clue: ${clue}`
    };
  }
  return rest;
}

function visualFolder(imageUrl) {
  return String(imageUrl).match(/\/images\/questions\/([^/]+)\//)?.[1] || "";
}

function topicFromImageUrl(imageUrl) {
  return wikiTopic(imageSlug(imageUrl));
}

function subjectFromImageUrl(imageUrl) {
  const slug = imageSlug(imageUrl);
  return SUBJECT_BY_IMAGE_SLUG[slug] || titleCase(slug);
}

function imageSlug(imageUrl) {
  const fileName = decodeURIComponent(String(imageUrl).split("/").pop() || "");
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/-placeholder$/, "")
    .replace(/-visual-clue$/, "")
    .replace(/-badge$/, "")
    .replace(/-silhouette$/, "");
}

function wikiTopic(value) {
  const slugValue = slugText(value);
  return WIKI_TOPIC_BY_SLUG[slugValue] || titleCase(slugValue);
}

function titleCase(slugValue) {
  return slugValue
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function slugText(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const TRIVIA_QUESTIONS = [
  ...BASE_TRIVIA_QUESTIONS.map((question) => ({
    ...question,
    ...(MEDIA_BY_ID[question.id] || {})
  })),
  ...EXPANDED_TRIVIA_QUESTIONS
].map(normalizeVisualQuestion);

export const QUESTION_BY_ID = Object.fromEntries(TRIVIA_QUESTIONS.map((question) => [question.id, question]));
