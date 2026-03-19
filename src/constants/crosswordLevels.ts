export type Direction = 'across' | 'down';

export interface WordData {
  word: string;
  hint: string;
  direction: Direction;
  row: number;
  col: number;
}

export interface LevelData {
  id: number;
  title: string;
  theme: string;
  gridSize: number;
  words: WordData[];
}

export const LEVELS: LevelData[] = [
  {
    id: 1,
    title: 'Level 1',
    theme: "Jesus' Early Life",
    gridSize: 10,
    words: [
      { word: 'BETHLEHEM', hint: 'The town where Jesus was born.',                              direction: 'across', row: 0, col: 0 },
      { word: 'NAZARETH',  hint: 'The town where Jesus grew up.',                               direction: 'across', row: 4, col: 1 },
      { word: 'JOSEPH',    hint: "Jesus' earthly father.",                                       direction: 'down',   row: 2, col: 5 },
      { word: 'MARY',      hint: 'The mother of Jesus.',                                        direction: 'down',   row: 4, col: 1 },
      { word: 'EGYPT',     hint: 'Where the holy family fled to escape Herod.',                  direction: 'down',   row: 0, col: 3 },
      { word: 'HEROD',     hint: 'The king who feared Jesus\' birth and killed young boys.',     direction: 'across', row: 2, col: 3 },
    ],
  },
  {
    id: 2,
    title: 'Level 2',
    theme: 'Old Testament Journey',
    gridSize: 8,
    words: [
      { word: 'EDEN',   hint: 'The garden where Adam and Eve lived.',                     direction: 'down',   row: 0, col: 0 },
      { word: 'SINAI',  hint: 'The mountain where Moses received the Ten Commandments.',  direction: 'down',   row: 0, col: 2 },
      { word: 'CANAAN', hint: 'The promised land God gave to the Israelites.',             direction: 'across', row: 2, col: 2 },
      { word: 'EGYPT',  hint: 'The land where the Israelites were enslaved for 400 years.', direction: 'down', row: 0, col: 4 },
      { word: 'JORDAN', hint: 'The river the Israelites crossed to enter the promised land.', direction: 'across', row: 4, col: 0 },
      { word: 'BABEL',  hint: 'The city where God confused the languages of the people.',  direction: 'down',   row: 3, col: 6 },
    ],
  },
  {
    id: 3,
    title: 'Level 3',
    theme: "Paul's Missions",
    gridSize: 9,
    words: [
      { word: 'ANTIOCH',  hint: 'The city where believers were first called Christians.',          direction: 'across', row: 2, col: 0 },
      { word: 'EPHESUS',  hint: 'The city where Paul stayed for three years and taught daily.',    direction: 'down',   row: 0, col: 2 },
      { word: 'PHILIPPI', hint: 'The city where Paul and Silas were imprisoned and freed.',        direction: 'down',   row: 2, col: 0 },
      { word: 'ATHENS',   hint: 'The city where Paul preached about the "Unknown God."',          direction: 'across', row: 4, col: 0 },
      { word: 'CORINTH',  hint: 'The city where Paul wrote letters to the early church.',          direction: 'across', row: 6, col: 1 },
      { word: 'ROME',     hint: 'The city that Paul traveled to as a prisoner and taught about Christ.', direction: 'down', row: 4, col: 5 },
    ],
  },
  {
    id: 4,
    title: 'Level 4',
    theme: 'Prophetic Cities',
    gridSize: 9,
    words: [
      { word: 'NINEVEH',  hint: 'The great city where Jonah preached repentance.',                   direction: 'across', row: 0, col: 0 },
      { word: 'BABYLON',  hint: 'The empire that conquered Judah and took the people into exile.',   direction: 'down',   row: 0, col: 2 },
      { word: 'TYRE',     hint: 'A wealthy coastal city often cursed by the prophets.',              direction: 'down',   row: 0, col: 4 },
      { word: 'SODOM',    hint: 'A city destroyed for its wickedness by fire and brimstone.',        direction: 'across', row: 3, col: 4 },
      { word: 'SAMARIA',  hint: 'The capital of the northern kingdom of Israel.',                    direction: 'across', row: 6, col: 0 },
    ],
  },
  {
    id: 5,
    title: 'Level 5',
    theme: 'Regions & Lands',
    gridSize: 8,
    words: [
      { word: 'JUDEA',    hint: 'The region where Jerusalem is located.',               direction: 'across', row: 0, col: 0 },
      { word: 'SHARON',   hint: 'A fertile plain in Israel known for its beauty and flowers.', direction: 'down', row: 0, col: 0 },
      { word: 'GAZA',     hint: 'A coastal city associated with Samson.',               direction: 'across', row: 3, col: 0 },
      { word: 'GALILEE',  hint: 'The region where Jesus spent most of His ministry.',   direction: 'down',   row: 0, col: 4 },
      { word: 'MOAB',     hint: 'The land east of the Dead Sea, home of Ruth.',         direction: 'across', row: 5, col: 2 },
      { word: 'PATMOS',   hint: 'The island where John received the Book of Revelation.', direction: 'down', row: 2, col: 6 },
    ],
  },
  {
    id: 6,
    title: 'Level 6',
    theme: 'Patriarchs',
    gridSize: 9,
    words: [
      { word: 'ADAM',     hint: 'The first man created by God.',                                     direction: 'across', row: 0, col: 0 },
      { word: 'ABEL',     hint: 'The first person murdered in the Bible.',                           direction: 'down',   row: 0, col: 0 },
      { word: 'NOAH',     hint: 'The man who built the ark and survived the great flood.',           direction: 'across', row: 2, col: 2 },
      { word: 'ABRAHAM',  hint: 'The father of faith who was called by God and promised many descendants.', direction: 'down', row: 0, col: 4 },
      { word: 'ISAAC',    hint: 'The promised son of Abraham and Sarah.',                            direction: 'across', row: 4, col: 4 },
      { word: 'JACOB',    hint: 'The patriarch who wrestled with God and was renamed Israel.',        direction: 'down',   row: 4, col: 8 },
    ],
  },
  {
    id: 7,
    title: 'Level 7',
    theme: 'Leaders of Israel',
    gridSize: 8,
    words: [
      { word: 'MOSES',    hint: 'Led the Israelites out of Egypt through the Red Sea.',         direction: 'across', row: 0, col: 0 },
      { word: 'JOSHUA',   hint: 'Led Israel into the Promised Land after Moses.',               direction: 'down',   row: 0, col: 2 },
      { word: 'GIDEON',   hint: 'The judge who defeated the Midianites with 300 men.',          direction: 'across', row: 2, col: 2 },
      { word: 'SAMSON',   hint: 'The strongest judge whose power came from his uncut hair.',    direction: 'down',   row: 2, col: 5 },
      { word: 'DEBORAH',  hint: 'The only female judge who led Israel to victory.',             direction: 'across', row: 5, col: 0 },
    ],
  },
  {
    id: 8,
    title: 'Level 8',
    theme: 'Kings',
    gridSize: 9,
    words: [
      { word: 'SAUL',     hint: 'The first king of Israel, chosen by God.',                         direction: 'down',   row: 0, col: 0 },
      { word: 'DAVID',    hint: 'The shepherd boy who became king and defeated Goliath.',            direction: 'across', row: 2, col: 0 },
      { word: 'SOLOMON',  hint: 'The wisest king who built the first temple in Jerusalem.',          direction: 'down',   row: 0, col: 4 },
      { word: 'REHOBOAM', hint: "Solomon's son whose harsh rule split the kingdom.",                 direction: 'across', row: 4, col: 1 },
      { word: 'JOSIAH',   hint: 'The young king who found the lost Book of the Law and reformed Israel.', direction: 'down', row: 4, col: 7 },
    ],
  },
  {
    id: 9,
    title: 'Level 9',
    theme: 'Prophets',
    gridSize: 9,
    words: [
      { word: 'ISAIAH',    hint: 'The prophet who foretold the coming of the Messiah in detail.',           direction: 'down',   row: 0, col: 0 },
      { word: 'JEREMIAH',  hint: 'The weeping prophet who warned Judah of coming destruction.',             direction: 'across', row: 3, col: 0 },
      { word: 'DANIEL',    hint: 'The prophet who survived the lion\'s den by faith.',                     direction: 'down',   row: 0, col: 4 },
      { word: 'EZEKIEL',   hint: 'The prophet who saw visions of dry bones coming to life.',               direction: 'down',   row: 0, col: 7 },
      { word: 'HOSEA',     hint: 'The prophet whose marriage illustrated God\'s love for unfaithful Israel.', direction: 'across', row: 6, col: 1 },
    ],
  },
  {
    id: 10,
    title: 'Level 10',
    theme: 'New Testament',
    gridSize: 8,
    words: [
      { word: 'PETER',   hint: 'The disciple who walked on water and became a leader of the early church.', direction: 'down',   row: 0, col: 0 },
      { word: 'PAUL',    hint: 'The apostle who spread the gospel to the Gentiles and wrote many epistles.', direction: 'down',  row: 0, col: 2 },
      { word: 'JOHN',    hint: 'The beloved disciple who wrote a Gospel, three letters, and Revelation.',    direction: 'across', row: 2, col: 2 },
      { word: 'MARY',    hint: 'The mother of Jesus who said "Let it be done according to your word."',     direction: 'across', row: 4, col: 0 },
      { word: 'STEPHEN', hint: 'The first Christian martyr, stoned for his faith.',                          direction: 'across', row: 6, col: 0 },
    ],
  },
];
