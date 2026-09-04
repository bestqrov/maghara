import 'dotenv/config';
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { UserSchema } from './src/schemas/user.schema';
import { MatchSchema } from './src/schemas/match.schema';
import { ConversationSchema } from './src/schemas/conversation.schema';
import { MessageSchema } from './src/schemas/message.schema';

const MONGODB_URI = process.env.MONGODB_URI;

type MatchStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ENGAGED';

// Weighted so most interactions read as "in progress" rather than all resolved.
const STATUS_WEIGHTS: [MatchStatus, number][] = [
  ['PENDING', 40],
  ['ACCEPTED', 35],
  ['ENGAGED', 15],
  ['REJECTED', 10],
];

const CONVERSATION_STARTERS = [
  'السلام عليكم، شرفت البروفايل ديالك وعجبني جدية الكلام لي كتبتي.',
  'مرحبا، بغيت نتعرف عليك بجدية إن شاء الله، كيف الحال؟',
];

const CONVERSATION_REPLIES = [
  'وعليكم السلام، أهلا بيك، شكرا على الكلام الطيب. حاب نعرف كثر على الأهداف ديالك من الزواج.',
  'أهلا وسهلا، الحمد لله بخير. راه فرحتني الرسالة ديالك، بغيت نتعرف بجدية.',
  'نورتي، والله بغيت شريك حياة يخاف الله ويكون فيه الاستقرار، وانت؟',
  'الله يجازيك بخير، أنا كذلك هدفي الزواج الجاد إن شاء الله بلا تضييع وقت.',
  'مزيان بزاف، شنو رأيك نتعرفو شوية على العائلة والقيم قبل مانمشيو قدام؟',
  'فكرة مزيانة، أنا من عائلة محافظة وكنعطي أهمية كبيرة للدين والاحترام.',
];

function pickStatus(): MatchStatus {
  const total = STATUS_WEIGHTS.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;
  for (const [status, weight] of STATUS_WEIGHTS) {
    if (roll < weight) return status;
    roll -= weight;
  }
  return 'PENDING';
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function seedInteractions() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set (check your .env file)');
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB...');

  const User = mongoose.model('User', UserSchema);
  const Match = mongoose.model('Match', MatchSchema);
  const Conversation = mongoose.model('Conversation', ConversationSchema);
  const Message = mongoose.model('Message', MessageSchema);

  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'seedProfiles.json'), 'utf-8'));
  const phoneNumbers = data.map((entry: { phoneNumber: string }) => entry.phoneNumber);

  const users = await User.find({ phoneNumber: { $in: phoneNumbers } }).select('_id profile.gender');
  const males = users.filter((u: any) => u.profile.gender === 'MALE').map((u: any) => u._id);
  const females = users.filter((u: any) => u.profile.gender === 'FEMALE').map((u: any) => u._id);

  if (males.length === 0 || females.length === 0) {
    throw new Error('Need at least one male and one female test profile — run `npm run seed` first.');
  }

  const userIds = users.map((u: any) => u._id);
  await Match.deleteMany({ senderId: { $in: userIds }, receiverId: { $in: userIds } });
  const oldConversations = await Conversation.find({ participants: { $in: userIds } }).select('_id');
  await Message.deleteMany({ conversationId: { $in: oldConversations.map((c: any) => c._id) } });
  await Conversation.deleteMany({ _id: { $in: oldConversations.map((c: any) => c._id) } });
  console.log('🧹 Cleaned existing test interactions.');

  let matchCount = 0;
  let conversationCount = 0;
  let messageCount = 0;

  for (const senderId of males) {
    const targets = shuffle(females).slice(0, 1 + Math.floor(Math.random() * 3));
    for (const receiverId of targets) {
      const status = pickStatus();
      const isSuperLike = Math.random() < 0.2;

      const match = await Match.create({ senderId, receiverId, status, isSuperLike });
      matchCount++;

      if (status === 'ACCEPTED' || status === 'ENGAGED') {
        const messageTexts = [
          CONVERSATION_STARTERS[Math.floor(Math.random() * CONVERSATION_STARTERS.length)],
          ...shuffle(CONVERSATION_REPLIES).slice(0, 2 + Math.floor(Math.random() * 3)),
        ];

        const conversation = await Conversation.create({
          matchId: match._id,
          participants: [senderId, receiverId],
          totalMessagesCount: messageTexts.length,
          lastMessageAt: new Date(),
        });
        conversationCount++;

        for (let i = 0; i < messageTexts.length; i++) {
          const isFromSender = i % 2 === 0;
          await Message.create({
            conversationId: conversation._id,
            senderId: isFromSender ? senderId : receiverId,
            receiverId: isFromSender ? receiverId : senderId,
            messageText: messageTexts[i],
            isRead: i < messageTexts.length - 1,
          });
          messageCount++;
        }
      }
    }
  }

  console.log(`🚀 Seeded ${matchCount} interests, ${conversationCount} conversations, ${messageCount} messages!`);

  await mongoose.disconnect();
}

seedInteractions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error seeding interactions:', error);
    process.exit(1);
  });
