import { Question } from "@/types/game";

// 50 questions, organized by location, difficulty A1 -> B1.
// Each question stands alone as data — no logic lives in here.

export const QUESTIONS: Question[] = [
  // ----------------------------------------------------------------- HOME (2)
  {
    id: "home-01", type: "multiple-choice", difficulty: "A1", locationId: "home",
    prompt: "Grandma Rose says: \"Ready to explore the town?\"",
    options: ["Yes, I'm ready!", "The soup is hot.", "I am ten years old."],
    correctAnswer: "Yes, I'm ready!",
    explanation: "Uma resposta simples e positiva confirma que você está pronto.", xp: 15,
  },
  {
    id: "home-02", type: "vocabulary", difficulty: "A1", locationId: "home",
    prompt: "What does \"Hello\" mean?",
    word: "Hello",
    options: ["Olá", "Tchau", "Obrigado"],
    correctAnswer: "Olá",
    explanation: "\"Hello\" é uma saudação usada para cumprimentar alguém.", xp: 10,
  },

  // ---------------------------------------------------------------- PARK (8)
  {
    id: "park-01", type: "multiple-choice", difficulty: "A1", locationId: "park",
    prompt: "Emma says: \"Hi! I'm Emma. What's your name?\" How do you answer?",
    options: ["My name is Alex.", "Yesterday I went home.", "Blue is my favorite."],
    correctAnswer: "My name is Alex.",
    explanation: "\"My name is...\" é usado para se apresentar.", xp: 20,
  },
  {
    id: "park-02", type: "multiple-choice", difficulty: "A1", locationId: "park",
    prompt: "Someone says \"Nice to meet you!\" What does it mean?",
    options: ["Prazer em conhecer você", "Eu não te conheço", "Até logo"],
    correctAnswer: "Prazer em conhecer você",
    explanation: "É uma expressão educada usada logo após ser apresentado a alguém.", xp: 15,
  },
  {
    id: "park-03", type: "fill-blank", difficulty: "A1", locationId: "park",
    prompt: "Complete: \"___ are you?\" — \"I'm fine, thanks!\"",
    sentenceParts: ["", " are you?"],
    options: ["How", "What", "Who"],
    correctAnswer: "How",
    explanation: "\"How are you?\" é a forma comum de perguntar sobre o estado de alguém.", xp: 15,
  },
  {
    id: "park-04", type: "sentence-builder", difficulty: "A1", locationId: "park",
    prompt: "Put the words in order to greet someone.",
    words: ["you", "to", "meet", "Nice"],
    correctOrder: ["Nice", "to", "meet", "you"],
    explanation: "A ordem correta é: Nice to meet you.", xp: 20,
  },
  {
    id: "park-05", type: "translation", difficulty: "A1", locationId: "park",
    prompt: "Translate to English: \"Eu me chamo Alex.\"",
    sourceText: "Eu me chamo Alex.",
    acceptedAnswers: ["my name is alex", "i am alex", "im alex"],
    explanation: "\"My name is Alex\" é a forma mais comum de dizer isso.", xp: 20,
  },
  {
    id: "park-06", type: "vocabulary", difficulty: "A1", locationId: "park",
    prompt: "What does \"friend\" mean?",
    word: "friend",
    options: ["amigo(a)", "inimigo(a)", "professor(a)"],
    correctAnswer: "amigo(a)",
    explanation: "\"Friend\" significa amigo ou amiga.", xp: 10,
  },
  {
    id: "park-07", type: "grammar", difficulty: "A2", locationId: "park",
    prompt: "Choose the correct question: ___",
    options: ["Where is the library?", "Where the library is?", "Is where the library?"],
    correctAnswer: "Where is the library?",
    explanation: "Em perguntas com \"where\", o verbo \"is\" vem antes do sujeito.", xp: 20,
  },
  {
    id: "park-08", type: "sentence-builder", difficulty: "A2", locationId: "park",
    prompt: "Order the words to ask for directions.",
    words: ["straight", "and", "turn", "Go", "left"],
    correctOrder: ["Go", "straight", "and", "turn", "left"],
    explanation: "\"Go straight and turn left\" é uma instrução comum de direção.", xp: 20,
  },

  // ---------------------------------------------------------------- CAFE (8)
  {
    id: "cafe-order-01", type: "multiple-choice", difficulty: "A1", locationId: "cafe",
    prompt: "\"What would you like to drink?\"",
    options: ["I want a coffee, please.", "Yesterday I went home.", "My favorite color is blue."],
    correctAnswer: "I want a coffee, please.",
    explanation: "\"What would you like...?\" é usado para perguntar o que a pessoa deseja.", xp: 20,
  },
  {
    id: "cafe-02", type: "fill-blank", difficulty: "A1", locationId: "cafe",
    prompt: "\"Could I see the ___, please?\"",
    sentenceParts: ["Could I see the ", ", please?"],
    options: ["menu", "bill", "book"],
    correctAnswer: "menu",
    explanation: "O \"menu\" é a lista de itens que você pode pedir.", xp: 15,
  },
  {
    id: "cafe-03", type: "vocabulary", difficulty: "A1", locationId: "cafe",
    prompt: "What does \"bill\" mean here?",
    word: "bill",
    options: ["conta", "prato", "garfo"],
    correctAnswer: "conta",
    explanation: "\"Bill\" é a conta que você paga no restaurante ou café.", xp: 10,
  },
  {
    id: "cafe-04", type: "translation", difficulty: "A1", locationId: "cafe",
    prompt: "Translate: \"Posso pegar a conta, por favor?\"",
    sourceText: "Posso pegar a conta, por favor?",
    acceptedAnswers: ["can i have the bill please", "can i get the bill please"],
    explanation: "\"Can I have the bill, please?\" é como se pede a conta.", xp: 20,
  },
  {
    id: "cafe-05", type: "sentence-builder", difficulty: "A1", locationId: "cafe",
    prompt: "Order the words to ask for the price.",
    words: ["is", "much", "How", "it?"],
    correctOrder: ["How", "much", "is", "it?"],
    explanation: "\"How much is it?\" pergunta o preço de algo.", xp: 20,
  },
  {
    id: "cafe-06", type: "multiple-choice", difficulty: "A2", locationId: "cafe",
    prompt: "You want a small snack. What do you say?",
    options: ["Can I also get a sandwich?", "I went to the café.", "The café is closed."],
    correctAnswer: "Can I also get a sandwich?",
    explanation: "Isso pede um item adicional de forma educada.", xp: 20,
  },
  {
    id: "cafe-07", type: "grammar", difficulty: "A2", locationId: "cafe",
    prompt: "Which sentence uses \"would like\" correctly?",
    options: ["I would like a tea.", "I would likes a tea.", "I would to like a tea."],
    correctAnswer: "I would like a tea.",
    explanation: "\"Would like\" é sempre seguido do verbo no infinitivo sem \"to\" ou de um substantivo.", xp: 20,
  },
  {
    id: "cafe-08", type: "fill-blank", difficulty: "B1", locationId: "cafe",
    prompt: "\"I've ___ finished my coffee.\"",
    sentenceParts: ["I've ", " finished my coffee."],
    options: ["already", "yesterday", "tomorrow"],
    correctAnswer: "already",
    explanation: "\"Already\" é usado com o present perfect para indicar que algo já aconteceu.", xp: 25,
  },

  // -------------------------------------------------------------- MARKET (7)
  {
    id: "market-01", type: "multiple-choice", difficulty: "A1", locationId: "market",
    prompt: "\"Are you looking for something fresh today?\"",
    options: ["Yes, I need some fruit.", "I am from Brazil.", "See you later!"],
    correctAnswer: "Yes, I need some fruit.",
    explanation: "Responder ao que o vendedor perguntou sobre o que você procura.", xp: 20,
  },
  {
    id: "market-02", type: "vocabulary", difficulty: "A1", locationId: "market",
    prompt: "What does \"price\" mean?",
    word: "price",
    options: ["preço", "prazo", "prato"],
    correctAnswer: "preço",
    explanation: "\"Price\" é o valor de algo, o preço.", xp: 10,
  },
  {
    id: "market-03", type: "translation", difficulty: "A1", locationId: "market",
    prompt: "Translate: \"Quanto custa isso?\"",
    sourceText: "Quanto custa isso?",
    acceptedAnswers: ["how much is it", "how much is this"],
    explanation: "\"How much is it?\" pergunta o preço.", xp: 20,
  },
  {
    id: "market-04", type: "fill-blank", difficulty: "A2", locationId: "market",
    prompt: "\"This bread is very ___.\"",
    sentenceParts: ["This bread is very ", "."],
    options: ["fresh", "cheap", "expensive"],
    correctAnswer: "fresh",
    explanation: "\"Fresh\" descreve algo recém-feito ou colhido.", xp: 20,
  },
  {
    id: "market-05", type: "grammar", difficulty: "A2", locationId: "market",
    prompt: "Choose the correct comparative: \"This market is ___ than that one.\"",
    options: ["cheaper", "more cheap", "cheapest"],
    correctAnswer: "cheaper",
    explanation: "Adjetivos curtos formam o comparativo com \"-er\".", xp: 20,
  },
  {
    id: "market-06", type: "sentence-builder", difficulty: "A2", locationId: "market",
    prompt: "Order the words to ask about a discount.",
    words: ["a", "discount?", "Is", "there"],
    correctOrder: ["Is", "there", "a", "discount?"],
    explanation: "\"Is there a discount?\" pergunta se existe desconto.", xp: 20,
  },
  {
    id: "market-07", type: "multiple-choice", difficulty: "B1", locationId: "market",
    prompt: "Choose the polite way to disagree on price:",
    options: ["That's a bit too expensive for me.", "That's wrong!", "No way, never."],
    correctAnswer: "That's a bit too expensive for me.",
    explanation: "É uma forma educada de expressar que o preço está alto.", xp: 25,
  },

  // -------------------------------------------------------------- SCHOOL (7)
  {
    id: "school-01", type: "multiple-choice", difficulty: "A1", locationId: "school",
    prompt: "Sarah asks: \"Ready for today's lesson?\"",
    options: ["Yes, I'm ready!", "I am a book.", "The sky is blue."],
    correctAnswer: "Yes, I'm ready!",
    explanation: "Uma resposta natural e positiva à pergunta.", xp: 20,
  },
  {
    id: "school-02", type: "grammar", difficulty: "A1", locationId: "school",
    prompt: "Choose the correct verb form: \"She ___ to school every day.\"",
    options: ["goes", "go", "going"],
    correctAnswer: "goes",
    explanation: "Na terceira pessoa do singular no presente simples, adicionamos \"-s\".", xp: 20,
  },
  {
    id: "school-03", type: "vocabulary", difficulty: "A1", locationId: "school",
    prompt: "What does \"homework\" mean?",
    word: "homework",
    options: ["lição de casa", "sala de aula", "recreio"],
    correctAnswer: "lição de casa",
    explanation: "\"Homework\" é a tarefa escolar feita em casa.", xp: 10,
  },
  {
    id: "school-04", type: "fill-blank", difficulty: "A2", locationId: "school",
    prompt: "\"I don't ___ this word.\"",
    sentenceParts: ["I don't ", " this word."],
    options: ["understand", "understands", "understanding"],
    correctAnswer: "understand",
    explanation: "Depois de \"don't\", usamos o verbo no infinitivo sem \"to\".", xp: 20,
  },
  {
    id: "school-05", type: "sentence-builder", difficulty: "A2", locationId: "school",
    prompt: "Order the words to ask a question in class.",
    words: ["ask", "Can", "a", "I", "question?"],
    correctOrder: ["Can", "I", "ask", "a", "question?"],
    explanation: "\"Can I ask a question?\" é uma forma educada de pedir para perguntar.", xp: 20,
  },
  {
    id: "school-06", type: "grammar", difficulty: "B1", locationId: "school",
    prompt: "Choose the correct past tense: \"Yesterday, I ___ my homework.\"",
    options: ["finished", "finish", "finishes"],
    correctAnswer: "finished",
    explanation: "Verbos regulares formam o passado com \"-ed\".", xp: 25,
  },
  {
    id: "school-07", type: "translation", difficulty: "B1", locationId: "school",
    prompt: "Translate: \"Eu preciso estudar mais.\"",
    sourceText: "Eu preciso estudar mais.",
    acceptedAnswers: ["i need to study more"],
    explanation: "\"Need to\" + verbo indica necessidade.", xp: 25,
  },

  // ------------------------------------------------------------- LIBRARY (6)
  {
    id: "library-01", type: "multiple-choice", difficulty: "A1", locationId: "library",
    prompt: "Olivia asks: \"Looking for a book?\"",
    options: ["Yes, something about history.", "I am hungry.", "It's raining today."],
    correctAnswer: "Yes, something about history.",
    explanation: "Responde diretamente ao que foi perguntado.", xp: 20,
  },
  {
    id: "library-02", type: "vocabulary", difficulty: "A1", locationId: "library",
    prompt: "What does \"borrow\" mean?",
    word: "borrow",
    options: ["pegar emprestado", "comprar", "vender"],
    correctAnswer: "pegar emprestado",
    explanation: "\"Borrow\" significa pegar algo emprestado.", xp: 10,
  },
  {
    id: "library-03", type: "fill-blank", difficulty: "A2", locationId: "library",
    prompt: "\"Please be ___ in the library.\"",
    sentenceParts: ["Please be ", " in the library."],
    options: ["quiet", "loud", "fast"],
    correctAnswer: "quiet",
    explanation: "Bibliotecas pedem silêncio: \"quiet\".", xp: 20,
  },
  {
    id: "library-04", type: "sentence-builder", difficulty: "A2", locationId: "library",
    prompt: "Order the words to ask to borrow a book.",
    words: ["I", "this", "borrow", "book?", "Can"],
    correctOrder: ["Can", "I", "borrow", "this", "book?"],
    explanation: "\"Can I borrow this book?\" pede para pegar o livro emprestado.", xp: 20,
  },
  {
    id: "library-05", type: "translation", difficulty: "A2", locationId: "library",
    prompt: "Translate: \"Eu preciso devolver este livro amanhã.\"",
    sourceText: "Eu preciso devolver este livro amanhã.",
    acceptedAnswers: ["i need to return this book tomorrow"],
    explanation: "\"Return\" significa devolver.", xp: 20,
  },
  {
    id: "library-06", type: "grammar", difficulty: "B1", locationId: "library",
    prompt: "Choose the correct sentence:",
    options: ["I have read three books this month.", "I have readed three books this month.", "I has read three books this month."],
    correctAnswer: "I have read three books this month.",
    explanation: "\"Read\" no particípio passado é irregular: read (mesma forma).", xp: 25,
  },

  // ------------------------------------------------------------ HOSPITAL (7)
  {
    id: "hospital-01", type: "multiple-choice", difficulty: "A1", locationId: "hospital",
    prompt: "\"How are you feeling today?\"",
    options: ["I have a headache.", "I like pizza.", "It's Monday."],
    correctAnswer: "I have a headache.",
    explanation: "Descreve um sintoma em resposta à pergunta do médico.", xp: 20,
  },
  {
    id: "hospital-02", type: "vocabulary", difficulty: "A1", locationId: "hospital",
    prompt: "What does \"headache\" mean?",
    word: "headache",
    options: ["dor de cabeça", "dor de barriga", "dor nas costas"],
    correctAnswer: "dor de cabeça",
    explanation: "\"Headache\" é dor de cabeça.", xp: 10,
  },
  {
    id: "hospital-03", type: "fill-blank", difficulty: "A2", locationId: "hospital",
    prompt: "\"I have an ___ at 3 PM.\"",
    sentenceParts: ["I have an ", " at 3 PM."],
    options: ["appointment", "homework", "reservation"],
    correctAnswer: "appointment",
    explanation: "\"Appointment\" é uma consulta ou compromisso marcado.", xp: 20,
  },
  {
    id: "hospital-04", type: "sentence-builder", difficulty: "A2", locationId: "hospital",
    prompt: "Order the words to describe how you feel.",
    words: ["well", "don't", "I", "feel"],
    correctOrder: ["I", "don't", "feel", "well"],
    explanation: "\"I don't feel well\" significa que você não está se sentindo bem.", xp: 20,
  },
  {
    id: "hospital-05", type: "translation", difficulty: "A2", locationId: "hospital",
    prompt: "Translate: \"Eu preciso de um médico.\"",
    sourceText: "Eu preciso de um médico.",
    acceptedAnswers: ["i need a doctor"],
    explanation: "\"I need a doctor\" pede ajuda médica.", xp: 20,
  },
  {
    id: "hospital-06", type: "grammar", difficulty: "B1", locationId: "hospital",
    prompt: "Choose the correct sentence:",
    options: ["I have had this pain for two days.", "I have this pain since two days.", "I had this pain for two days ago."],
    correctAnswer: "I have had this pain for two days.",
    explanation: "Present perfect + \"for\" indica duração até agora.", xp: 25,
  },
  {
    id: "hospital-07", type: "dialogue", difficulty: "B1", locationId: "hospital",
    prompt: "Doctor: \"Does it hurt when I press here?\" You:",
    options: ["Yes, a little.", "I like coffee.", "See you tomorrow."],
    correctAnswer: "Yes, a little.",
    explanation: "Responde diretamente à pergunta sobre dor.", xp: 25,
  },

  // --------------------------------------------------------------- HOTEL (7)
  {
    id: "hotel-01", type: "multiple-choice", difficulty: "A1", locationId: "hotel",
    prompt: "\"Do you have a reservation?\"",
    options: ["Yes, under the name Alex.", "I like the beach.", "It's very cold."],
    correctAnswer: "Yes, under the name Alex.",
    explanation: "Confirma a reserva feita com seu nome.", xp: 20,
  },
  {
    id: "hotel-02", type: "vocabulary", difficulty: "A1", locationId: "hotel",
    prompt: "What does \"luggage\" mean?",
    word: "luggage",
    options: ["bagagem", "quarto", "elevador"],
    correctAnswer: "bagagem",
    explanation: "\"Luggage\" são as malas que você leva na viagem.", xp: 10,
  },
  {
    id: "hotel-03", type: "fill-blank", difficulty: "A2", locationId: "hotel",
    prompt: "\"What time can I ___ in?\"",
    sentenceParts: ["What time can I ", " in?"],
    options: ["check", "read", "borrow"],
    correctAnswer: "check",
    explanation: "\"Check in\" é o processo de entrada no hotel.", xp: 20,
  },
  {
    id: "hotel-04", type: "sentence-builder", difficulty: "A2", locationId: "hotel",
    prompt: "Order the words to ask about your room.",
    words: ["room", "Which", "floor", "is", "my", "on?"],
    correctOrder: ["Which", "floor", "is", "my", "room", "on?"],
    explanation: "\"Which floor is my room on?\" pergunta o andar do quarto.", xp: 20,
  },
  {
    id: "hotel-05", type: "translation", difficulty: "A2", locationId: "hotel",
    prompt: "Translate: \"Eu tenho uma reserva para duas noites.\"",
    sourceText: "Eu tenho uma reserva para duas noites.",
    acceptedAnswers: ["i have a reservation for two nights"],
    explanation: "\"Reservation\" é reserva; \"nights\" são noites.", xp: 20,
  },
  {
    id: "hotel-06", type: "grammar", difficulty: "B1", locationId: "hotel",
    prompt: "Choose the correct sentence:",
    options: ["Could you help me with my luggage?", "Could you helps me with my luggage?", "Could you to help me with my luggage?"],
    correctAnswer: "Could you help me with my luggage?",
    explanation: "\"Could you\" é sempre seguido pelo verbo no infinitivo sem \"to\".", xp: 25,
  },
  {
    id: "hotel-07", type: "dialogue", difficulty: "B1", locationId: "hotel",
    prompt: "Michael: \"Would you like a wake-up call?\" You:",
    options: ["Yes, at 7 AM, please.", "I don't have luggage.", "The weather is nice."],
    correctAnswer: "Yes, at 7 AM, please.",
    explanation: "Responde de forma coerente pedindo o horário do despertar.", xp: 25,
  },
];

export function questionsByIds(ids: string[]): Question[] {
  return ids
    .map((id) => QUESTIONS.find((q) => q.id === id))
    .filter((q): q is Question => Boolean(q));
}

export function questionsByLocation(locationId: string): Question[] {
  return QUESTIONS.filter((q) => q.locationId === locationId);
}
