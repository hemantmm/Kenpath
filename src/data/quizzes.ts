import { DailyQuiz } from '../types';

export const DAILY_QUIZZES: Record<string, DailyQuiz> = {
  // Default / evergreen daily quiz
  default: {
    date: '2026-10-12',
    title: 'Daily Micro-Skills',
    topic: 'Digital Safety & Money Basics',
    description: '5 quick questions to keep you smart, safe, and earning.',
    questions: [
      {
        id: 'q1',
        category: 'Digital Safety',
        prompt: 'Someone calls claiming to be from your bank and asks for your secret PIN or SMS code. What should you do?',
        options: [
          'Give it to them quickly so they can help',
          'Hang up immediately and never share your PIN',
          'Ask them to send an email first',
          'Give only the first two numbers',
        ],
        correctIndex: 1,
        explanation: 'Real banks and official apps will NEVER ask for your secret PIN or one-time SMS password.',
      },
      {
        id: 'q2',
        category: 'Money Smarts',
        prompt: 'Why is having a small emergency savings fund helpful?',
        options: [
          'It allows you to buy luxury items anytime',
          'It covers sudden costs like doctor visits or repairs without taking loans',
          'It guarantees your money doubles every month',
          'Banks require you to have one or they close your account',
        ],
        correctIndex: 1,
        explanation: 'An emergency fund protects you from high-interest debt when sudden unexpected expenses happen.',
      },
      {
        id: 'q3',
        category: 'Practical English',
        prompt: 'Which sentence is the most polite and clear way to ask a customer for their name?',
        options: [
          'Tell me your name now.',
          'May I please have your name?',
          'Who are you?',
          'Write name here quick.',
        ],
        correctIndex: 1,
        explanation: '"May I please have your name?" is professional, courteous, and respectful in any workplace.',
      },
      {
        id: 'q4',
        category: 'Mobile Data Saving',
        prompt: 'Which action uses the most mobile data on your phone?',
        options: [
          'Sending a short text message on WhatsApp',
          'Watching high-definition video for 30 minutes',
          'Reading a plain text webpage',
          'Checking the time and weather',
        ],
        correctIndex: 1,
        explanation: 'Streaming high-definition video consumes up to 100 times more data than sending text messages.',
      },
      {
        id: 'q5',
        category: 'Work Habit',
        prompt: 'When you make a promise to deliver work by 3:00 PM, what is the best practice?',
        options: [
          'Wait until tomorrow and say nothing',
          'Deliver on or before 3:00 PM, or inform the person early if there is a delay',
          'Deliver whenever you feel like it',
          'Blame the phone battery after the deadline passes',
        ],
        correctIndex: 1,
        explanation: 'Communicating early builds strong trust with clients, employers, and team members.',
      },
    ],
  },
};

export function getDailyQuizForDate(dateStr: string): DailyQuiz {
  // If specific date quiz exists, return it; otherwise return default with updated date
  if (DAILY_QUIZZES[dateStr]) {
    return DAILY_QUIZZES[dateStr];
  }
  return {
    ...DAILY_QUIZZES.default,
    date: dateStr,
  };
}
