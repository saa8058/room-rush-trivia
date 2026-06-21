export const GENIUS_CATEGORIES = [
  "World History",
  "Hollywood",
  "Animal Kingdom",
  "Brands",
  "Geography",
  "Sports"
];

const geniusQuestion = (id, category, question, choices, correctIndex, explanation) => ({
  id,
  category,
  difficulty: "Hard",
  question,
  choices,
  correctIndex,
  explanation
});

let answerPositionCursor = 0;

function questionSet(prefix, category, entries) {
  const answerPool = [...new Set(entries.map(([, answer]) => answer))];
  return entries.map(([question, answer, explanation], index) => {
    const answerIndex = answerPool.indexOf(answer);
    const distractors = [];
    let cursor = answerIndex + index + 1;
    while (distractors.length < 3) {
      const candidate = answerPool[cursor % answerPool.length];
      if (candidate !== answer && !distractors.includes(candidate)) distractors.push(candidate);
      cursor += 1;
    }
    const correctIndex = answerPositionCursor % 4;
    answerPositionCursor += 1;
    const choices = [...distractors];
    choices.splice(correctIndex, 0, answer);
    return geniusQuestion(
      `genius-${prefix}-${String(index + 1).padStart(3, "0")}`,
      category,
      question,
      choices,
      correctIndex,
      explanation
    );
  });
}

const GENIUS_WORLD_HISTORY_BANK = [
  ...questionSet("history-ancient", "World History", [
    ["Which Akkadian ruler created one of history's earliest territorial empires?", "Sargon of Akkad", "Sargon unified Sumerian city-states under the Akkadian Empire in the 24th century BCE."],
    ["Which pharaoh promoted the worship of the Aten and founded Akhetaten?", "Akhenaten", "Akhenaten established a new royal capital at Akhetaten, now Amarna."],
    ["Who founded the Achaemenid Persian Empire after defeating the Medes?", "Cyrus the Great", "Cyrus founded the Achaemenid Empire in the sixth century BCE."],
    ["Which Carthaginian commander won the Battle of Cannae?", "Hannibal Barca", "Hannibal encircled and destroyed a much larger Roman army at Cannae in 216 BCE."],
    ["Which Mauryan emperor embraced Buddhism after the Kalinga War?", "Ashoka", "Ashoka's edicts describe his remorse after Kalinga and support for dhamma."],
    ["Which ruler established China's short-lived Qin dynasty and standardized its script and measures?", "Qin Shi Huang", "Qin Shi Huang became China's first emperor in 221 BCE."],
    ["Which Roman emperor issued the Edict of Milan with Licinius?", "Constantine I", "The Edict of Milan in 313 granted toleration to Christians in the Roman Empire."],
    ["Which ruler made Constantinople the capital of the Ottoman Empire after 1453?", "Mehmed II", "Mehmed II captured Constantinople and made it an Ottoman imperial capital."],
    ["Which West African emperor made a celebrated pilgrimage to Mecca in 1324?", "Mansa Musa", "Mansa Musa's lavish pilgrimage advertised Mali's extraordinary wealth."],
    ["Which Inca ruler began the rapid imperial expansion of Tawantinsuyu?", "Pachacuti", "Pachacuti reorganized the Inca state and launched major expansion in the 15th century."]
  ]),
  ...questionSet("history-battles", "World History", [
    ["In which year did the Battle of Salamis halt Xerxes' naval advance?", "480 BCE", "Greek fleets defeated the Persians at Salamis in 480 BCE."],
    ["In which year did Octavian defeat Antony and Cleopatra at Actium?", "31 BCE", "Actium in 31 BCE cleared Octavian's path to sole Roman rule."],
    ["In which year did the Battle of Talas occur between Abbasid and Tang forces?", "751", "The Battle of Talas was fought in Central Asia in 751."],
    ["In which year did William the Conqueror win at Hastings?", "1066", "The Norman conquest of England began with William's victory in 1066."],
    ["In which year did Saladin defeat the Crusader army at Hattin?", "1187", "Saladin's victory at Hattin in 1187 opened the way to Jerusalem."],
    ["In which year did the Mongols sack Baghdad and end the Abbasid caliphate there?", "1258", "Hulagu's forces captured Baghdad in 1258."],
    ["In which year did the first Battle of Kosovo occur?", "1389", "The battle on Kosovo Field was fought in 1389."],
    ["In which year did Tokugawa Ieyasu win the Battle of Sekigahara?", "1600", "Sekigahara in 1600 established Tokugawa dominance over Japan."],
    ["In which year did Napoleon win the Battle of Austerlitz?", "1805", "Napoleon defeated the Austrian and Russian armies at Austerlitz in 1805."],
    ["In which year did the Battle of Tsushima devastate Russia's Baltic Fleet?", "1905", "Japan's decisive naval victory at Tsushima came in May 1905."]
  ]),
  ...questionSet("history-treaties", "World History", [
    ["Which settlement ended the Thirty Years' War in 1648?", "Peace of Westphalia", "The Peace of Westphalia ended the Thirty Years' War and reshaped European diplomacy."],
    ["Which treaty divided newly encountered lands outside Europe between Spain and Portugal?", "Treaty of Tordesillas", "The 1494 treaty drew a papally sanctioned division line in the Atlantic world."],
    ["Which treaty ended the War of the Spanish Succession for most belligerents?", "Treaty of Utrecht", "The 1713 Treaty of Utrecht redistributed territories and recognized Philip V in Spain."],
    ["Which treaty formally ended the American Revolutionary War?", "Treaty of Paris (1783)", "Britain recognized United States independence in the 1783 Treaty of Paris."],
    ["Which agreement ended the First Opium War?", "Treaty of Nanking", "The 1842 Treaty of Nanking opened treaty ports and ceded Hong Kong to Britain."],
    ["Which treaty concluded the Russo-Japanese War?", "Treaty of Portsmouth", "The 1905 Treaty of Portsmouth was mediated by Theodore Roosevelt."],
    ["Which treaty imposed the principal peace terms on Germany after World War I?", "Treaty of Versailles", "The 1919 Treaty of Versailles was the principal Allied settlement with Germany."],
    ["Which agreement created the Irish Free State?", "Anglo-Irish Treaty", "The 1921 Anglo-Irish Treaty ended the Irish War of Independence."],
    ["Which pact normalized relations between West Germany and Poland in 1970?", "Treaty of Warsaw", "The 1970 Treaty of Warsaw recognized the Oder-Neisse border in practice."],
    ["Which 1998 agreement largely ended the Troubles in Northern Ireland?", "Good Friday Agreement", "The Good Friday Agreement established a power-sharing framework in Northern Ireland."]
  ]),
  ...questionSet("history-capitals", "World History", [
    ["Which city served as the ceremonial capital of the Achaemenid Empire?", "Persepolis", "Darius I developed Persepolis as a ceremonial imperial center."],
    ["Which city was the capital of the Western Roman Empire under Honorius from 402?", "Ravenna", "Ravenna's defensible marshes made it an imperial capital in late antiquity."],
    ["Which city was the Abbasid capital founded by al-Mansur in 762?", "Baghdad", "The Abbasids founded Baghdad as their Round City and imperial capital."],
    ["Which city was the political center of the Khmer Empire near Angkor Wat?", "Angkor Thom", "Angkor Thom was Jayavarman VII's great walled capital."],
    ["Which city was the Aztec imperial capital?", "Tenochtitlan", "Tenochtitlan stood on islands in Lake Texcoco beneath modern Mexico City."],
    ["Which city became the Mughal capital under Shah Jahan in 1648?", "Shahjahanabad", "Shah Jahan founded Shahjahanabad, the historic core of Old Delhi."],
    ["Which city was the Tokugawa shogunate's seat before it was renamed Tokyo?", "Edo", "The Tokugawa shoguns governed from Edo between 1603 and 1868."],
    ["Which city was the Safavid capital renowned for Naqsh-e Jahan Square?", "Isfahan", "Shah Abbas I made Isfahan the Safavid capital in 1598."],
    ["Which city served as the capital of the Russian Empire from 1712 to 1918?", "Saint Petersburg", "Peter the Great shifted the imperial capital to Saint Petersburg."],
    ["Which city was the final imperial capital of the Qing dynasty?", "Beijing", "Qing emperors governed from Beijing's Forbidden City."]
  ]),
  ...questionSet("history-revolutions", "World History", [
    ["Which uprising began with the Defenestration of Prague in 1618?", "Bohemian Revolt", "The Bohemian Revolt triggered the wider Thirty Years' War."],
    ["Which revolution overthrew James II of England in 1688?", "Glorious Revolution", "The Glorious Revolution installed William III and Mary II."],
    ["Which revolt was led by Túpac Amaru II in the Viceroyalty of Peru?", "Great Rebellion of 1780–1783", "Túpac Amaru II led a major anti-colonial Andean uprising."],
    ["Which revolution began with a successful slave uprising in Saint-Domingue?", "Haitian Revolution", "The Haitian Revolution produced the first independent Black republic in 1804."],
    ["Which 1825 revolt in Saint Petersburg challenged Nicholas I's accession?", "Decembrist Revolt", "Army officers led the failed Decembrist uprising in December 1825."],
    ["Which Chinese rebellion was led by Hong Xiuquan?", "Taiping Rebellion", "Hong claimed a divine mission and founded the Taiping Heavenly Kingdom."],
    ["Which uprising began among Indian soldiers at Meerut in 1857?", "Indian Rebellion of 1857", "The uprising spread across northern and central India and ended East India Company rule."],
    ["Which Mexican conflict began with Francisco Madero's Plan of San Luis Potosí?", "Mexican Revolution", "Madero's plan called for revolt against Porfirio Díaz in 1910."],
    ["Which 1911 uprising led to the fall of China's Qing dynasty?", "Xinhai Revolution", "The Xinhai Revolution established the Republic of China."],
    ["Which 1974 military coup ended Portugal's Estado Novo dictatorship?", "Carnation Revolution", "The nearly bloodless Carnation Revolution began Portugal's democratic transition."]
  ]),
  ...questionSet("history-documents", "World History", [
    ["Which law code is inscribed on a basalt stele topped by Shamash and a king?", "Code of Hammurabi", "The stele presents Hammurabi receiving authority from the sun god Shamash."],
    ["Which Persian artifact records Cyrus the Great's conquest of Babylon?", "Cyrus Cylinder", "The Cyrus Cylinder is a royal foundation text written after Babylon's conquest."],
    ["Which English charter was sealed at Runnymede in 1215?", "Magna Carta", "King John sealed Magna Carta after conflict with his barons."],
    ["Which Japanese constitution was traditionally attributed to Prince Shōtoku?", "Seventeen-Article Constitution", "The 604 document set out moral and political principles for officials."],
    ["Which collection of Castilian laws was commissioned by Alfonso X?", "Siete Partidas", "The Siete Partidas became one of medieval Europe's influential legal codes."],
    ["Which Ottoman decree of 1839 launched the Tanzimat reforms?", "Edict of Gülhane", "The Edict of Gülhane promised administrative, fiscal, and legal reforms."],
    ["Which manifesto opened with the declaration that a spectre was haunting Europe?", "The Communist Manifesto", "Marx and Engels published the manifesto in 1848."],
    ["Which papal encyclical of 1891 addressed labor and capital?", "Rerum Novarum", "Leo XIII's Rerum Novarum became foundational to modern Catholic social teaching."],
    ["Which 1917 declaration supported a national home for Jewish people in Palestine?", "Balfour Declaration", "British foreign secretary Arthur Balfour issued the declaration in 1917."],
    ["Which charter established the postwar international organization headquartered in New York?", "United Nations Charter", "Delegates signed the UN Charter in San Francisco in 1945."]
  ]),
  ...questionSet("history-exploration", "World History", [
    ["Who led the first recorded expedition to round the Cape of Good Hope?", "Bartolomeu Dias", "Dias rounded southern Africa in 1488."],
    ["Who completed the first circumnavigation after Magellan was killed?", "Juan Sebastián Elcano", "Elcano captained the Victoria back to Spain in 1522."],
    ["Which Ming admiral commanded seven major treasure voyages?", "Zheng He", "Zheng He led vast fleets across the Indian Ocean between 1405 and 1433."],
    ["Who crossed the Isthmus of Panama and became the first European to see the eastern Pacific?", "Vasco Núñez de Balboa", "Balboa sighted the ocean he called the South Sea in 1513."],
    ["Which explorer charted much of New Zealand and Australia's east coast in 1769–1770?", "James Cook", "Cook's first Pacific voyage produced detailed charts of both regions."],
    ["Who reached the South Pole first?", "Roald Amundsen", "Amundsen's Norwegian party arrived at the South Pole in December 1911."],
    ["Which explorer led the expedition that first navigated the Northwest Passage by ship?", "Roald Amundsen", "Amundsen's Gjøa expedition completed the passage from 1903 to 1906."],
    ["Who led the 1804–1806 American expedition to the Pacific with William Clark?", "Meriwether Lewis", "Lewis and Clark led the Corps of Discovery across the Louisiana Purchase."],
    ["Which traveler dictated a famous account of Yuan China while imprisoned in Genoa?", "Marco Polo", "Marco Polo's travels were recorded with writer Rustichello of Pisa."],
    ["Which Moroccan traveler described journeys across Africa and Asia in the Rihla?", "Ibn Battuta", "Ibn Battuta traveled widely through the Islamic world and beyond in the 14th century."]
  ]),
  ...questionSet("history-dynasties", "World History", [
    ["Which Chinese dynasty ruled during the voyages of Zheng He?", "Ming dynasty", "Zheng He's expeditions were sponsored by Ming emperors, especially the Yongle Emperor."],
    ["Which empire built most of the monuments now visible at Angkor?", "Khmer Empire", "Khmer rulers built Angkor's major temple and urban complexes."],
    ["Which dynasty ruled Iran when Persepolis was constructed?", "Achaemenid dynasty", "Darius I and successors built Persepolis under Achaemenid rule."],
    ["Which dynasty ruled northern India when the Taj Mahal was built?", "Mughal dynasty", "Shah Jahan commissioned the Taj Mahal during Mughal rule."],
    ["Which Japanese clan established the Kamakura shogunate?", "Minamoto clan", "Minamoto no Yoritomo became shogun and founded the Kamakura government."],
    ["Which dynasty ruled Egypt when Tutankhamun was pharaoh?", "Eighteenth Dynasty", "Tutankhamun belonged to Egypt's New Kingdom Eighteenth Dynasty."],
    ["Which dynasty governed France immediately before the 1789 Revolution?", "Bourbon dynasty", "Louis XVI was a member of the Bourbon dynasty."],
    ["Which dynasty founded the Russian state centered on Moscow before the Romanovs?", "Rurik dynasty", "The Rurikids ruled Muscovy and early Russia until 1598."],
    ["Which dynasty reunited much of Persia under Twelver Shi'ism in the 16th century?", "Safavid dynasty", "The Safavids made Twelver Shi'ism central to the Iranian state."],
    ["Which dynasty was China's last imperial house?", "Qing dynasty", "The Qing dynasty ended with the 1911 Revolution and 1912 abdication."]
  ]),
  ...questionSet("history-20c", "World History", [
    ["Who led China's Nationalist government during most of the Second Sino-Japanese War?", "Chiang Kai-shek", "Chiang led the Republic of China's Nationalist government from Chongqing during much of the war."],
    ["Who was prime minister of India when the country became independent in 1947?", "Jawaharlal Nehru", "Nehru became independent India's first prime minister."],
    ["Who led Egypt during the 1956 Suez Crisis?", "Gamal Abdel Nasser", "Nasser's nationalization of the canal precipitated the Suez Crisis."],
    ["Who delivered the 'Wind of Change' speech in Cape Town in 1960?", "Harold Macmillan", "The British prime minister acknowledged the force of African nationalism."],
    ["Who became Ghana's first prime minister and later its first president?", "Kwame Nkrumah", "Nkrumah was a central figure in Ghanaian independence and Pan-Africanism."],
    ["Who led the Viet Minh at the 1954 Battle of Dien Bien Phu politically?", "Ho Chi Minh", "Ho Chi Minh led the Democratic Republic of Vietnam and the Viet Minh movement."],
    ["Who initiated the Soviet policies of glasnost and perestroika?", "Mikhail Gorbachev", "Gorbachev introduced both reform programs in the 1980s."],
    ["Who was Chile's president when the 1973 military coup occurred?", "Salvador Allende", "Allende's government was overthrown on September 11, 1973."],
    ["Who became South Africa's first president elected by universal suffrage?", "Nelson Mandela", "Mandela took office after South Africa's 1994 multiracial election."],
    ["Who chaired the Palestine Liberation Organization during the 1993 Oslo Accords?", "Yasser Arafat", "Arafat signed the first Oslo agreement on behalf of the PLO."]
  ]),
  ...questionSet("history-sites", "World History", [
    ["What is known about the ethnic identity of the people who built Teotihuacan?", "It remains unknown", "Teotihuacan predated the Aztec Empire, and its builders' own name is unknown."],
    ["Which civilization built the palace complex at Knossos?", "Minoans", "Knossos was the principal palace center of Bronze Age Minoan Crete."],
    ["Which culture carved the monumental heads at San Lorenzo and La Venta?", "Olmecs", "The Olmec created colossal basalt heads in ancient Mesoamerica."],
    ["Which people built the cliff dwellings at Mesa Verde?", "Ancestral Puebloans", "Ancestral Pueblo communities built Mesa Verde's famous dwellings."],
    ["Which kingdom built the rock-hewn churches of Lalibela?", "Zagwe dynasty", "The churches are traditionally associated with King Lalibela of the Zagwe dynasty."],
    ["Which civilization built the Great Zimbabwe stone complex?", "Shona civilization", "Ancestors of the Shona built Great Zimbabwe between roughly the 11th and 15th centuries."],
    ["Which ancient people built the city of Petra?", "Nabataeans", "Petra was the rock-cut capital of the Nabataean kingdom."],
    ["Which civilization founded the city of Carthage?", "Phoenicians", "Settlers from Phoenician Tyre traditionally founded Carthage."],
    ["Which empire constructed the road system centered on Cusco called the Qhapaq Ñan?", "Inca Empire", "The Qhapaq Ñan linked the vast territories of Tawantinsuyu."],
    ["Which culture created the terracotta warriors buried near Xi'an?", "Qin dynasty", "The army guarded the mausoleum of Qin Shi Huang."]
  ]),
  ...questionSet("history-institutions", "World History", [
    ["What was the deliberative council of elders in ancient Sparta called?", "Gerousia", "The Gerousia consisted of 28 elders plus Sparta's two kings."],
    ["What was the popular assembly of male citizens in classical Athens called?", "Ekklesia", "The Ekklesia voted on major matters of Athenian policy."],
    ["What was the elite infantry corps of the Ottoman sultan called?", "Janissaries", "The Janissaries began as an elite standing infantry force."],
    ["What was the mounted warrior class of premodern Japan called?", "Samurai", "Samurai served military lords and developed a distinct warrior culture."],
    ["What was the examination-selected scholar-official class of imperial China commonly called?", "Mandarins", "European writers used 'mandarins' for China's educated civil officials."],
    ["What was the representative assembly of the three estates in pre-revolutionary France?", "Estates-General", "The Estates-General represented clergy, nobility, and the Third Estate."],
    ["What name was given to local workers' councils during the Russian revolutions?", "Soviets", "Soviets were councils of workers, soldiers, and sometimes peasants."],
    ["What was the governing council of the Venetian Republic called?", "Great Council", "The Great Council was the central assembly of Venice's patriciate."],
    ["What was the assembly of princes in the Holy Roman Empire called?", "Imperial Diet", "The Imperial Diet brought together the empire's estates."],
    ["What was the deliberative assembly of the Mongol elite that selected khans?", "Kurultai", "A kurultai gathered leading nobles to make major political decisions."]
  ])
];

const GENIUS_HOLLYWOOD_BANK = [
  ...questionSet("hollywood-directors", "Hollywood", [
    ["Who directed the 1950 film Sunset Boulevard?", "Billy Wilder", "Billy Wilder directed and co-wrote the Hollywood noir classic."],
    ["Who directed The Night of the Hunter?", "Charles Laughton", "The 1955 film was Charles Laughton's only credited feature as director."],
    ["Who directed Lawrence of Arabia?", "David Lean", "David Lean directed the 1962 historical epic."],
    ["Who directed The Conversation?", "Francis Ford Coppola", "Coppola wrote, produced, and directed the 1974 surveillance thriller."],
    ["Who directed Days of Heaven?", "Terrence Malick", "Terrence Malick directed the 1978 period drama."],
    ["Who directed Do the Right Thing?", "Spike Lee", "Spike Lee wrote, produced, and directed the 1989 film."],
    ["Who directed The Silence of the Lambs?", "Jonathan Demme", "Jonathan Demme won the Academy Award for directing the film."],
    ["Who directed L.A. Confidential?", "Curtis Hanson", "Curtis Hanson directed and co-wrote the 1997 neo-noir."],
    ["Who directed There Will Be Blood?", "Paul Thomas Anderson", "Paul Thomas Anderson wrote and directed the 2007 drama."],
    ["Who directed Moonlight?", "Barry Jenkins", "Barry Jenkins directed and co-wrote the 2016 Best Picture winner."]
  ]),
  ...questionSet("hollywood-performers", "Hollywood", [
    ["Who played newspaper editor Walter Burns in His Girl Friday?", "Cary Grant", "Cary Grant starred opposite Rosalind Russell in the 1940 screwball comedy."],
    ["Who played Norma Desmond in Sunset Boulevard?", "Gloria Swanson", "Swanson's performance became one of classic Hollywood's defining portraits."],
    ["Who played Terry Malloy in On the Waterfront?", "Marlon Brando", "Brando won the Best Actor Oscar for the role."],
    ["Who played Mrs. Robinson in The Graduate?", "Anne Bancroft", "Anne Bancroft played the film's famously seductive Mrs. Robinson."],
    ["Who played Popeye Doyle in The French Connection?", "Gene Hackman", "Hackman won Best Actor for portraying New York detective Jimmy 'Popeye' Doyle."],
    ["Who played nurse Ratched in One Flew Over the Cuckoo's Nest?", "Louise Fletcher", "Fletcher won Best Actress for the performance."],
    ["Who played Travis Bickle in Taxi Driver?", "Robert De Niro", "De Niro portrayed the isolated New York cab driver."],
    ["Who played Celie in The Color Purple (1985)?", "Whoopi Goldberg", "Goldberg made her major film breakthrough as Celie."],
    ["Who played Daniel Plainview in There Will Be Blood?", "Daniel Day-Lewis", "Day-Lewis won his second Best Actor Oscar for the role."],
    ["Who played Lydia Tár in Tár?", "Cate Blanchett", "Blanchett portrayed the fictional conductor in Todd Field's film."]
  ]),
  ...questionSet("hollywood-composers", "Hollywood", [
    ["Who composed the score for The Adventures of Robin Hood (1938)?", "Erich Wolfgang Korngold", "Korngold's swashbuckling score won an Academy Award."],
    ["Who composed Psycho's famous string-driven score?", "Bernard Herrmann", "Herrmann's shrieking string writing is inseparable from Psycho."],
    ["Who composed the score for The Good, the Bad and the Ugly?", "Ennio Morricone", "Morricone created the film's iconic whistles, voices, and electric textures."],
    ["Who composed the jazz-inflected score for The Pink Panther?", "Henry Mancini", "Mancini wrote the famous Pink Panther Theme."],
    ["Who composed the score for Jaws?", "John Williams", "Williams's two-note shark motif won an Academy Award."],
    ["Who composed the electronic score for Chariots of Fire?", "Vangelis", "Vangelis won the Oscar for the film's synthesizer-led score."],
    ["Who composed the score for The Last Emperor?", "Ryuichi Sakamoto", "Sakamoto shared the film's original-score Oscar with David Byrne and Cong Su."],
    ["Who composed the score for The Lion King (1994)?", "Hans Zimmer", "Zimmer won his first Academy Award for the film's score."],
    ["Who composed the score for Crouching Tiger, Hidden Dragon?", "Tan Dun", "Tan Dun won the Academy Award for the film's score."],
    ["Who composed the score for If Beale Street Could Talk?", "Nicholas Britell", "Britell's romantic orchestral score received an Oscar nomination."]
  ]),
  ...questionSet("hollywood-cinematography", "Hollywood", [
    ["Who photographed Citizen Kane with its celebrated deep-focus imagery?", "Gregg Toland", "Gregg Toland collaborated with Orson Welles on the film's radical visual design."],
    ["Who was the cinematographer of The Red Shoes?", "Jack Cardiff", "Jack Cardiff's Technicolor photography helped define the film's visual splendor."],
    ["Who photographed The Godfather and became known as the 'Prince of Darkness'?", "Gordon Willis", "Gordon Willis used low-key lighting throughout The Godfather trilogy."],
    ["Who shot Days of Heaven and won an Academy Award for it?", "Néstor Almendros", "Almendros used extensive natural light during the film's magic-hour photography."],
    ["Who was the cinematographer of Blade Runner?", "Jordan Cronenweth", "Cronenweth created the film's smoky, neon-lit visual world."],
    ["Who photographed Schindler's List?", "Janusz Kamiński", "Kamiński won an Academy Award for the film's black-and-white cinematography."],
    ["Who shot In the Mood for Love with Christopher Doyle sharing credit?", "Mark Lee Ping-bing", "Mark Lee Ping-bing and Christopher Doyle are credited for the film's cinematography."],
    ["Who was the cinematographer of Children of Men?", "Emmanuel Lubezki", "Lubezki's camera work includes the film's celebrated extended takes."],
    ["Who photographed The Assassination of Jesse James by the Coward Robert Ford?", "Roger Deakins", "Deakins earned an Oscar nomination for the film's lyrical images."],
    ["Who shot Portrait of a Lady on Fire?", "Claire Mathon", "Mathon's controlled naturalistic photography was widely acclaimed."]
  ]),
  ...questionSet("hollywood-screenwriters", "Hollywood", [
    ["Who wrote the screenplay for Chinatown?", "Robert Towne", "Towne won the Academy Award for his original screenplay."],
    ["Who wrote Network?", "Paddy Chayefsky", "Chayefsky won his third solo screenwriting Oscar for Network."],
    ["Who adapted The Godfather with Francis Ford Coppola?", "Mario Puzo", "Puzo and Coppola adapted Puzo's novel together."],
    ["Who wrote the screenplay for Butch Cassidy and the Sundance Kid?", "William Goldman", "Goldman won an Oscar for the original screenplay."],
    ["Who wrote and directed The Apartment with I. A. L. Diamond as co-writer?", "Billy Wilder", "Wilder and Diamond won the screenplay Oscar for the film."],
    ["Who wrote Eternal Sunshine of the Spotless Mind?", "Charlie Kaufman", "Kaufman shared the original-screenplay Oscar with Michel Gondry and Pierre Bismuth."],
    ["Who adapted No Country for Old Men for the screen with his brother?", "Joel Coen", "Joel and Ethan Coen jointly wrote, directed, produced, and edited the film."],
    ["Who wrote Get Out?", "Jordan Peele", "Peele won the Academy Award for Best Original Screenplay."],
    ["Who wrote the screenplay for The Social Network?", "Aaron Sorkin", "Sorkin adapted Ben Mezrich's book and won an Oscar."],
    ["Who adapted Women Talking from Miriam Toews's novel?", "Sarah Polley", "Polley won the Academy Award for Best Adapted Screenplay."]
  ]),
  ...questionSet("hollywood-years", "Hollywood", [
    ["In what year was The Cabinet of Dr. Caligari released?", "1920", "The German Expressionist landmark premiered in 1920."],
    ["In what year was Metropolis released?", "1927", "Fritz Lang's science-fiction epic premiered in 1927."],
    ["In what year was It Happened One Night released?", "1934", "The film swept the five major Academy Awards after its 1934 release."],
    ["In what year was The Third Man released in the United Kingdom?", "1949", "Carol Reed's noir premiered in Britain in 1949."],
    ["In what year was Seven Samurai released in Japan?", "1954", "Akira Kurosawa's epic debuted in 1954."],
    ["In what year was The Battle of Algiers first released?", "1966", "Gillo Pontecorvo's film premiered in 1966."],
    ["In what year was Nashville released?", "1975", "Robert Altman's ensemble film opened in 1975."],
    ["In what year was Blue Velvet released?", "1986", "David Lynch's mystery premiered in 1986."],
    ["In what year was Pulp Fiction released?", "1994", "Quentin Tarantino's film won the Palme d'Or before its 1994 theatrical release."],
    ["In what year was Parasite first released in South Korea?", "2019", "Bong Joon Ho's film premiered at Cannes and opened in South Korea in 2019."]
  ]),
  ...questionSet("hollywood-oscars", "Hollywood", [
    ["Which film was the first to win the Academy Award for Best Picture?", "Wings", "Wings won Outstanding Picture at the first Academy Awards."],
    ["Which film was the first non-English-language winner of Best Picture?", "Parasite", "Parasite made history at the 92nd Academy Awards."],
    ["Which performer was the first Black winner of an acting Oscar?", "Hattie McDaniel", "McDaniel won Supporting Actress for Gone with the Wind."],
    ["Which filmmaker was the first woman to win Best Director?", "Kathryn Bigelow", "Bigelow won for The Hurt Locker."],
    ["Which actor was the first to win three Academy Awards for Best Actor?", "Daniel Day-Lewis", "His third win came for Lincoln."],
    ["Which film is the only X-rated production to win Best Picture?", "Midnight Cowboy", "Midnight Cowboy won Best Picture after initially receiving an X rating."],
    ["Which sequel was the first to win Best Picture?", "The Godfather Part II", "The 1974 sequel became the first Best Picture-winning sequel."],
    ["Which animated feature was the first nominated for Best Picture?", "Beauty and the Beast", "The 1991 Disney film received a Best Picture nomination."],
    ["Who was the first Asian woman to win Best Actress?", "Michelle Yeoh", "Yeoh won for Everything Everywhere All at Once."],
    ["Which film won all eleven Academy Awards for which it was nominated in 2004?", "The Lord of the Rings: The Return of the King", "The film tied the record for most wins and completed a perfect 11-for-11 sweep."]
  ]),
  ...questionSet("hollywood-studios", "Hollywood", [
    ["Which studio was founded in 1919 by Mary Pickford, Douglas Fairbanks, Charlie Chaplin, and D. W. Griffith?", "United Artists", "The four artists created United Artists to control distribution of their work."],
    ["Which studio's classic logo features Leo the Lion?", "Metro-Goldwyn-Mayer", "MGM has used a roaring lion emblem since the silent era."],
    ["Which animation studio produced the theatrical short Steamboat Willie?", "Walt Disney Studio", "The Disney studio released the synchronized-sound Mickey Mouse short in 1928."],
    ["Which studio produced the Universal Monsters cycle of the 1930s and 1940s?", "Universal Pictures", "Universal built an enduring horror brand around Dracula, Frankenstein, and related characters."],
    ["Which studio was associated with the shield logo and the classic Looney Tunes shorts?", "Warner Bros.", "Warner Bros. distributed the Looney Tunes and Merrie Melodies series."],
    ["Which studio was created from the 1935 merger of Fox Film and Twentieth Century Pictures?", "20th Century Fox", "The merger formed Twentieth Century-Fox Film Corporation."],
    ["Which company produced Toy Story, the first fully computer-animated feature?", "Pixar", "Pixar produced Toy Story for release by Disney in 1995."],
    ["Which independent company distributed Pulp Fiction in the United States?", "Miramax", "Miramax distributed Pulp Fiction in the United States."],
    ["Which studio released the original Godzilla in 1954?", "Toho", "Japanese studio Toho created and released the first Godzilla film."],
    ["Which company produced Spirited Away?", "Studio Ghibli", "Hayao Miyazaki made Spirited Away at Studio Ghibli."]
  ]),
  ...questionSet("hollywood-characters", "Hollywood", [
    ["In which film does private detective J. J. Gittes investigate Los Angeles water corruption?", "Chinatown", "Jack Nicholson's J. J. Gittes is the protagonist of Chinatown."],
    ["In which film does Harry Lime dominate the story despite appearing late?", "The Third Man", "Orson Welles plays the elusive Harry Lime in postwar Vienna."],
    ["In which film is the protagonist named Antoine Doinel?", "The 400 Blows", "Jean-Pierre Léaud introduced François Truffaut's recurring character Antoine Doinel."],
    ["In which film does the computer HAL 9000 control a Jupiter mission?", "2001: A Space Odyssey", "HAL operates the Discovery One spacecraft."],
    ["In which film is the outlaw Pike Bishop leader of an aging gang?", "The Wild Bunch", "William Holden plays Pike Bishop in Sam Peckinpah's western."],
    ["In which film is the replicant Roy Batty pursued by Rick Deckard?", "Blade Runner", "Rutger Hauer's Roy Batty is a central replicant in Blade Runner."],
    ["In which film does Marge Gunderson investigate roadside murders?", "Fargo", "Frances McDormand plays the pregnant Minnesota police chief."],
    ["In which film is Chihiro trapped in a spirit bathhouse?", "Spirited Away", "Chihiro must work for Yubaba to save her parents."],
    ["In which film is Daniel Plainview a ruthless oil prospector?", "There Will Be Blood", "Daniel Day-Lewis plays Plainview in Paul Thomas Anderson's drama."],
    ["In which film does Furiosa rebel against Immortan Joe?", "Mad Max: Fury Road", "Imperator Furiosa drives the War Rig in the 2015 film."]
  ]),
  ...questionSet("hollywood-technique", "Hollywood", [
    ["Which film popularized a zoom combined with a reverse dolly to convey vertigo?", "Vertigo", "The dolly zoom is strongly associated with Hitchcock's 1958 film."],
    ["Which film's production designer Ken Adam created a vast volcano lair set?", "You Only Live Twice", "Adam's enormous SPECTRE set became a landmark of Bond production design."],
    ["Which film used the slit-scan process for its Stargate sequence?", "2001: A Space Odyssey", "Douglas Trumbull helped develop slit-scan effects for the sequence."],
    ["Which film used a Steadicam extensively in its hotel corridors and hedge maze?", "The Shining", "Garrett Brown operated the Steadicam for many of the film's fluid tracking shots."],
    ["Which film used motion-control photography to multiply spacecraft passes against star fields?", "Star Wars", "Industrial Light & Magic's Dykstraflex system enabled repeatable camera moves."],
    ["Which film's liquid-metal antagonist showcased morphing computer effects by ILM?", "Terminator 2: Judgment Day", "The T-1000 was a breakthrough in digital character effects."],
    ["Which film used bullet-time photography as a signature visual effect?", "The Matrix", "An array of still cameras created the film's famous time-slice effect."],
    ["Which film was shot over twelve years with the same principal cast?", "Boyhood", "Richard Linklater filmed Boyhood intermittently from 2002 to 2013."],
    ["Which film simulated a single continuous take while following two soldiers in World War I?", "1917", "Carefully hidden edits create the appearance of one unbroken journey."],
    ["Which film used LED-wall virtual production extensively for its alien-world environments?", "The Mandalorian", "The series popularized StageCraft's real-time LED volume workflow."]
  ]),
  ...questionSet("hollywood-locations", "Hollywood", [
    ["Which California mansion supplied the exterior of Norma Desmond's home in Sunset Boulevard?", "Getty Mansion", "The former William O. Jenkins house, later called the Getty Mansion, supplied the exterior."],
    ["Which Los Angeles landmark appears as the setting for the final confrontation in Rebel Without a Cause?", "Griffith Observatory", "The observatory is one of the film's most recognizable locations."],
    ["Which New York building stood in for the apartment block in Rosemary's Baby?", "The Dakota", "The Dakota's exterior became the fictional Bramford building."],
    ["Which Tunisian location gave Luke Skywalker's home planet its name?", "Tataouine", "George Lucas adapted the nearby town's name as Tatooine."],
    ["Which Philadelphia museum steps became inseparable from Rocky's training montage?", "Philadelphia Museum of Art", "Rocky's run ends at the museum's east entrance steps."],
    ["Which hotel supplied the exterior of the Overlook Hotel in The Shining?", "Timberline Lodge", "Oregon's Timberline Lodge appears in exterior shots."],
    ["Which Chicago building served as Nakatomi Plaza in Die Hard?", "Fox Plaza", "The Los Angeles skyscraper Fox Plaza played the fictional Nakatomi building."],
    ["Which English castle was used for exterior shots of Hogwarts in the first two Harry Potter films?", "Alnwick Castle", "Alnwick's courtyards appear in early Hogwarts flying scenes."],
    ["Which Jordanian site portrayed the exterior of the Grail temple in Indiana Jones and the Last Crusade?", "Petra", "Petra's Treasury façade appears as the temple entrance."],
    ["Which Seoul neighborhood's steep stairways and alleys informed key locations in Parasite?", "Ahyeon-dong", "The production drew on Seoul's hillside neighborhoods, including Ahyeon-dong."]
  ])
];

const GENIUS_ANIMAL_KINGDOM_BANK = [
  ...questionSet("animals-taxonomy", "Animal Kingdom", [
    ["To which mammalian order do pangolins belong?", "Pholidota", "Pangolins are the only living members of the order Pholidota."],
    ["To which mammalian order do aardvarks belong?", "Tubulidentata", "The aardvark is the sole living species of Tubulidentata."],
    ["To which order do rabbits and hares belong?", "Lagomorpha", "Lagomorphs include rabbits, hares, and pikas."],
    ["To which order do manatees and dugongs belong?", "Sirenia", "Sirenia contains the fully aquatic herbivorous mammals called sea cows."],
    ["To which order do bats belong?", "Chiroptera", "Chiroptera means 'hand wing' and includes all bats."],
    ["To which order do elephants belong?", "Proboscidea", "Living proboscideans are the African and Asian elephants."],
    ["To which order do armadillos belong?", "Cingulata", "Cingulata is the armored mammal order containing armadillos."],
    ["To which order do monotremes such as echidnas belong?", "Monotremata", "Monotremata contains the egg-laying mammals."],
    ["To which order do ostriches, rheas, and kiwis traditionally belong?", "Struthioniformes", "Traditional classifications group these flightless palaeognaths as ratites in Struthioniformes."],
    ["To which order do crocodiles, alligators, caimans, and gharials belong?", "Crocodylia", "All living crocodilians belong to the order Crocodylia."]
  ]),
  ...questionSet("animals-scientific", "Animal Kingdom", [
    ["Which animal has the scientific name Okapia johnstoni?", "Okapi", "Okapia johnstoni is the forest-dwelling giraffid known as the okapi."],
    ["Which animal has the scientific name Daubentonia madagascariensis?", "Aye-aye", "The aye-aye is a nocturnal lemur endemic to Madagascar."],
    ["Which animal has the scientific name Balaenoptera musculus?", "Blue whale", "Balaenoptera musculus is the largest known animal."],
    ["Which animal has the scientific name Ornithorhynchus anatinus?", "Platypus", "The platypus is an egg-laying monotreme native to eastern Australia."],
    ["Which animal has the scientific name Panthera uncia?", "Snow leopard", "The snow leopard is classified in the big-cat genus Panthera."],
    ["Which animal has the scientific name Vulpes zerda?", "Fennec fox", "Vulpes zerda is the small desert fox with exceptionally large ears."],
    ["Which animal has the scientific name Giraffa camelopardalis in the traditional classification?", "Northern giraffe", "Giraffa camelopardalis traditionally referred broadly to the giraffe and now often to the northern species."],
    ["Which animal has the scientific name Rhincodon typus?", "Whale shark", "Rhincodon typus is the world's largest living fish."],
    ["Which animal has the scientific name Aptenodytes forsteri?", "Emperor penguin", "Aptenodytes forsteri is the largest living penguin species."],
    ["Which animal has the scientific name Ambystoma mexicanum?", "Axolotl", "The axolotl is a neotenic salamander native to the Valley of Mexico."]
  ]),
  ...questionSet("animals-groups", "Animal Kingdom", [
    ["What is a group of flamingos commonly called?", "Flamboyance", "A group of flamingos is popularly called a flamboyance."],
    ["What is a group of crows commonly called?", "Murder", "The traditional collective noun for crows is a murder."],
    ["What is a group of rhinoceroses commonly called?", "Crash", "A group of rhinos is often called a crash."],
    ["What is a group of ferrets commonly called?", "Business", "The traditional collective noun for ferrets is a business."],
    ["What is a group of owls commonly called?", "Parliament", "A group of owls is popularly called a parliament."],
    ["What is a group of porcupines commonly called?", "Prickle", "The playful collective noun for porcupines is a prickle."],
    ["What is a group of hippopotamuses commonly called?", "Bloat", "A group of hippos may be called a bloat."],
    ["What is a group of giraffes standing together commonly called?", "Tower", "A standing group of giraffes is commonly called a tower."],
    ["What is a group of jellyfish commonly called?", "Smack", "A group of jellyfish is sometimes called a smack."],
    ["What is a group of ravens commonly called?", "Unkindness", "The traditional collective noun for ravens is an unkindness."]
  ]),
  ...questionSet("animals-anatomy", "Animal Kingdom", [
    ["What is the hard external covering of many arthropods called?", "Exoskeleton", "An exoskeleton supports and protects an arthropod from outside the body."],
    ["What organ lets many bony fish regulate buoyancy?", "Swim bladder", "Fish adjust gas in the swim bladder to change buoyancy."],
    ["What is the rasping feeding organ of most mollusks called?", "Radula", "The radula is a ribbon-like structure bearing rows of tiny teeth."],
    ["What structure filters plankton from water in baleen whales?", "Baleen plates", "Keratinous baleen plates hang from the upper jaw and sieve prey."],
    ["What is the light-producing organ of an animal called?", "Photophore", "Photophores generate or emit bioluminescent light."],
    ["What sensory organs detect electrical fields in sharks and rays?", "Ampullae of Lorenzini", "These jelly-filled pores detect weak electric fields in surrounding water."],
    ["What is the muscular digestive chamber that grinds food in birds called?", "Gizzard", "The gizzard mechanically breaks down food, often with swallowed grit."],
    ["What breathing tubes deliver air directly through an insect's body?", "Tracheae", "Insects exchange gases through a branching tracheal system."],
    ["What specialized foot structure lets geckos adhere to smooth surfaces?", "Setae", "Microscopic setae branch into spatulae that exploit molecular attraction."],
    ["What chambered shell structure controls buoyancy in a nautilus?", "Phragmocone", "The nautilus regulates gas and fluid across the phragmocone's chambers."]
  ]),
  ...questionSet("animals-adaptations", "Animal Kingdom", [
    ["What process allows an axolotl to retain larval features into adulthood?", "Neoteny", "Axolotls remain aquatic and keep external gills after reaching sexual maturity."],
    ["What heat-exchange arrangement helps penguins reduce warmth lost through their legs?", "Countercurrent exchange", "Adjacent arteries and veins transfer heat before blood reaches exposed extremities."],
    ["What is seasonal dormancy during hot or dry conditions called?", "Aestivation", "Aestivation reduces activity and metabolism during heat or drought."],
    ["What is the production of metabolic water from oxidizing food called?", "Metabolic water", "Desert animals can meet part of their water needs through cellular respiration."],
    ["What camouflage strategy makes an animal resemble an inedible object?", "Masquerade", "Masquerading animals are misidentified as twigs, leaves, stones, or other objects."],
    ["What is the reflective eye layer that improves night vision in many mammals?", "Tapetum lucidum", "The tapetum reflects light back through the retina."],
    ["What oxygen-binding protein gives some mollusks blue blood?", "Hemocyanin", "Hemocyanin uses copper rather than iron to transport oxygen."],
    ["What protein helps tardigrades protect their cells during extreme drying?", "TDP proteins", "Tardigrade-specific intrinsically disordered proteins help stabilize cellular material."],
    ["What process lets some reptiles reproduce from unfertilized eggs?", "Parthenogenesis", "Parthenogenesis produces offspring without fertilization."],
    ["What insulating fat layer lies beneath the skin of whales and seals?", "Blubber", "Blubber stores energy and slows heat loss in cold water."]
  ]),
  ...questionSet("animals-biogeography", "Animal Kingdom", [
    ["On which island is the fossa naturally found?", "Madagascar", "The fossa is Madagascar's largest native carnivorous mammal."],
    ["To which country is the kākāpō endemic?", "New Zealand", "The flightless nocturnal parrot survives only in New Zealand."],
    ["On which island group are marine iguanas native?", "Galápagos Islands", "Marine iguanas evolved on the Galápagos and forage in the sea."],
    ["In which mountain system does the wild giant panda naturally occur?", "Qinling and Minshan Mountains", "Wild pandas inhabit fragmented bamboo forests in central China."],
    ["On which Indonesian islands are wild orangutans native?", "Borneo and Sumatra", "The living orangutan species occur naturally on Borneo and Sumatra."],
    ["To which island is the Tasmanian devil now naturally confined?", "Tasmania", "The species disappeared from mainland Australia thousands of years ago."],
    ["In which African region is the okapi endemic?", "Ituri rainforest", "The okapi inhabits dense forests of the northeastern Democratic Republic of the Congo."],
    ["On which islands is the tuatara endemic?", "New Zealand offshore islands", "Tuatara survive naturally on protected islands and in fenced sanctuaries."],
    ["In which desert is the addax naturally adapted to live?", "Sahara", "The addax is a critically endangered antelope of the Sahara."],
    ["Along which river system is the Amazon river dolphin primarily found?", "Amazon-Orinoco basins", "The boto inhabits freshwater rivers and flooded forests in both basins."]
  ]),
  ...questionSet("animals-records", "Animal Kingdom", [
    ["Which bird has the greatest measured wingspan among living species?", "Wandering albatross", "Large wandering albatrosses can exceed three meters in wingspan."],
    ["Which animal makes the longest known annual migration by distance?", "Arctic tern", "Arctic terns travel between high northern and southern latitudes each year."],
    ["Which living mammal has the densest fur?", "Sea otter", "Sea otters rely on extraordinarily dense fur rather than blubber for insulation."],
    ["Which living bird lays the largest egg by mass?", "Ostrich", "Ostriches lay the largest eggs of any living bird."],
    ["Which bird reaches the highest measured speed during a hunting dive?", "Peregrine falcon", "Peregrine falcons can exceed 300 km/h in a stoop."],
    ["Which living reptile reaches the greatest mass?", "Saltwater crocodile", "Adult male saltwater crocodiles are the heaviest living reptiles."],
    ["Which mammal has the longest gestation period?", "African elephant", "African elephant pregnancies last about 22 months."],
    ["Which vertebrate has the longest documented lifespan?", "Greenland shark", "Radiocarbon dating indicates Greenland sharks may live for several centuries."],
    ["Which butterfly completes a multigenerational migration circuit between Europe and Africa?", "Painted lady butterfly", "Successive generations of painted ladies complete the intercontinental circuit."],
    ["Which land animal has the largest eyes?", "Ostrich", "An ostrich's eyes are larger than its brain."]
  ]),
  ...questionSet("animals-behavior", "Animal Kingdom", [
    ["What is the dance honeybees use to communicate food direction and distance?", "Waggle dance", "The angle and duration of the waggle run encode direction and distance."],
    ["What is cooperative hunting by Harris's hawks unusual among?", "Raptors", "Harris's hawks hunt in coordinated groups, an uncommon strategy among birds of prey."],
    ["What behavior involves crows gathering around a dead member of their species?", "Funeral gathering", "Crows inspect danger around dead conspecifics and may learn about threats."],
    ["What is the name for octopuses ejecting water to move rapidly?", "Jet propulsion", "An octopus contracts its mantle and forces water through its siphon."],
    ["What navigational ability lets homing pigeons return from unfamiliar places?", "Homing", "Pigeons combine magnetic, olfactory, visual, and solar cues during homing."],
    ["What social system is led by a breeding female in spotted hyenas?", "Matrilineal clan", "Female spotted hyenas dominate males and inherit rank through maternal lines."],
    ["What behavior do meerkats use when one individual watches for predators?", "Sentinel duty", "A sentinel scans and gives alarm calls while others forage."],
    ["What hunting strategy has humpback whales blowing spirals of bubbles around prey?", "Bubble-net feeding", "The whales concentrate schooling fish inside a rising curtain of bubbles."],
    ["What behavior causes young birds to follow the first suitable moving object they see?", "Imprinting", "Filial imprinting occurs during a sensitive period soon after hatching."],
    ["What is the transfer of food from one animal's mouth to another called?", "Trophallaxis", "Social insects use trophallaxis to distribute food and chemical information."]
  ]),
  ...questionSet("animals-senses", "Animal Kingdom", [
    ["Which sense lets pit vipers detect warm-bodied prey in darkness?", "Infrared detection", "Heat-sensitive facial pits respond to infrared radiation."],
    ["Which sense lets toothed whales map objects using returning clicks?", "Echolocation", "They emit clicks and analyze echoes from prey and surroundings."],
    ["Which sense allows many birds to perceive wavelengths humans cannot see?", "Ultraviolet vision", "Many birds possess cone cells sensitive to ultraviolet light."],
    ["Which sensory system helps fish detect water movement and pressure?", "Lateral line", "Neuromasts along the lateral line register local water displacement."],
    ["Which ability helps sea turtles orient using Earth's field?", "Magnetoreception", "Sea turtles can detect magnetic signatures associated with geographic regions."],
    ["Which sense organ do snakes use when they flick their tongues?", "Vomeronasal organ", "The tongue delivers chemical particles to the Jacobson's, or vomeronasal, organ."],
    ["Which receptors allow sharks to detect weak electrical signals?", "Electroreceptors", "Shark electroreceptors include the ampullae of Lorenzini."],
    ["Which ability allows bees to detect the polarization pattern of skylight?", "Polarized-light vision", "Bees use polarized light as a compass even when the sun is obscured."],
    ["Which specialized whiskers help seals track hydrodynamic trails?", "Vibrissae", "Seal vibrissae detect tiny water movements left by swimming prey."],
    ["Which ability lets some elephants detect distant low-frequency calls through the ground?", "Seismic sensing", "Elephants can perceive vibrations through their feet and trunks."]
  ]),
  ...questionSet("animals-evolution", "Animal Kingdom", [
    ["Which living animal group is most closely related to the hippopotamus?", "Cetaceans", "Molecular evidence places hippos and whales together within Whippomorpha."],
    ["Which living animal group is most closely related to birds?", "Crocodilians", "Birds and crocodilians are the surviving branches of Archosauria."],
    ["Which mammal lineage is most closely related to elephants?", "Hyraxes", "Elephants, hyraxes, and sirenians belong to the afrotherian clade Paenungulata."],
    ["Which living primates are humans' closest relatives?", "Chimpanzees and bonobos", "Humans share a most recent common ancestor with the genus Pan."],
    ["Which fish group gave rise to the tetrapod lineage?", "Lobe-finned fishes", "Tetrapods evolved from sarcopterygian, or lobe-finned, ancestors."],
    ["Which land mammals are most closely related to seals and walruses?", "Bears and musteloids", "Pinnipeds belong within the caniform branch of Carnivora."],
    ["Which animal group includes the closest living relatives of insects?", "Crustaceans", "Modern phylogeny places insects within Pancrustacea."],
    ["Which living jawless vertebrates are known for slime production?", "Hagfishes", "Hagfishes are jawless marine vertebrates famous for defensive slime."],
    ["Which extinct group lies near the base of the whale evolutionary tree?", "Pakicetids", "Early whale evolution includes terrestrial and semiaquatic pakicetids."],
    ["Which dinosaur lineage gave rise to modern birds?", "Theropods", "Birds evolved from small feathered maniraptoran theropods."]
  ]),
  ...questionSet("animals-physiology", "Animal Kingdom", [
    ["Which pigment transports oxygen in vertebrate red blood cells?", "Hemoglobin", "Hemoglobin binds oxygen using iron-containing heme groups."],
    ["Which nitrogenous waste do birds primarily excrete to conserve water?", "Uric acid", "Uric acid can be expelled as a concentrated paste with little water."],
    ["Which chamber of a ruminant stomach is the main fermentation vat?", "Rumen", "Microbes in the rumen break down cellulose-rich plant material."],
    ["Which organ helps sharks maintain buoyancy with oil rather than a swim bladder?", "Liver", "A large oil-rich liver offsets some of a shark's body density."],
    ["Which molecule allows horseshoe-crab blood to clot around bacterial endotoxins?", "Coagulogen", "Amoebocyte enzymes convert coagulogen into a clot in response to endotoxin."],
    ["Which respiratory pigment gives many annelids red blood without red cells?", "Dissolved hemoglobin", "In many annelids, giant hemoglobin molecules circulate freely in plasma."],
    ["Which hormone drives color change in many cephalopod chromatophores through neural control?", "Acetylcholine", "Motor neurons release acetylcholine to contract muscles around chromatophores."],
    ["Which organ produces the electric discharge of an electric eel?", "Electrocytes", "Stacks of modified muscle cells called electrocytes create the voltage."],
    ["Which antifreeze compounds protect Antarctic notothenioid fish?", "Antifreeze glycoproteins", "These proteins bind ice crystals and inhibit their growth."],
    ["Which symbiotic microbes allow termites to digest cellulose?", "Gut protists and bacteria", "Termite digestion depends on a community of cellulose-processing microorganisms."]
  ])
];

const GENIUS_BRANDS_BANK = [
  ...questionSet("brands-founders", "Brands", [
    ["Who founded Patagonia in 1973?", "Yvon Chouinard", "Climber Yvon Chouinard founded Patagonia after building an equipment business."],
    ["Who founded IKEA?", "Ingvar Kamprad", "Kamprad founded IKEA in Sweden in 1943."],
    ["Who co-founded Sony with Akio Morita?", "Masaru Ibuka", "Ibuka and Morita created the company that became Sony."],
    ["Who founded the luxury house that bears the name Chanel?", "Gabrielle Chanel", "Gabrielle 'Coco' Chanel opened her first millinery shop in 1910."],
    ["Who founded FedEx under the original name Federal Express?", "Frederick W. Smith", "Smith launched Federal Express operations in 1973."],
    ["Who founded the sportswear company Puma after splitting from his brother?", "Rudolf Dassler", "Rudolf Dassler founded Puma; his brother Adolf founded Adidas."],
    ["Who founded The Body Shop in Brighton in 1976?", "Anita Roddick", "Roddick built The Body Shop around cosmetics and ethical campaigning."],
    ["Who founded the watch company Rolex with Alfred Davis?", "Hans Wilsdorf", "Wilsdorf and Davis established the London business that became Rolex."],
    ["Who founded Honda Motor Company with Takeo Fujisawa?", "Soichiro Honda", "Soichiro Honda supplied engineering vision while Fujisawa led commercial strategy."],
    ["Who founded the fashion house Balenciaga?", "Cristóbal Balenciaga", "The Spanish couturier opened his Paris house in 1937."]
  ]),
  ...questionSet("brands-origins", "Brands", [
    ["In which city was Starbucks founded?", "Seattle", "The first Starbucks opened at Seattle's Pike Place Market in 1971."],
    ["In which city was Adidas founded?", "Herzogenaurach", "Adolf Dassler registered Adidas in Herzogenaurach, Germany."],
    ["In which city was Nokia founded as a pulp mill?", "Tampere", "Fredrik Idestam established the first mill near Tampere in 1865."],
    ["In which city was Samsung founded as a trading company?", "Daegu", "Lee Byung-chul founded Samsung Sanghoe in Daegu in 1938."],
    ["In which city did Ferruccio Lamborghini establish Automobili Lamborghini?", "Sant'Agata Bolognese", "Lamborghini's factory was built in Sant'Agata Bolognese in 1963."],
    ["In which city was Lego founded?", "Billund", "Ole Kirk Christiansen founded the company in Billund, Denmark."],
    ["In which city did Gianni Versace open his first boutique?", "Milan", "Versace opened his first Milan boutique in 1978."],
    ["In which city was Nintendo founded as a playing-card business?", "Kyoto", "Fusajiro Yamauchi founded Nintendo Koppai in Kyoto in 1889."],
    ["In which city was Cartier founded?", "Paris", "Louis-François Cartier took over a Paris workshop in 1847."],
    ["In which city did William Procter and James Gamble establish their company?", "Cincinnati", "Procter & Gamble was founded in Cincinnati in 1837."]
  ]),
  ...questionSet("brands-original-names", "Brands", [
    ["What was Google's working name before the founders chose Google?", "BackRub", "The search engine was called BackRub because it analyzed backlinks."],
    ["What was Nike called before adopting its current name?", "Blue Ribbon Sports", "Phil Knight and Bill Bowerman founded Blue Ribbon Sports in 1964."],
    ["What was Pepsi-Cola originally sold as?", "Brad's Drink", "Caleb Bradham introduced Brad's Drink before renaming it Pepsi-Cola."],
    ["What was eBay's original website name?", "AuctionWeb", "Pierre Omidyar launched AuctionWeb in 1995."],
    ["What was Sony's original company name in English?", "Tokyo Telecommunications Engineering Corporation", "The company adopted the shorter Sony name in 1958."],
    ["What was the original name of the company that became IBM?", "Computing-Tabulating-Recording Company", "CTR adopted the name International Business Machines in 1924."],
    ["What was the first name of the brand now known as Subway?", "Pete's Super Submarines", "Fred DeLuca and Peter Buck opened Pete's Super Submarines in 1965."],
    ["What was Instagram called during its early prototype phase?", "Burbn", "Kevin Systrom and Mike Krieger refocused Burbn into a photo-sharing app."],
    ["What was the online bookstore Amazon nearly named after a word meaning magical?", "Cadabra", "Jeff Bezos abandoned Cadabra partly because it could be misheard as 'cadaver.'"],
    ["What was the company LG known as before adopting the initials?", "Lucky-Goldstar", "The Korean conglomerate used the Lucky-Goldstar name before the LG brand."]
  ]),
  ...questionSet("brands-logos", "Brands", [
    ["Which creature appears at the center of Alfa Romeo's badge?", "A serpent", "The biscione serpent is paired with Milan's red cross."],
    ["Which mythological figure appears in the Versace logo?", "Medusa", "Gianni Versace chose the head of Medusa as the house emblem."],
    ["Which animal appears on the Lacoste logo?", "Crocodile", "The emblem comes from founder René Lacoste's nickname, 'the Crocodile.'"],
    ["Which celestial object forms the three-pointed Mercedes-Benz emblem?", "Star", "The three-pointed star symbolizes engines for land, sea, and air."],
    ["Which animal is shown in the Ferrari prancing-horse badge?", "Horse", "Ferrari adopted the cavallino rampante associated with pilot Francesco Baracca."],
    ["Which bird appears on the Nestlé coat-of-arms-style mark?", "Thrush", "The logo depicts a mother bird feeding chicks in a nest."],
    ["Which figure appears in the center of Starbucks' logo?", "Siren", "Starbucks uses a two-tailed siren derived from maritime imagery."],
    ["Which animal forms the WWF logo?", "Giant panda", "The panda was inspired by Chi-Chi, a panda at London Zoo."],
    ["Which fruit is depicted in Apple's logo?", "Apple", "Rob Janoff designed the bitten-apple mark in 1977."],
    ["Which shellfish is represented by the Shell brand emblem?", "Scallop", "Shell's pecten logo is a stylized scallop shell."]
  ]),
  ...questionSet("brands-products", "Brands", [
    ["Which company introduced the Walkman TPS-L2 in 1979?", "Sony", "Sony's portable cassette player transformed personal listening."],
    ["Which company launched the instant-camera model Land Camera 95?", "Polaroid", "Edwin Land's company released the first commercial instant camera in 1948."],
    ["Which company introduced the Post-it Note commercially?", "3M", "3M combined Spencer Silver's adhesive with Art Fry's bookmark idea."],
    ["Which company first marketed the safety razor with disposable blades at scale?", "Gillette", "King C. Gillette built a business around replaceable razor blades."],
    ["Which company introduced the Model T in 1908?", "Ford", "The Model T made automobile ownership accessible to a mass market."],
    ["Which company released the Game Boy in 1989?", "Nintendo", "Gunpei Yokoi led development of Nintendo's handheld system."],
    ["Which company introduced the first commercially successful photocopier, the 914?", "Xerox", "The Xerox 914 popularized plain-paper copying after 1959."],
    ["Which company created the first widely sold ballpoint pen under the Cristal name?", "Bic", "Bic launched the inexpensive Cristal ballpoint in 1950."],
    ["Which company launched the first Kindle e-reader?", "Amazon", "Amazon released the original Kindle in the United States in 2007."],
    ["Which company introduced the 911 sports car in 1963?", "Porsche", "Porsche unveiled the model as the 901 before renaming it 911."]
  ]),
  ...questionSet("brands-acquisitions", "Brands", [
    ["Which company acquired Pixar in 2006?", "Disney", "Disney purchased Pixar in an all-stock transaction."],
    ["Which company acquired Instagram in 2012?", "Facebook", "Facebook bought Instagram before later renaming its parent company Meta."],
    ["Which company acquired YouTube in 2006?", "Google", "Google purchased YouTube for stock valued at about $1.65 billion."],
    ["Which company acquired Whole Foods Market in 2017?", "Amazon", "Amazon's purchase brought the grocer into its retail portfolio."],
    ["Which company acquired Beats Electronics in 2014?", "Apple", "The deal brought Beats hardware and streaming expertise to Apple."],
    ["Which company acquired LinkedIn in 2016?", "Microsoft", "Microsoft completed its all-cash acquisition of LinkedIn in December 2016."],
    ["Which company acquired WhatsApp in 2014?", "Facebook", "Facebook completed the WhatsApp acquisition in 2014."],
    ["Which company acquired Tiffany & Co. in 2021?", "LVMH", "LVMH completed its acquisition of the American jeweler in January 2021."],
    ["Which company acquired Reebok in 2006?", "Adidas", "Adidas completed the Reebok acquisition in 2006 before selling it years later."],
    ["Which company acquired Jaguar and Land Rover from Ford in 2008?", "Tata Motors", "India's Tata Motors combined the marques as Jaguar Land Rover."]
  ]),
  ...questionSet("brands-etymology", "Brands", [
    ["The name Adidas was formed from which founder's name?", "Adolf Dassler", "The brand combines founder Adi Dassler's nickname and surname."],
    ["The name Lego comes from the Danish phrase 'leg godt,' meaning what?", "Play well", "Founder Ole Kirk Christiansen shortened 'leg godt' to Lego."],
    ["The name Volvo comes from a Latin verb meaning what?", "I roll", "Volvo is the first-person form of the Latin verb volvere."],
    ["The name Häagen-Dazs was invented to suggest an association with which country?", "Denmark", "The name is not authentic Danish; it was created to evoke Danish craftsmanship."],
    ["The name Amazon was chosen partly because the river suggested what quality?", "Vast scale", "Jeff Bezos wanted a name that conveyed something large and expansive."],
    ["The brand name Canon evolved from the name of which Buddhist figure?", "Kannon", "The company's early camera was named Kwanon after the bodhisattva of compassion."],
    ["The name Asics is an acronym derived from a maxim in which language?", "Latin", "It comes from 'Anima Sana In Corpore Sano,' a sound mind in a sound body."],
    ["The name Pepsi refers to which digestive concept?", "Dyspepsia", "The name was associated with digestion and the word dyspepsia."],
    ["The name Reebok comes from an Afrikaans word for what animal?", "Grey rhebok", "The rhebok is a southern African antelope."],
    ["The name Samsung translates approximately to what in Korean?", "Three stars", "The name combines the Korean words for three and star."]
  ]),
  ...questionSet("brands-design", "Brands", [
    ["Who designed the Coca-Cola contour bottle introduced in 1915?", "Earl R. Dean", "Dean of the Root Glass Company developed the winning contour-bottle design."],
    ["Who designed the original Nike Swoosh?", "Carolyn Davidson", "Davidson created the mark as a graphic-design student in 1971."],
    ["Who designed the I ❤️ NY logo?", "Milton Glaser", "Glaser created the rebus logo for a New York tourism campaign in 1977."],
    ["Who designed the 1972 Munich Olympics identity that later influenced Lufthansa's visual system?", "Otl Aicher", "Aicher developed a rigorous grid, pictograms, and color system."],
    ["Who designed the Chupa Chups daisy-shaped logo?", "Salvador Dalí", "Dalí created the logo in 1969 and placed the name on top of the wrapper."],
    ["Who designed the IBM eight-bar logo?", "Paul Rand", "Rand introduced IBM's striped logotype in 1972."],
    ["Who designed the 'I am not a plastic bag' tote for Anya Hindmarch?", "Anya Hindmarch", "The designer launched the campaign bag in 2007."],
    ["Who designed the Absolut Vodka bottle shape from an old Swedish medicine bottle?", "Gunnar Broman", "Advertising figure Gunnar Broman proposed the pharmacy-bottle inspiration."],
    ["Who designed the Braun SK 4 record player with Hans Gugelot?", "Dieter Rams", "Rams and Gugelot created the transparent-lid design nicknamed Snow White's Coffin."],
    ["Who created the Michelin Man character, Bibendum, from stacked tires?", "Marius Rossillon", "The artist known as O'Galop created the famous 1898 advertising poster."]
  ]),
  ...questionSet("brands-luxury", "Brands", [
    ["Which house introduced the 2.55 handbag in February 1955?", "Chanel", "The bag's name records its launch date: 2/55."],
    ["Which house created the Kelly bag before it was renamed for Grace Kelly?", "Hermès", "The bag was formally renamed after Grace Kelly used it in the 1950s."],
    ["Which house is associated with the Cannage quilting pattern?", "Dior", "Cannage references the woven chairs used at Christian Dior's 1947 show."],
    ["Which house introduced the Bamboo 1947 handbag?", "Gucci", "Postwar material shortages inspired Gucci's use of heat-bent bamboo handles."],
    ["Which jeweler created the Panthère motif associated with Jeanne Toussaint?", "Cartier", "Toussaint helped make the panther a Cartier signature."],
    ["Which house is known for the Intrecciato leather-weaving technique?", "Bottega Veneta", "The house developed Intrecciato to strengthen supple leather."],
    ["Which brand's monogram combines the initials of founder Louis Vuitton?", "Louis Vuitton", "Georges Vuitton introduced the LV monogram canvas in 1896."],
    ["Which fashion house uses a Medusa head as its emblem?", "Versace", "The Medusa emblem reflects Gianni Versace's fascination with classical imagery."],
    ["Which jeweler introduced the yellow-diamond Tiffany Setting in 1886?", "Tiffany & Co.", "The six-prong setting lifts the diamond above the band."],
    ["Which shoemaker is known for men's double-monk and wholecut shoes made in Northampton?", "John Lobb", "John Lobb's English workshop is renowned for traditional luxury footwear."]
  ]),
  ...questionSet("brands-auto", "Brands", [
    ["Which parent company created the Lexus marque?", "Toyota", "Toyota launched Lexus in 1989 as its luxury division."],
    ["Which parent company created the Acura marque?", "Honda", "Honda introduced Acura in North America in 1986."],
    ["Which company acquired the Bentley marque in 1998?", "Volkswagen Group", "Volkswagen Group acquired Bentley in 1998."],
    ["Which company began producing Rolls-Royce automobiles under license in 2003?", "BMW Group", "BMW launched the modern Rolls-Royce Motor Cars operation in 2003."],
    ["Which company acquired the Bugatti automobile marque in 1998?", "Volkswagen Group", "Volkswagen acquired the Bugatti rights and developed the Veyron."],
    ["Which company launched the Genesis luxury marque as a standalone brand?", "Hyundai Motor Group", "Genesis became a separate luxury marque in 2015."],
    ["Which company acquired Volvo Cars from Ford in 2010?", "Geely Holding", "China's Geely acquired Volvo Cars from Ford in 2010."],
    ["Which automotive group acquired Ducati through Audi in 2012?", "Volkswagen Group", "Ducati entered Volkswagen Group through Audi's Lamborghini subsidiary."],
    ["Which company created the Infiniti marque?", "Nissan", "Nissan launched Infiniti in North America in 1989."],
    ["Which company acquired a controlling stake in Lotus in 2017?", "Geely Holding", "Geely acquired a controlling stake in Lotus in 2017."]
  ]),
  ...questionSet("brands-advertising", "Brands", [
    ["Which agency created Volkswagen's influential 1959 'Think Small' campaign?", "Doyle Dane Bernbach", "DDB's self-deprecating campaign transformed American automotive advertising."],
    ["Which brand used the long-running slogan 'A diamond is forever'?", "De Beers", "Copywriter Frances Gerety coined the line in 1947."],
    ["Which brand launched the '1984' television commercial directed by Ridley Scott?", "Apple", "The commercial introduced the Macintosh during Super Bowl XVIII."],
    ["Which brand used the campaign line 'The Man Your Man Could Smell Like'?", "Old Spice", "The 2010 campaign starred Isaiah Mustafa."],
    ["Which brand's 1971 commercial featured people singing on a hilltop about buying the world a drink?", "Coca-Cola", "The Hilltop ad became one of Coca-Cola's best-known campaigns."],
    ["Which brand built a campaign around 'Real Beauty' beginning in 2004?", "Dove", "Dove's campaign challenged conventional beauty advertising."],
    ["Which brand used the slogan 'When it absolutely, positively has to be there overnight'?", "Federal Express", "The line emphasized Federal Express's overnight-delivery promise."],
    ["Which brand's 'Marlboro Man' campaign was developed by Leo Burnett?", "Marlboro", "The cowboy repositioned Marlboro beginning in the 1950s."],
    ["Which brand used the 'Got Milk?' campaign first created for California processors?", "California Milk Processor Board", "Goodby Silverstein & Partners launched the campaign in 1993."],
    ["Which brand's 'Share a Coke' campaign replaced its logo with personal names?", "Coca-Cola", "The campaign began in Australia in 2011 before expanding globally."]
  ])
];

const GENIUS_GEOGRAPHY_BANK = [
  ...questionSet("geography-capitals", "Geography", [
    ["What is the capital of Palau?", "Ngerulmud", "Palau's government moved to Ngerulmud in the state of Melekeok in 2006."],
    ["What is the constitutional capital of Bolivia?", "Sucre", "Sucre is Bolivia's constitutional capital; La Paz is the seat of government."],
    ["What is the capital of the Federated States of Micronesia?", "Palikir", "Palikir is on the island of Pohnpei."],
    ["What is the capital of Burundi?", "Gitega", "Burundi designated Gitega as its political capital in 2019."],
    ["What is the official capital of Sri Lanka?", "Sri Jayawardenepura Kotte", "Sri Jayawardenepura Kotte houses Sri Lanka's parliament."],
    ["What is the capital of Comoros?", "Moroni", "Moroni lies on the island of Grande Comore."],
    ["What is the capital of Timor-Leste?", "Dili", "Dili sits on the north coast of Timor."],
    ["What is the capital of Tuvalu?", "Funafuti", "Most government offices are on Funafuti atoll."],
    ["What is the capital of Eswatini used for royal and legislative functions?", "Lobamba", "Lobamba is the royal and legislative capital; Mbabane is administrative."],
    ["What is the capital of the Marshall Islands?", "Majuro", "Majuro is a coral atoll and the national capital."]
  ]),
  ...questionSet("geography-borders", "Geography", [
    ["Which country shares the longest land border with France when overseas territories are included?", "Brazil", "French Guiana gives France a border with Brazil longer than its border with Spain."],
    ["Which two countries share the world's longest international land border?", "Canada and United States", "Their border extends across the continental boundary and Alaska."],
    ["Which country is completely surrounded by South Africa?", "Lesotho", "Lesotho is an enclave within South Africa."],
    ["Which country lies between Romania and Ukraine and has no coastline?", "Moldova", "Moldova is landlocked between Romania and Ukraine apart from a tiny Danube frontage without seacoast."],
    ["Which country borders both the Caspian Sea and the Persian Gulf?", "Iran", "Iran spans from the Caspian coast to the Persian Gulf and Gulf of Oman."],
    ["Which country shares borders with both Senegal and Sierra Leone?", "Guinea", "Guinea lies between several West African neighbors, including Senegal and Sierra Leone."],
    ["Which country touches both the Red Sea and the Gulf of Aden?", "Yemen", "Yemen occupies the southwestern corner of the Arabian Peninsula."],
    ["Which country separates Poland from Lithuania through its Kaliningrad exclave?", "Russia", "Kaliningrad is a Russian exclave on the Baltic Sea."],
    ["Which African country has land borders with nine other sovereign states?", "Democratic Republic of the Congo", "The DRC borders Angola, Burundi, the Central African Republic, the Republic of the Congo, Rwanda, South Sudan, Tanzania, Uganda, and Zambia."],
    ["Which country is bordered by India on three sides and Myanmar on the fourth?", "Bangladesh", "Bangladesh lies on the Bay of Bengal almost enclosed by India, with Myanmar to the southeast."]
  ]),
  ...questionSet("geography-rivers", "Geography", [
    ["Which river flows through Vienna, Bratislava, Budapest, and Belgrade?", "Danube", "The Danube crosses or borders ten countries before reaching the Black Sea."],
    ["Which river forms much of the border between Mexico and Texas?", "Rio Grande", "Known in Mexico as the Río Bravo, it reaches the Gulf of Mexico."],
    ["Which river drains Lake Baikal?", "Angara", "The Angara is Lake Baikal's only outflow and joins the Yenisei."],
    ["Which river passes through Baghdad?", "Tigris", "Baghdad developed on both banks of the Tigris."],
    ["Which river flows through Córdoba and Seville before entering the Gulf of Cádiz?", "Guadalquivir", "The Guadalquivir is the major navigable river of Andalusia."],
    ["Which river forms Victoria Falls?", "Zambezi", "The Zambezi plunges over Victoria Falls between Zambia and Zimbabwe."],
    ["Which river flows through the city of Porto?", "Douro", "The Douro reaches the Atlantic between Porto and Vila Nova de Gaia."],
    ["Which river empties into the Río de la Plata opposite Buenos Aires?", "Uruguay River", "The Uruguay joins the Paraná to form the Río de la Plata estuary."],
    ["Which river rises on the Tibetan Plateau and reaches the sea through Vietnam's Mekong Delta?", "Mekong", "The Mekong crosses or borders six countries in mainland Southeast Asia."],
    ["Which river runs through the Grand Canyon?", "Colorado River", "The Colorado carved much of the Grand Canyon over millions of years."]
  ]),
  ...questionSet("geography-mountains", "Geography", [
    ["Which mountain is the highest point in the Atlas range?", "Toubkal", "Jebel Toubkal rises to 4,167 meters in Morocco."],
    ["Which peak is the highest in the Alps?", "Mont Blanc", "Mont Blanc straddles the French-Italian border region."],
    ["Which mountain is the highest in Japan?", "Mount Fuji", "Mount Fuji is a 3,776-meter stratovolcano."],
    ["Which peak is the highest wholly within Switzerland?", "Dom", "The Dom rises to 4,545 meters in the Pennine Alps."],
    ["Which mountain is the highest in Africa?", "Kilimanjaro", "Kilimanjaro's Uhuru Peak reaches 5,895 meters in Tanzania."],
    ["Which peak is the highest in the Canadian Rockies?", "Mount Robson", "Mount Robson rises to 3,954 meters in British Columbia."],
    ["Which mountain is the highest in the Caucasus?", "Mount Elbrus", "Elbrus is a dormant volcano in Russia's western Caucasus."],
    ["Which peak is the highest on the island of New Guinea?", "Puncak Jaya", "Puncak Jaya, or Carstensz Pyramid, is in Indonesia's Papua region."],
    ["Which mountain is the highest in the contiguous United States?", "Mount Whitney", "Mount Whitney rises in California's Sierra Nevada."],
    ["Which peak is the highest in the Andes outside Argentina?", "Huascarán", "Peru's Huascarán is the highest tropical mountain on Earth."]
  ]),
  ...questionSet("geography-islands", "Geography", [
    ["Which is the world's largest island that is not considered a continent?", "Greenland", "Greenland covers more than two million square kilometers."],
    ["Which island is divided between Haiti and the Dominican Republic?", "Hispaniola", "Hispaniola is the Caribbean's second-largest island."],
    ["Which island contains the Indonesian provinces of Papua and Highland Papua?", "New Guinea", "Indonesia occupies western New Guinea while Papua New Guinea occupies the east."],
    ["Which Mediterranean island is shared politically by the Republic of Cyprus and the de facto Northern Cyprus administration?", "Cyprus", "Cyprus has been divided by a UN buffer zone since 1974."],
    ["Which island is home to the cities of Kuching, Bandar Seri Begawan, and Balikpapan?", "Borneo", "Borneo is divided among Indonesia, Malaysia, and Brunei."],
    ["Which island group includes Tenerife, Lanzarote, and La Palma?", "Canary Islands", "The Canary Islands are a Spanish archipelago off northwest Africa."],
    ["Which archipelago includes the islands of São Miguel and Terceira?", "Azores", "The Azores are an autonomous Portuguese archipelago in the North Atlantic."],
    ["Which island lies across the Bass Strait from mainland Australia?", "Tasmania", "Tasmania is Australia's large southern island state."],
    ["Which island is separated from mainland Italy by the Strait of Messina?", "Sicily", "The narrow Strait of Messina divides Sicily from Calabria."],
    ["Which island contains the sovereign states of Indonesia, Malaysia, and Brunei?", "Borneo", "Borneo is the only island divided among three countries."]
  ]),
  ...questionSet("geography-straits", "Geography", [
    ["Which strait connects the Black Sea to the Sea of Marmara?", "Bosporus", "The Bosporus divides European and Asian Istanbul."],
    ["Which strait links the Persian Gulf with the Gulf of Oman?", "Strait of Hormuz", "A large share of seaborne oil trade passes through Hormuz."],
    ["Which strait separates Sumatra from the Malay Peninsula?", "Strait of Malacca", "The Strait of Malacca is a major route between the Indian and Pacific oceans."],
    ["Which strait separates Alaska from Russia?", "Bering Strait", "The strait connects the Bering Sea and the Chukchi Sea."],
    ["Which strait separates Morocco from Spain?", "Strait of Gibraltar", "It connects the Atlantic Ocean with the Mediterranean Sea."],
    ["Which strait separates Sicily from mainland Italy?", "Strait of Messina", "The strait lies between Sicily and Calabria."],
    ["Which strait links the Adriatic Sea and Ionian Sea between Italy and Albania?", "Strait of Otranto", "The Strait of Otranto forms the Adriatic's southeastern entrance."],
    ["Which artificial waterway connects the Mediterranean Sea and Red Sea?", "Suez Canal", "The canal crosses Egypt's Isthmus of Suez."],
    ["Which artificial waterway crosses the Isthmus of Panama?", "Panama Canal", "The canal links the Atlantic and Pacific through a system of locks."],
    ["Which strait separates Hokkaido from Sakhalin?", "La Pérouse Strait", "Also called Soya Strait, it links the Sea of Japan and Sea of Okhotsk."]
  ]),
  ...questionSet("geography-exclaves", "Geography", [
    ["Which Azerbaijani exclave is separated from the rest of the country by Armenia?", "Nakhchivan", "Nakhchivan borders Armenia, Iran, and a short stretch of Turkey."],
    ["Which Angolan exclave lies north of the Congo River's mouth?", "Cabinda", "Cabinda is separated from the rest of Angola by a strip of the DRC."],
    ["Which Russian exclave lies between Poland and Lithuania?", "Kaliningrad", "Kaliningrad Oblast gives Russia a Baltic coast disconnected from its mainland."],
    ["Which Spanish exclave on Morocco's coast sits opposite Gibraltar?", "Ceuta", "Ceuta is an autonomous Spanish city on the North African coast."],
    ["Which Spanish exclave lies farther east on Morocco's Mediterranean coast?", "Melilla", "Melilla is Spain's second autonomous city in North Africa."],
    ["Which Omani exclave overlooks the Strait of Hormuz?", "Musandam", "The Musandam Peninsula is separated from most of Oman by the UAE."],
    ["Which part of East Timor is separated from the rest of the country by Indonesian territory?", "Oecusse", "Oecusse is a coastal exclave in western Timor."],
    ["Which Belgian municipality is famous for enclaves interlocked with Dutch territory?", "Baarle-Hertog", "Its parcels are intertwined with the Dutch municipality Baarle-Nassau."],
    ["Which Uzbek district is a major exclave inside Kyrgyzstan's Batken Region?", "Sokh", "Sokh is Uzbek territory populated largely by ethnic Tajiks."],
    ["Which U.S. state is separated from the contiguous states by Canada?", "Alaska", "Alaska is an exclave of the United States relative to the contiguous 48 states."]
  ]),
  ...questionSet("geography-flags", "Geography", [
    ["Which national flag is the only one with a non-quadrilateral shape?", "Nepal", "Nepal's flag consists of two stacked pennants."],
    ["Which national flag depicts an AK-47 rifle?", "Mozambique", "Mozambique's emblem includes a rifle crossed with a hoe."],
    ["Which national flag features a cedar tree?", "Lebanon", "A green cedar stands at the center of Lebanon's flag."],
    ["Which national flag bears a dragon?", "Bhutan", "Bhutan's Druk dragon spans the diagonal bicolor."],
    ["Which national flag depicts a map of the country above olive branches?", "Cyprus", "Cyprus's flag shows a copper-colored island map."],
    ["Which national flag contains a black double-headed eagle on red?", "Albania", "The double-headed eagle is associated with Albanian national identity."],
    ["Which national flag shows a golden frigatebird flying over a rising sun?", "Kiribati", "Kiribati's flag also depicts blue-and-white ocean waves."],
    ["Which national flag includes the Southern Cross and a Union Jack but no Commonwealth Star?", "New Zealand", "New Zealand's flag has four red stars and the Union Jack."],
    ["Which national flag displays five carpet motifs called guls?", "Turkmenistan", "The vertical carpet stripe represents five major tribal designs."],
    ["Which national flag has a white Nordic cross on a blue field?", "Finland", "The blue cross represents lakes and sky; white represents snow."]
  ]),
  ...questionSet("geography-lakes-deserts", "Geography", [
    ["Which lake is the deepest in the world?", "Lake Baikal", "Lake Baikal reaches a maximum depth of about 1,642 meters."],
    ["Which lake is the largest by surface area?", "Caspian Sea", "Despite its name, the landlocked Caspian is classified as the world's largest lake."],
    ["Which African lake is the primary source of the White Nile?", "Lake Victoria", "The Victoria Nile flows north from Lake Victoria."],
    ["Which salt lake lies at Earth's lowest exposed land elevation?", "Dead Sea", "The Dead Sea shoreline lies more than 400 meters below sea level."],
    ["Which desert extends along the Pacific coast of Peru and Chile?", "Atacama Desert", "The Atacama is among the driest nonpolar regions on Earth."],
    ["Which desert covers much of Botswana and parts of Namibia and South Africa?", "Kalahari Desert", "The Kalahari is a vast sandy basin in southern Africa."],
    ["Which desert occupies much of northern China and southern Mongolia?", "Gobi Desert", "The Gobi is a cold desert with large rocky expanses."],
    ["Which lake contains the world's largest inland island, Manitoulin?", "Lake Huron", "Manitoulin Island lies in the Canadian portion of Lake Huron."],
    ["Which desert is bounded by the Great Dividing Range and central Australian uplands?", "Simpson Desert", "The Simpson is known for long parallel red sand dunes."],
    ["Which lake is shared by Peru and Bolivia?", "Lake Titicaca", "Titicaca is a large high-altitude freshwater lake in the Andes."]
  ]),
  ...questionSet("geography-physical", "Geography", [
    ["What is the name of the fertile grassland region spanning Argentina and Uruguay?", "Pampas", "The Pampas are temperate plains known for agriculture and ranching."],
    ["What is the limestone landscape of sinkholes and caves called?", "Karst", "Karst develops as soluble rock, especially limestone, dissolves."],
    ["What is a fan-shaped sediment deposit at a river mouth called?", "Delta", "A delta forms where sediment accumulates as a river enters slower water."],
    ["What is the treeless biome south of polar ice and north of the taiga?", "Tundra", "Tundra has permafrost, low vegetation, and a short growing season."],
    ["What is a narrow coastal inlet carved by a glacier called?", "Fjord", "Fjords are deep, steep-sided valleys flooded by the sea."],
    ["What is the seasonal wind system that reverses direction called?", "Monsoon", "Monsoons arise from seasonal pressure differences between land and sea."],
    ["What is a crescent-shaped lake cut off from a meandering river called?", "Oxbow lake", "An oxbow forms when a river abandons a meander loop."],
    ["What is a ring-shaped coral reef enclosing a lagoon called?", "Atoll", "Atolls commonly develop as coral grows around a subsiding volcanic island."],
    ["What is the boundary separating two drainage basins called?", "Watershed divide", "Water on opposite sides of a divide flows into different basins."],
    ["What is a flat-topped elevated landform with steep sides called?", "Mesa", "Mesas are erosional remnants larger than buttes."]
  ]),
  ...questionSet("geography-superlatives", "Geography", [
    ["Which sovereign state has the greatest number of time zones when overseas territories are counted?", "France", "France spans twelve standard time zones through its overseas territories."],
    ["Which country has the longest coastline?", "Canada", "Canada's deeply indented Atlantic, Pacific, and Arctic coasts total more than any other country's."],
    ["Which country contains the greatest number of natural lakes?", "Canada", "Canada contains more lake area and more large lakes than any other country."],
    ["Which landlocked country is the largest by area?", "Kazakhstan", "Kazakhstan is the world's ninth-largest country overall."],
    ["Which sovereign state is the smallest by area?", "Vatican City", "Vatican City covers less than half a square kilometer."],
    ["Which country has the highest average elevation?", "Bhutan", "Bhutan's Himalayan terrain gives it the highest mean elevation among sovereign states by common datasets."],
    ["Which country is the world's largest archipelagic state by area?", "Indonesia", "Indonesia spans thousands of islands between the Indian and Pacific oceans."],
    ["Which country is the largest entirely within the Southern Hemisphere?", "Australia", "Australia is fully south of the Equator and exceeds other such states in area."],
    ["Which country is crossed by both the Equator and the Tropic of Capricorn?", "Brazil", "Brazil spans the Equator in the north and the Tropic of Capricorn in the south."],
    ["Which country has the world's northernmost national capital?", "Iceland", "Reykjavík is the northernmost capital of a sovereign state."]
  ])
];

const GENIUS_SPORTS_BANK = [
  ...questionSet("sports-trophies", "Sports", [
    ["In which sport is the Webb Ellis Cup awarded?", "Rugby union", "The Webb Ellis Cup is presented to the men's Rugby World Cup champion."],
    ["In which sport is the Claret Jug awarded?", "Golf", "The Champion Golfer of the Year receives the Claret Jug at The Open."],
    ["In which sport is the Davis Cup contested?", "Tennis", "The Davis Cup is an international men's team tennis competition."],
    ["In which sport is the America's Cup contested?", "Sailing", "The America's Cup is a match-racing sailing trophy."],
    ["In which sport is the Calcutta Cup contested?", "Rugby union", "England and Scotland contest the Calcutta Cup."],
    ["In which sport is the Borg-Warner Trophy awarded?", "IndyCar racing", "The trophy bears the faces of Indianapolis 500 winners."],
    ["In which sport is the Wanamaker Trophy awarded?", "Golf", "The winner of the PGA Championship receives the Wanamaker Trophy."],
    ["In which sport is the Grey Cup awarded?", "Canadian football", "The Grey Cup is the championship trophy of the Canadian Football League."],
    ["In which sport is the Jules Rimet Trophy historically significant?", "Association football", "It was the original FIFA World Cup trophy used through 1970."],
    ["In which sport is the Bledisloe Cup contested?", "Rugby union", "Australia and New Zealand contest the Bledisloe Cup."]
  ]),
  ...questionSet("sports-venues", "Sports", [
    ["Which tennis major is played at Roland-Garros?", "French Open", "Roland-Garros in Paris hosts the clay-court major."],
    ["Which golf major is permanently held at Augusta National?", "The Masters", "The Masters has been played at Augusta National since 1934."],
    ["Which horse race is staged at Churchill Downs?", "Kentucky Derby", "Churchill Downs in Louisville has hosted the Derby since 1875."],
    ["Which motor race is held on the Circuit de la Sarthe?", "24 Hours of Le Mans", "The endurance race uses public roads and a permanent circuit near Le Mans."],
    ["Which cricket ground is known as the Home of Cricket?", "Lord's", "Lord's in London is owned by Marylebone Cricket Club."],
    ["Which stadium hosts the University of Michigan football team?", "Michigan Stadium", "The Ann Arbor venue is nicknamed the Big House."],
    ["Which baseball team plays at Fenway Park?", "Boston Red Sox", "Fenway Park has hosted the Red Sox since 1912."],
    ["Which Formula One race is run on the streets of Monte Carlo?", "Monaco Grand Prix", "The Monaco circuit is one of motorsport's most famous street courses."],
    ["Which cycling classic finishes at the Roubaix Velodrome?", "Paris–Roubaix", "The one-day race is nicknamed the Hell of the North."],
    ["Which sumo tournament venue is in Tokyo's Ryōgoku district?", "Ryōgoku Kokugikan", "The arena hosts three of professional sumo's six annual grand tournaments."]
  ]),
  ...questionSet("sports-olympics", "Sports", [
    ["Which city hosted the first modern Olympic Games in 1896?", "Athens", "Athens hosted the inaugural modern Games from April 6 to 15, 1896."],
    ["Which athlete won four gold medals at the 1936 Berlin Olympics?", "Jesse Owens", "Owens won the 100 m, 200 m, long jump, and 4 × 100 m relay."],
    ["Which city was the first to host the Summer Olympics three times?", "London", "London hosted in 1908, 1948, and 2012."],
    ["Which gymnast scored the first Olympic perfect 10?", "Nadia Comăneci", "Comăneci achieved the score on uneven bars in Montreal in 1976."],
    ["Which country marched first in the Parade of Nations by Olympic tradition?", "Greece", "Greece enters first in recognition of the ancient Games."],
    ["Which city hosted both the 1924 and 2024 Summer Olympics?", "Paris", "Paris also hosted the Summer Games in 1900."],
    ["Which runner lit the cauldron at the 1964 Tokyo Olympics?", "Yoshinori Sakai", "Sakai was born in Hiroshima on the day of the atomic bombing."],
    ["Which swimmer won seven gold medals at the 1972 Munich Olympics?", "Mark Spitz", "Spitz set world records in all seven events."],
    ["Which nation won the first Olympic men's basketball tournament in 1936?", "United States", "The United States defeated Canada in the rain-soaked final."],
    ["Which athlete won the pentathlon and decathlon at the 1912 Olympics?", "Jim Thorpe", "Thorpe dominated both multi-event competitions in Stockholm."]
  ]),
  ...questionSet("sports-rules", "Sports", [
    ["In fencing, which weapon uses the entire body as the valid target?", "Épée", "Épée permits touches anywhere on the body and uses no right-of-way rule."],
    ["In cricket, what dismissal occurs when the wicketkeeper removes the bails while a batter is out of the crease and not attempting a run?", "Stumped", "A stumping follows a legal delivery when the batter leaves the crease."],
    ["In baseball scoring, what does a 6-4-3 double play describe?", "Shortstop to second base to first base", "Position numbers 6, 4, and 3 identify those fielders."],
    ["In snooker, how many points is the black ball worth?", "Seven", "Black is the highest-value color ball in snooker."],
    ["In rugby union, how many points is a drop goal worth?", "Three", "A successful drop goal scores three points."],
    ["In volleyball, what is the defensive specialist in a contrasting jersey called?", "Libero", "The libero has special back-row substitution and attacking restrictions."],
    ["In curling, what is the circular scoring target called?", "House", "Teams aim stones toward the house's center, the button."],
    ["In water polo, how long may a team normally possess the ball before shooting?", "30 seconds", "The standard shot clock is 30 seconds, with shorter resets in some situations."],
    ["In badminton, what score normally wins a game under rally scoring?", "21 points", "A player must win by two, capped at 30."],
    ["In judo, what score ends a match immediately?", "Ippon", "An ippon represents a decisive technique or submission."]
  ]),
  ...questionSet("sports-tennis", "Sports", [
    ["Who completed the only calendar-year Golden Slam in singles?", "Steffi Graf", "Graf won all four majors and Olympic gold in 1988."],
    ["Who was the first unseeded man to win Wimbledon singles?", "Boris Becker", "Becker won the 1985 title at age 17."],
    ["Which player won the 1999 French Open to complete a men's career Grand Slam?", "Andre Agassi", "Agassi completed his career Grand Slam by defeating Andrei Medvedev in the final."],
    ["Who won the longest match in Wimbledon history in 2010?", "John Isner", "Isner defeated Nicolas Mahut 70–68 in the fifth set."],
    ["Which woman won the 'Battle of the Sexes' match in 1973?", "Billie Jean King", "King defeated Bobby Riggs at the Houston Astrodome."],
    ["Who was the first Black player to win a Grand Slam singles title?", "Althea Gibson", "Gibson won the 1956 French Championships."],
    ["Which men's player won two calendar Grand Slams, in 1962 and 1969?", "Rod Laver", "Laver remains the only man to achieve the feat twice."],
    ["Which player won Wimbledon singles as a wild card in 2001?", "Goran Ivanišević", "Ivanišević defeated Patrick Rafter in a five-set final."],
    ["Which player was nicknamed the 'Ice Man' for his calm demeanor?", "Björn Borg", "Borg won eleven major singles titles before retiring young."],
    ["Which champion helped popularize the two-handed backhand during the 1970s?", "Chris Evert", "Evert's consistency helped popularize the two-handed backhand."]
  ]),
  ...questionSet("sports-football", "Sports", [
    ["Which nation won the first FIFA World Cup in 1930?", "Uruguay", "Uruguay defeated Argentina in the final in Montevideo."],
    ["Who scored a hat-trick in the 1966 World Cup final?", "Geoff Hurst", "Hurst remains the only man to score three goals in a World Cup final."],
    ["Which club won the first European Cup in 1956?", "Real Madrid", "Real Madrid defeated Stade de Reims in Paris."],
    ["Which goalkeeper captained Italy to the 1982 World Cup title?", "Dino Zoff", "Zoff was 40 when Italy won in Spain."],
    ["Which nation won UEFA Euro 1992 after entering as a late replacement?", "Denmark", "Denmark replaced Yugoslavia and defeated Germany in the final."],
    ["Which player scored the 'Panenka' penalty in the Euro 1976 final?", "Antonín Panenka", "His chipped penalty secured Czechoslovakia's victory."],
    ["Which African nation was first to reach a men's World Cup quarterfinal?", "Cameroon", "Cameroon reached the last eight at Italia 1990."],
    ["Which club completed the first continental treble in European men's football in 1967?", "Celtic", "Celtic won the European Cup, Scottish league, and Scottish Cup in 1966–67."],
    ["Who won the inaugural Women's Ballon d'Or in 2018?", "Ada Hegerberg", "The Norwegian striker received the first women's award."],
    ["Which country won the first FIFA Women's World Cup in 1991?", "United States", "The United States defeated Norway in Guangzhou."]
  ]),
  ...questionSet("sports-motorsport", "Sports", [
    ["Who won the first Formula One World Drivers' Championship in 1950?", "Giuseppe Farina", "Farina won the title for Alfa Romeo."],
    ["Which driver was nicknamed the Flying Scotsman and won titles in 1963 and 1965?", "Jim Clark", "Clark was renowned for smoothness and versatility."],
    ["Which driver won the 1976 Formula One championship by one point?", "James Hunt", "Hunt edged Niki Lauda after a dramatic season."],
    ["Who became the first woman to win an IndyCar race?", "Danica Patrick", "Patrick won the 2008 Indy Japan 300."],
    ["Which manufacturer won the 1991 24 Hours of Le Mans with a rotary engine?", "Mazda", "The Mazda 787B remains the only rotary-powered overall winner."],
    ["Which rally driver won four consecutive world championships from 1996 through 1999?", "Tommi Mäkinen", "Mäkinen won all four titles with Mitsubishi."],
    ["Who was the first driver to win the Indianapolis 500 four times?", "A. J. Foyt", "Foyt earned his fourth victory in 1977."],
    ["Which motorcycle racer won eight premier-class world titles, including seven consecutively from 1966 through 1972?", "Giacomo Agostini", "Agostini won seven straight 500 cc titles before adding an eighth in 1975."],
    ["Which driver won the 1966 24 Hours of Le Mans with Chris Amon?", "Bruce McLaren", "McLaren and Amon drove a Ford GT40 Mk II."],
    ["Which constructor introduced the ground-effect Lotus 79?", "Team Lotus", "The Lotus 79 exploited underbody tunnels to generate downforce."]
  ]),
  ...questionSet("sports-us", "Sports", [
    ["Which pitcher threw the only perfect game in World Series history?", "Don Larsen", "Larsen retired all 27 Brooklyn Dodgers in Game 5 of the 1956 World Series."],
    ["Which NBA player recorded the league's first officially recognized quadruple-double?", "Nate Thurmond", "Thurmond achieved it for Chicago in 1974."],
    ["Which NFL team completed the only perfect season of the Super Bowl era?", "Miami Dolphins", "The 1972 Dolphins finished 17–0 including the postseason."],
    ["Which hockey player scored 50 goals in 39 games in 1981–82?", "Wayne Gretzky", "Gretzky set the NHL record for fastest 50 goals."],
    ["Who broke Major League Baseball's color barrier in 1947?", "Jackie Robinson", "Robinson debuted for the Brooklyn Dodgers on April 15, 1947."],
    ["Which team won the first Super Bowl?", "Green Bay Packers", "Green Bay defeated the Kansas City Chiefs in January 1967."],
    ["Which player made the reception known as 'The Catch' in the 1982 NFC Championship Game?", "Dwight Clark", "Clark caught Joe Montana's pass for the winning touchdown."],
    ["Which WNBA player was the first to dunk in a regular-season game?", "Lisa Leslie", "Leslie dunked for the Los Angeles Sparks in 2002."],
    ["Which baseball player stole home in Game 1 of the 1955 World Series?", "Jackie Robinson", "Robinson's daring steal came against the New York Yankees."],
    ["Which NHL goaltender was the first credited with scoring a goal by shooting the puck?", "Ron Hextall", "Hextall scored for Philadelphia in December 1987."]
  ]),
  ...questionSet("sports-cricket-rugby", "Sports", [
    ["Who was the first batter to score 400 in a Test innings?", "Brian Lara", "Lara made 400 not out against England in 2004."],
    ["Which bowler took all ten wickets in a Test innings in 1956?", "Jim Laker", "Laker took 10 for 53 against Australia at Old Trafford."],
    ["Which country won the inaugural men's Cricket World Cup in 1975?", "West Indies", "West Indies defeated Australia at Lord's."],
    ["Who captained India to the 1983 Cricket World Cup title?", "Kapil Dev", "India upset West Indies in the final."],
    ["Which batter retired with a Test average of 99.94 after making a duck in his final innings?", "Don Bradman", "Bradman needed four runs in his last innings to finish with an average of 100."],
    ["Which nation won the first Rugby World Cup in 1987?", "New Zealand", "The All Blacks defeated France in the final."],
    ["Who scored the winning drop goal in the 2003 Rugby World Cup final?", "Jonny Wilkinson", "Wilkinson's extra-time kick defeated Australia."],
    ["Which country won the 1995 Rugby World Cup on home soil?", "South Africa", "Nelson Mandela presented the trophy to captain Francois Pienaar."],
    ["What is the maximum number of points from a single scoring play in rugby union without a penalty try?", "Seven", "A try is worth five and its conversion adds two."],
    ["Which team performs the haka 'Ka Mate' before many international rugby matches?", "New Zealand", "The All Blacks made the haka internationally famous."]
  ]),
  ...questionSet("sports-cycling-athletics", "Sports", [
    ["Who was the first cyclist to win the Tour de France five times?", "Jacques Anquetil", "Anquetil earned his fifth Tour victory in 1964."],
    ["Which rider won the Giro d'Italia and Tour de France in the same year three times?", "Eddy Merckx", "Merckx completed the double in 1970, 1972, and 1974."],
    ["Which monument classic is nicknamed La Doyenne?", "Liège–Bastogne–Liège", "First held in 1892, it is the oldest of cycling's five Monuments."],
    ["Who broke the four-minute mile in 1954?", "Roger Bannister", "Bannister ran 3:59.4 at Oxford's Iffley Road track."],
    ["Which athlete won Olympic 5,000 m, 10,000 m, and marathon gold in 1952?", "Emil Zátopek", "Zátopek achieved the unprecedented distance triple in Helsinki."],
    ["Who won four consecutive Olympic discus titles from 1956 to 1968?", "Al Oerter", "Oerter won despite injuries and fierce competition."],
    ["Which runner became the first woman known to complete the Boston Marathon?", "Bobbi Gibb", "Gibb ran unofficially in 1966 before women had an official division."],
    ["Which athlete invented the backward high-jump technique that bears his name?", "Dick Fosbury", "The Fosbury Flop transformed high jumping after the 1968 Olympics."],
    ["Who won both the 100 m and 200 m at three consecutive Olympics?", "Usain Bolt", "Bolt completed the sprint double in 2008, 2012, and 2016."],
    ["Which British runner won the women's 800 m at the 1964 Tokyo Olympics?", "Ann Packer", "Ann Packer won the final in world-record time."]
  ]),
  ...questionSet("sports-winter", "Sports", [
    ["Which nation hosted the first Winter Olympic Games in 1924?", "France", "The first Winter Olympics took place in Chamonix."],
    ["Which figure skater landed the first ratified quadruple jump in competition?", "Kurt Browning", "Browning landed a quadruple toe loop at the 1988 World Championships."],
    ["Which skier won three alpine gold medals at the 1968 Grenoble Olympics?", "Jean-Claude Killy", "Killy swept downhill, giant slalom, and slalom."],
    ["Which country won the 1980 Olympic ice-hockey 'Miracle on Ice' game?", "United States", "The U.S. defeated the heavily favored Soviet Union at Lake Placid."],
    ["Which speed skater won five gold medals at the 1980 Winter Olympics?", "Eric Heiden", "Heiden swept every men's speed-skating distance."],
    ["Which sport combines cross-country skiing and rifle shooting?", "Biathlon", "Biathlon alternates skiing loops with prone and standing shooting."],
    ["Which sliding sport uses a small head-first sled?", "Skeleton", "Skeleton athletes descend face-down and head-first."],
    ["Which country originated the sport of curling?", "Scotland", "Written evidence of curling in Scotland dates to the 16th century."],
    ["Which ski discipline uses gates set closer together than giant slalom?", "Slalom", "Slalom has the shortest turns and tightest gate spacing."],
    ["Which ski jumper became the first to clear 200 meters officially?", "Toni Nieminen", "Nieminen landed a 203-meter jump at Planica in 1994."]
  ])
];

export const GENIUS_QUESTIONS = [
  ...GENIUS_WORLD_HISTORY_BANK,
  ...GENIUS_HOLLYWOOD_BANK,
  ...GENIUS_ANIMAL_KINGDOM_BANK,
  ...GENIUS_BRANDS_BANK,
  ...GENIUS_GEOGRAPHY_BANK,
  ...GENIUS_SPORTS_BANK
];
