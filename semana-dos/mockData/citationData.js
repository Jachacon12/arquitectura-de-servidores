const generateId = () => {
  const timestamp = new Date().getTime().toString(36);
  const randomString = Math.random().toString(36).substr(2, 9);
  return `${timestamp}${randomString}`;
};

const citations = [
  {
    title: 'Passion for Work',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    source: 'Stanford Commencement Address',
    year: 2005,
  },
  {
    title: 'Be the Change',
    text: 'Be the change you wish to see in the world.',
    author: 'Mahatma Gandhi',
    source: 'Unknown',
    year: 1913,
  },
  {
    title: 'Persistence in Invention',
    text: "I have not failed. I've just found 10,000 ways that won't work.",
    author: 'Thomas A. Edison',
    source: 'Unknown',
    year: 1910,
  },
  {
    title: 'The Road Not Taken',
    text: 'Two roads diverged in a wood, and I—I took the one less traveled by, And that has made all the difference.',
    author: 'Robert Frost',
    source: 'The Road Not Taken',
    year: 1916,
  },
  {
    title: "Hamlet's Dilemma",
    text: 'To be or not to be, that is the question.',
    author: 'William Shakespeare',
    source: 'Hamlet',
    year: 1603,
  },
];

module.exports = citations.map((citation) => ({
  ...citation,
  id: generateId(),
}));
