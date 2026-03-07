# Rechap

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Rechap is a real-time chat application inspired by the Discord frontend. This was built as an educational project to learn about WebSockets and real-time bi-directional communication using `socket.io`.

## Features

- **Real-time Messaging:** Enabled by Socket.io for instantaneous communication, with a fallback to polling.
- **Channels and rooms:** Create and manage channels with specialized rooms.
- **Role Management:** Admin, Moderator, and Guest roles with varying permissions.
- **Room Types:** Categorize rooms for specific use-cases (Text, Audio, Video).
- **Direct Messaging:** 1-on-1 private conversations between members.
- **File Uploads:** Support for sharing files and images within chats.
- **Modern UI:** Responsive, fully-featured user interface inspired by Discord.

## Environment Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Prisma Database
DATABASE_URL=

# UploadThing
UPLOADTHING_TOKEN=
UPLOADTHING_SECRET_KEY=

# LiveKit
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```

## Project Structure

A quick overview of the essential directories:

- `/app` - Next.js App Router pages and API routes (including Socket.io and LiveKit endpoints).
- `/components` - Modular React components, including UI and specialized parts like chat, modals, and settings.
- `/hooks` - Custom React hooks for modals and real-time state management (using Zustand).
- `/lib` - Core utilities, current profile fetching, db instance, etc.
- `/prisma` - Prisma schema definitions for the Postgres database models (Users, Channels, Messages, etc.).

## Schema

### Models

#### User

| Field      | Type   | Description        |
| :--------- | :----- | :----------------- |
| `id`       | String | Primary Key (UUID) |
| `userId`   | String | Unique             |
| `name`     | String |                    |
| `imageUrl` | String | Text               |
| `email`    | String | Text               |

#### Channel

| Field        | Type   | Description        |
| :----------- | :----- | :----------------- |
| `id`         | String | Primary Key (UUID) |
| `name`       | String |                    |
| `imageUrl`   | String | Text               |
| `inviteCode` | String | Unique             |
| `userId`     | String | Foreign Key (User) |

#### Member

| Field       | Type       | Description           |
| :---------- | :--------- | :-------------------- |
| `id`        | String     | Primary Key (UUID)    |
| `role`      | MemberRole | Default: GUEST        |
| `userId`    | String     | Foreign Key (User)    |
| `channelId` | String     | Foreign Key (Channel) |

#### Room

| Field       | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `id`        | String   | Primary Key (UUID)    |
| `name`      | String   |                       |
| `type`      | RoomType | Default: TEXT         |
| `userId`    | String   | Foreign Key (User)    |
| `channelId` | String   | Foreign Key (Channel) |

#### Message

| Field      | Type    | Description          |
| :--------- | :------ | :------------------- |
| `id`       | String  | Primary Key (UUID)   |
| `content`  | String  | Text                 |
| `fileUrl`  | String  | Text                 |
| `deleted`  | Boolean | Default: false       |
| `memberId` | String  | Foreign Key (Member) |
| `roomId`   | String  | Foreign Key (Room)   |

#### Conversation

| Field         | Type   | Description          |
| :------------ | :----- | :------------------- |
| `id`          | String | Primary Key (UUID)   |
| `memberOneId` | String | Foreign Key (Member) |
| `memberTwoId` | String | Foreign Key (Member) |

#### DirectMessage

| Field            | Type    | Description                |
| :--------------- | :------ | :------------------------- |
| `id`             | String  | Primary Key (UUID)         |
| `content`        | String  | Text                       |
| `fileUrl`        | String? | Text                       |
| `deleted`        | Boolean | Default: false             |
| `memberId`       | String  | Foreign Key (Member)       |
| `conversationId` | String  | Foreign Key (Conversation) |

### Enums

- **MemberRole**: `ADMIN`, `MODERATOR`, `GUEST`
- **RoomType**: `TEXT`, `AUDIO`, `VIDEO`

## To-Do

The following features and rooms are planned in the roadmap:

- [x] Audio Room
- [x] Video Room
- [x] Direct Messages
- [ ] Streaming Room
- [ ] migrate away from LiveKit and build native audio/video room implementation

## Acknowledgments

A huge thank you to the creators and maintainers of the incredible open-source libraries and frameworks that made this project possible:

- **Frameworks & Core:** Next.js, React, TypeScript
- **Real-time:** Socket.io
- **Video & Audio Rooms:** LiveKit
- **Database & ORM:** Prisma, PostgreSQL
- **Styling & UI Components:** Tailwind CSS, Radix UI, shadcn/ui, Lucide Icons
- **Forms & Validation:** React Hook Form, Zod
- **File Uploads:** UploadThing
- **Authentication:** Clerk
- **Others:** Emoji Mart, date-fns

---

> **Note:** This is an educational project created for learning purposes.
