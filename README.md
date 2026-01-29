# QuickInvite

An AI-powered invitation generator and RSVP management application. Create personalized event invitations in seconds and track guest responses with ease.

## Features

- **AI-Generated Invitations** - Enter a brief description and let GPT-4o-mini craft the perfect invitation
- **Multiple Styles** - Choose from Hangout (casual), Meeting (formal), or Party (celebratory) tones
- **Unique Shareable Links** - Each invitation gets a unique URL for guests to RSVP
- **RSVP Tracking** - Guests can respond Yes, No, or Maybe
- **Host Dashboard** - View all responses in real-time with summary statistics

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Frontend:** [React](https://react.dev/) 19
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4
- **Database:** SQLite with [Prisma](https://www.prisma.io/) ORM
- **AI:** [OpenAI API](https://openai.com/api/) (GPT-4o-mini)

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/eshikohli/QuickInvite.git
   cd QuickInvite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Select an invitation style (Hangout, Meeting, or Party)
2. Enter a brief description of your event
3. Click "Generate Invite" to create your invitation
4. Share the guest link with invitees
5. Track RSVPs on your host dashboard

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page - create invitations
│   ├── api/
│   │   ├── invites/route.ts  # Invitation creation endpoint
│   │   └── rsvp/route.ts     # RSVP submission endpoint
│   ├── i/[publicSlug]/       # Guest invitation view
│   └── host/[hostSlug]/      # Host dashboard
└── lib/
    └── prisma.ts             # Prisma client
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Eshi Kohli
