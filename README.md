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

- **Real-time Messaging:** Enabled by Socket.io for instantaneous communication.
- **Channels and rooms:** Create and manage channels with specialized rooms.
- **Role Management:** Admin, Moderator, and Guest roles with varying permissions.
- **Room Types:** Categorize rooms for specific use-cases (Text, Audio, Video).
- **Direct Messaging:** 1-on-1 private conversations between members.
- **File Uploads:** Support for sharing files and images within chats.
- **Modern UI:** Responsive, fully-featured user interface inspired by Discord.

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
- **Database & ORM:** Prisma, PostgreSQL
- **Styling & UI Components:** Tailwind CSS, Radix UI, shadcn/ui, Lucide Icons
- **State Management & Utilities:** Zustand, React Query (@tanstack)
- **Forms & Validation:** React Hook Form, Zod
- **File Uploads:** UploadThing
- **Authentication:** Clerk
- **Others:** Emoji Mart, date-fns

---

> **Note:** This is an educational project created for learning purposes.
