# Playlist Roulette

A full-stack web application that randomizes Spotify playlists using a proper Fisher-Yates shuffle algorithm. Built with **React**, **TypeScript**, and **Node.js**.

https://github.com/user-attachments/assets/bf83738a-ec7e-4de9-b655-8231f4f94fd3

## Features

- **Secure Spotify OAuth** - Complete authentication flow with state validation
- **True Randomization** - Fisher-Yates shuffle algorithm for unbiased track ordering  
- **Batch Processing** - Handles large playlists efficiently with progress tracking
- **Real-time Updates** - Live playlist modification through Spotify Web API
- **Responsive Design** - Modern UI with Tailwind CSS and smooth animations
- **Error Handling** - Comprehensive error states and user feedback

## Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling  
- **Vite** for build tooling
- Custom hooks for state management
- Component-based architecture

### Backend
- **Node.js** with Express
- **Cookie-based sessions** with cleanup
- **CORS** configuration for secure cross-origin requests

### APIs & Integration
- **Spotify Web API** for playlist management
- **OAuth 2.0** for secure authentication
- **REST API** design patterns

## Key Implementation Details

- **Fisher-Yates Algorithm**: Ensures statistically unbiased shuffling
- **Pagination Handling**: Fetches all tracks from large playlists (100+ songs)
- **Rate Limit Management**: Batch operations to respect Spotify API limits
- **Session Management**: Secure token storage with automatic cleanup

## Setup

1. Create a Spotify app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Set environment variables for client credentials
3. Install dependencies: `npm install` (both frontend and backend)
4. Run development servers: `npm run dev`

## Deployment

- **Frontend**: Vercel (optimized for React/Vite)
- **Backend**: Railway (persistent server for session storage)

---

> **⚠️ Important**: This application modifies Spotify playlists permanently. Users are advised to create backups before shuffling.
