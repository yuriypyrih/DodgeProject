# The Dodge Game

The Dodge is a passion project of mine which I have been brewing for a while.
It was originally an old Java experimentation that has been completely rebooted using modern Web Stack Technologies such as TypeScript and much more!
In this game, you survive through various levels by dodging enemies and collecting stars.
Enemies are color-coded with unique behavioral patterns, and you can equip powerful augments to overcome bosses and challenges.
Your achievements will be displayed on public Leaderboards, showcasing your glory in the Chaos dungeons.

This project leverages a variety of modern technologies:

- **Programming Language**: TypeScript (aka JavaScript on steroids)
- **Game Engine**: Custom made engine using HTML Canvas and RequestAnimationFrame for the game loop
- **Front End**: ReactJs, Redux (RTK), Material-UI, Axios
- **Design**: Adobe XD, Illustrator, and the power of CSS animations
- **Back End**: NodeJs (ExpressJS), MongoDB, JWT Auth 

Stay tuned for a Dev Blog where I will dive deeper into the creation process and the tools used.

## Features

- **Challenging Gameplay**: Dodge enemies and collect stars across various levels.
- **Augments**: Equip powerful and game-altering power-ups to overcome bosses and challenges.
- **Chaos Dungeons and Leaderboards**: Survive chaotic levels and compete on public Leaderboards.
- **Achievements**: A dozen of achievements to unlock for a good reward.
- **Shop and Cosmetics**: Pretty cosmetics to show off and showcasing online payment via Stripe.

## Local Installation

Getting started with The Dodge is straightforward. Follow these steps to set up your local environment:

### Prerequisites

- Node.js and npm installed
- MongoDB (running locally or via Docker)

### Setup Instructions

**1. Clone the repository**
```bash
git clone https://github.com/yuriypyrih/DodgeProject.git
```

**2. Install dependencies**

Run `npm install` in the following directories:
- Root directory
- `/backend`
- `/frontend`

**3. Configure environment variables**

Contact YURIV to obtain the `.env` files for both backend and frontend.

**4. Set up the database**

Ensure MongoDB is running locally (Docker recommended) and add the connection URL to your backend `.env` file.

**5. Start the backend server**
```bash
cd backend
npm start
```

The backend should now be accessible at `http://localhost:5001`

**6. Start the frontend application**
```bash
cd frontend
npm start
```

The frontend should now be accessible at `http://localhost:3000`

**7. Enjoy!**

You're all set. Happy coding!
