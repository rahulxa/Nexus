# NEXUS - Video Conferencing Platform

## Overview

NEXUS is a cutting-edge video conferencing platform, engineered to deliver seamless real-time video and audio communication. Built with **WebRTC** for high-quality peer-to-peer streaming and **Socket.io** for real-time event handling, NEXUS offers a fluid user experience for hosting or joining video calls. Designed for flexibility, security, and ease of use, this platform provides a clean, modern interface while handling multiple participants with an optimized layout. NEXUS stands out with its dynamic meeting management, quick setup for users, and customizable features that ensure a reliable conferencing solution.

## Technologies Used

### Backend:

- **Node.js**
- **Express**
- **MongoDB**
- **Socket.io** (for real-time communication)
- **JWT** (for secure authentication)

### Frontend:

- **React.js**
- **WebRTC** (for video/audio streams)
- **Socket.io** (for real-time communication)
- **Tailwind CSS** (for responsive UI design)
- **Magic UI** ((for a modern UI experience))
- **Framer Motion** (for smooth animations)

## Features

### Backend

- **Real-time Video and Audio Communication**: Utilizes WebRTC and Socket.io to enable seamless peer-to-peer video and audio streams.
- **User Authentication and Authorization**: Secure login system using JWT tokens, ensuring safe access and personalized user sessions.
- **Meeting Management**: Dynamic API routes for creating, joining, and terminating meetings. All meetings are linked with unique IDs to ensure secure, individual sessions.
- **Socket-based Event Handling**: Real-time video call events, including user join/leave notifications and message broadcasting, efficiently handled by Socket.io.
- **Persistent Data with MongoDB**: Stores meeting history, users, and timestamps to provide a reliable backend for managing and tracking meetings.

### Frontend

- **Join or Create Meeting Interface**: Intuitive and minimalist UI allowing users to either create a new meeting or join an existing one by entering a unique meeting ID.
- **Dynamic Video Layout**: Implemented an adaptive grid layout to adjust video tiles automatically, ensuring smooth resizing as participants join or leave.
- **Real-time Messaging**: Chat functionality alongside video streams, allowing for quick text-based communication between participants.
- **User Management**: Real-time display of participants, showing who is connected at any given moment, powered by Socket.io.
- **Responsive Design with Tailwind CSS**: Ensures that the platform is fully functional across devices, offering a smooth experience whether on mobile or desktop.
- **Custom Animations with Framer Motion**: Enhanced user experience through smooth transitions and animations, adding a polished feel to interactions.


## Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/your-username/Nexus.git
    ```

2. **Navigate to the Project Directory:**

    ```bash
    cd Nexus
    ```

3. **Backend Setup:**

    Navigate to the backend directory:

    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file and add your environment variables (refer to `.env.sample` for guidance). Then, start the backend server:

    ```bash
    npm run dev
    ```

4. **Frontend Setup:**

    Navigate to the frontend directory:

    ```bash
    cd ../frontend
    npm install
    ```

    Create a `.env` file with the necessary environment variables (refer to `.env.sample`), then start the development server:

    ```bash
    npm run dev
    ```
