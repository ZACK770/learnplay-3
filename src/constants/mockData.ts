/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEngine, Dataset } from '../types';

export const MOCK_GAME_ENGINES: GameEngine[] = [
  {
    gameId: 'match-1',
    type: 'match',
    name: 'Memory Match',
    description: 'Classic memory matching game. Perfect for vocabulary and simple concepts.',
    thumbnail: 'https://picsum.photos/seed/game1/400/240',
    authorId: 'system',
    authorName: 'LearnPlay',
    rating: 4.8,
    playsCount: 1240,
    createdAt: new Date().toISOString(),
    schema: { 
      type: 'object', 
      properties: { 
        pairs: { 
          type: 'array', 
          items: { 
            type: 'object', 
            properties: { 
              front: { type: 'string', description: 'Term or Image' }, 
              back: { type: 'string', description: 'Definition or Pair' } 
            } 
          } 
        } 
      },
      required: ['pairs']
    }
  },
  {
    gameId: 'trivia-1',
    type: 'trivia',
    name: 'Trivia Pursuit',
    description: 'Multiple choice questions with rich feedback.',
    thumbnail: 'https://picsum.photos/seed/game2/400/240',
    authorId: 'system',
    authorName: 'LearnPlay',
    rating: 4.5,
    playsCount: 850,
    createdAt: new Date().toISOString(),
    schema: {
      type: 'object',
      properties: {
        questions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              question: { type: 'string' },
              options: { type: 'array', items: { type: 'string' } },
              answer: { type: 'string' },
              explanation: { type: 'string' }
            }
          }
        }
      },
      required: ['questions']
    }
  },
  {
    gameId: 'sort-1',
    type: 'sort',
    name: 'Bucket Sort',
    description: 'Categorize items into the correct buckets.',
    thumbnail: 'https://picsum.photos/seed/game3/400/240',
    authorId: 'system',
    authorName: 'LearnPlay',
    rating: 4.6,
    playsCount: 620,
    createdAt: new Date().toISOString(),
    schema: {
      type: 'object',
      properties: {
        buckets: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              category: { type: 'string' },
              items: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      },
      required: ['buckets']
    }
  },
  {
    gameId: 'uav-1',
    type: 'uav-intercept',
    name: "יירט את הכטב''ם!",
    description: "התאם בין המילה המופיע במסך המשימה לבין המילה שעל הכטב''מ. רק אם דייקת - הוא יתפוצץ!!",
    thumbnail: 'https://picsum.photos/seed/uav/400/240',
    authorId: 'admin',
    authorName: 'admin',
    rating: 4.2,
    playsCount: 81,
    createdAt: new Date().toISOString(),
    schema: {
      type: 'object',
      properties: {
        pairs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              target: { type: 'string', description: 'המילה המופיעה בפקודה' },
              label: { type: 'string', description: 'המילה המופיעה על הכטב"ם' }
            }
          }
        }
      },
      required: ['pairs']
    }
  }
];

export const MOCK_DATASETS: Dataset[] = [
  {
    datasetId: 'ds-uav-lang',
    title: 'דמו מובנה: שפות',
    description: 'תרגול תרגום מילים בסיסיות בשפות שונות תוך כדי יירוט כטב"מים.',
    domain: 'חדש: ארקייד ואקשן',
    gameType: 'uav-intercept',
    authorId: 'admin',
    isPublic: true,
    createdAt: new Date().toISOString(),
    content: {
      pairs: [
        { target: 'Apple', label: 'תפוח' },
        { target: 'House', label: 'בית' },
        { target: 'Sun', label: 'שמש' },
        { target: 'Water', label: 'מים' },
        { target: 'Car', label: 'מכונית' },
        { target: 'Tree', label: 'עץ' },
        { target: 'Dog', label: 'כלב' },
        { target: 'Book', label: 'ספר' }
      ]
    }
  },
  {
    datasetId: 'ds-lang-1',
    title: 'Spanish Essentials',
    description: 'Basic survival Spanish words and phrases.',
    domain: 'Language & Vocab',
    gameType: 'match',
    authorId: 'system',
    isPublic: true,
    createdAt: new Date().toISOString(),
    content: {
      pairs: [
        { front: 'Hello', back: 'Hola' },
        { front: 'Thank you', back: 'Gracias' },
        { front: 'Please', back: 'Por favor' },
        { front: 'Goodbye', back: 'Adiós' }
      ]
    }
  },
  {
    datasetId: 'ds-sci-1',
    title: 'Cell Biology',
    description: 'Structure and function of cell organelles.',
    domain: 'Science & Tech',
    gameType: 'sort',
    authorId: 'system',
    isPublic: true,
    createdAt: new Date().toISOString(),
    content: {
      buckets: [
        { category: 'Animal Cell', items: ['Centrioles', 'Lysosomes', 'Cilia'] },
        { category: 'Plant Cell', items: ['Cell Wall', 'Chloroplasts', 'Large Vacuole'] },
        { category: 'Both', items: ['Nucleus', 'Mitochondria', 'Ribosomes'] }
      ]
    }
  },
  {
    datasetId: 'ds-hist-1',
    title: 'Ancient Egypt',
    description: 'Pyramids, Pharaohs and Nile culture.',
    domain: 'History & Arts',
    gameType: 'trivia',
    authorId: 'system',
    isPublic: true,
    createdAt: new Date().toISOString(),
    content: {
      questions: [
        { 
          question: 'Which river was the lifeblood of Ancient Egypt?', 
          options: ['Nile', 'Amazon', 'Ganges', 'Mississippi'], 
          answer: 'Nile',
          explanation: 'The Nile provided water and fertile soil for farming.'
        }
      ]
    }
  }
];
