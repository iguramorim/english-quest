import { Dialogue } from "@/types/game";

export const DIALOGUES: Dialogue[] = [
  {
    id: "dlg-home-guide",
    npcId: "guide",
    locationId: "home",
    title: "A warm welcome",
    lines: [
      { id: "l1", speaker: "guide", text: "Welcome home, dear! Ready to explore the town and learn some English?" },
      {
        id: "l2", speaker: "player", text: "",
        choices: [
          { text: "Yes, I'm ready!", correct: true },
          { text: "The soup is hot.", correct: false, feedback: "Isso não responde à pergunta da vovó." },
          { text: "I am ten years old.", correct: false, feedback: "Sem relação com a pergunta feita." },
        ],
      },
      { id: "l3", speaker: "guide", text: "Wonderful! Head out and say hello to Emma at the park." },
    ],
  },
  {
    id: "dlg-park-emma-intro",
    npcId: "emma",
    locationId: "park",
    title: "Meeting Emma",
    lines: [
      { id: "l1", speaker: "emma", text: "Hi! I'm Emma. What's your name?" },
      {
        id: "l2", speaker: "player", text: "",
        choices: [
          { text: "My name is Alex.", correct: true },
          { text: "Yesterday I went home.", correct: false, feedback: "Isso está no passado e não responde à pergunta sobre seu nome." },
          { text: "My favorite color is blue.", correct: false, feedback: "Isso não responde \"o que é seu nome\"." },
        ],
      },
      { id: "l3", speaker: "emma", text: "Nice to meet you!", note: "\"Nice to meet you\" = Prazer em conhecer você." },
    ],
  },
  {
    id: "dlg-park-emma-directions",
    npcId: "emma",
    locationId: "park",
    title: "Asking for directions",
    lines: [
      { id: "l1", speaker: "emma", text: "Are you looking for somewhere?" },
      {
        id: "l2", speaker: "player", text: "",
        choices: [
          { text: "Yes, where is the café?", correct: true },
          { text: "Yes, I am from Brazil.", correct: false, feedback: "Isso não é uma pergunta sobre localização." },
          { text: "No, I like parks.", correct: false, feedback: "Isso não pede uma direção." },
        ],
      },
      { id: "l3", speaker: "emma", text: "Go straight and turn left. It's next to the market!" },
    ],
  },
  {
    id: "dlg-cafe-james-order",
    npcId: "james",
    locationId: "cafe",
    title: "Ordering a drink",
    lines: [
      { id: "l1", speaker: "james", text: "Good morning! What would you like to order?" },
      {
        id: "l2", speaker: "player", text: "",
        choices: [
          { text: "I'd like a coffee, please.", correct: true },
          { text: "I went home yesterday.", correct: false, feedback: "Isso não responde ao pedido do James." },
          { text: "My favorite color is blue.", correct: false, feedback: "Isso não tem relação com pedir uma bebida." },
        ],
      },
      { id: "l3", speaker: "james", text: "Great choice! Anything else?", note: "\"Anything else?\" = Mais alguma coisa?" },
    ],
  },
  {
    id: "dlg-cafe-james-bill",
    npcId: "james",
    locationId: "cafe",
    title: "Asking for the bill",
    lines: [
      { id: "l1", speaker: "james", text: "Was everything okay?" },
      {
        id: "l2", speaker: "player", text: "",
        choices: [
          { text: "Yes, thank you! Can I have the bill, please?", correct: true },
          { text: "Yes, the bill is blue.", correct: false, feedback: "\"Bill\" aqui é a conta, não uma cor." },
          { text: "No, I don't have a bill.", correct: false, feedback: "Isso não faz sentido como resposta." },
        ],
      },
      { id: "l3", speaker: "james", text: "Of course, here you go. Have a great day!" },
    ],
  },
  {
    id: "dlg-market-daniel-shopping",
    npcId: "daniel",
    locationId: "market",
    title: "Shopping at the market",
    lines: [
      { id: "l1", speaker: "daniel", text: "Welcome! Are you looking for something fresh today?" },
      {
        id: "l2", speaker: "player", text: "",
        choices: [
          { text: "Yes, how much are the apples?", correct: true },
          { text: "Yes, I like school.", correct: false, feedback: "Não relacionado com comprar frutas." },
          { text: "No, goodbye forever.", correct: false, feedback: "Muito abrupto e não combina com a cena." },
        ],
      },
      { id: "l3", speaker: "daniel", text: "They're two dollars a kilo — very fresh!" },
    ],
  },
  {
    id: "dlg-market-daniel-discount",
    npcId: "daniel",
    locationId: "market",
    title: "Asking for a discount",
    lines: [
      { id: "l1", speaker: "daniel", text: "Would you like anything else?" },
      {
        id: "l2", speaker: "player", text: "",
        choices: [
          { text: "Is there a discount if I buy more?", correct: true },
          { text: "I finished my homework.", correct: false, feedback: "Sem relação com o mercado." },
          { text: "The library is closed.", correct: false, feedback: "Sem relação com a compra." },
        ],
      },
      { id: "l3", speaker: "daniel", text: "Sure, buy three and get one free!" },
    ],
  },
  {
    id: "dlg-school-sarah-lesson",
    npcId: "sarah",
    locationId: "school",
    title: "Starting the lesson",
    lines: [
      { id: "l1", speaker: "sarah", text: "Good to see you! Ready for today's lesson?" },
      {
        id: "l2", speaker: "player", text: "",
        choices: [
          { text: "Yes, I'm ready! Can we review verbs?", correct: true },
          { text: "I am a book.", correct: false, feedback: "Isso não responde à pergunta." },
          { text: "The market is far.", correct: false, feedback: "Sem relação com a aula." },
        ],
      },
      { id: "l3", speaker: "sarah", text: "Perfect. Let's start with the present simple!" },
    ],
  },
  {
    id: "dlg-library-olivia-borrow",
    npcId: "olivia",
    locationId: "library",
    title: "Borrowing a book",
    lines: [
      { id: "l1", speaker: "olivia", text: "Shh! Welcome to the library. Looking for a book?" },
      {
        id: "l2", speaker: "player", text: "",
        choices: [
          { text: "Yes, can I borrow this one?", correct: true },
          { text: "Yes, I am hungry.", correct: false, feedback: "Isso não pede um livro emprestado." },
          { text: "No, I like loud music.", correct: false, feedback: "Bibliotecas pedem silêncio, e isso não responde à pergunta." },
        ],
      },
      { id: "l3", speaker: "olivia", text: "Of course. Please return it in two weeks." },
    ],
  },
  {
    id: "dlg-hospital-robert-checkup",
    npcId: "robert",
    locationId: "hospital",
    title: "A quick check-up",
    lines: [
      { id: "l1", speaker: "robert", text: "Hello. How are you feeling today?" },
      {
        id: "l2", speaker: "player", text: "",
        choices: [
          { text: "I have a headache and I feel tired.", correct: true },
          { text: "I like pizza very much.", correct: false, feedback: "Sem relação com sintomas." },
          { text: "It's a sunny day.", correct: false, feedback: "Isso não descreve como você se sente." },
        ],
      },
      { id: "l3", speaker: "robert", text: "I see. Let's take a look — try to rest today." },
    ],
  },
  {
    id: "dlg-hotel-michael-checkin",
    npcId: "michael",
    locationId: "hotel",
    title: "Checking in",
    lines: [
      { id: "l1", speaker: "michael", text: "Welcome to Sunrise Hotel! Do you have a reservation?" },
      {
        id: "l2", speaker: "player", text: "",
        choices: [
          { text: "Yes, under the name Alex, for two nights.", correct: true },
          { text: "Yes, I like the beach.", correct: false, feedback: "Não confirma a reserva." },
          { text: "No, I am a doctor.", correct: false, feedback: "Sem relação com a pergunta." },
        ],
      },
      { id: "l3", speaker: "michael", text: "Great, here is your key — room 204, second floor." },
    ],
  },
];

export function dialogueById(id: string): Dialogue | undefined {
  return DIALOGUES.find((d) => d.id === id);
}
