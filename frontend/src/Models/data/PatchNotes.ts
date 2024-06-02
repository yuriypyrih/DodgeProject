export const PATCH_NOTES: Array<{
  title: string;
  tag: string;
  content: string[];
}> = [
  {
    title: 'Patch v1.3: Chaos Expansion',
    tag: 'v1.3',
    content: [
      'After a long pause due to life circumstances, we are back with a explosive entrance!',
      '- Full backend support and account management',
      '- 24 playable levels',
      '- 3 Chaos Dungeons',
      '- 12 Augments',
      '- Global Leaderboards',
      '- A Copilot named YURIV dropping tips and comments (I promise he will get smarter!)',
    ],
  },
  {
    title: 'Patch v1.2.5: Backend - Hotfixes',
    tag: 'v1.2.5',
    content: [
      "After the deployment of the backend server and database, there were some complications. It would have been unusual if there weren't any. Fortunately, I had some time to fix them right away.",
      '- Loading spinners have been added to login/register',
      '- Refresh rate throttling capped at 60fps',
      '- Bugfix: Winning a level now properly unlocks the next one',
      '- Bugfix: Autocomplete no longer overrides styles',
    ],
  },
  {
    title: 'Patch v1.2: Backend',
    tag: 'v1.2',
    content: [
      'The backend integration is now live! You can now log in and keep your progress stored in your account.',
      '- What a time to be alive!',
    ],
  },
  {
    title: 'Patch v1.0: Dodge is now LIVE',
    tag: 'v1.0',
    content: ["It's been a long journey, but the Dodge Game is now live on Netlify!"],
  },
  {
    title: 'Patch v0.2: Levels',
    tag: 'v0.2',
    content: [
      'A set of 11 playable levels is now available. More levels are in development. The goal is to have at least 20 playable levels by the end of this project.',
    ],
  },
  {
    title: 'Patch v0.1: Foundation',
    tag: 'v0.1',
    content: [
      'In 2018, I created the first demo using Java for what would become the Dodge Project. In 2020, I decided to make it into a web application and rewrote it in JavaScript. In 2021, I rewrote it again in TypeScript.',
      'Nowadays, it works with modern JavaScript frameworks like React alongside UI libraries such as Material-UI. This project, although ambitious, aims to serve as a portfolio piece. Later on, I plan to add more levels, superpowers/relics, settings, an achievement system, global leaderboards, and much more!',
    ],
  },
];
