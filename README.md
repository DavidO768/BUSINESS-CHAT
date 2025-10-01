# Gabstep Business Chat 💬

A fully-featured, real-time business communication web application built with React, Supabase, and Framer Motion.

![Made with React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-green?logo=supabase)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.23-purple)

## ✨ Features

### 🎨 User Experience
- **3-Second Preloader Animation** - Stunning Gabstep logo with pulsating motion, particle effects, and liquid glass effect
- **Dark/Light Mode Toggle** - Deep green theme with liquid glass translucency throughout
- **Responsive Design** - Mobile-friendly with sidebar navigation
- **Smooth Animations** - Powered by Framer Motion for fluid transitions

### 🔐 Authentication
- **Email/Password Sign Up & Sign In**
- **Profile Picture Upload** during registration
- **Admin Detection** - Special admin privileges when username is "admin" with passcode "Gabstep@768"

### 💬 Chat Functionality
- **Real-time Messaging** - Instant message delivery via Supabase Realtime
- **Typing Indicators** - See when other users are typing
- **Message Actions**:
  - Edit your own messages
  - Delete your own messages
  - Slide-to-reply gesture (like WhatsApp)
- **File & Photo Uploads**:
  - Photos displayed inline with lightbox viewer
  - Files shown as downloadable icons
  - Zoom in/out functionality for images

### 👑 Admin Features
- **Mute All Chat** - Prevent all non-admin users from sending messages
- **Per-User Controls**:
  - Mute individual users
  - Block users from the application
  - Send direct messages to any user
- **User Management Sidebar** - View all active users with profile pictures

### 👤 Profile Management
- **Update Display Name**
- **Change Profile Picture**
- **Update Password**
- **Theme Preferences** saved locally

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gabstep-business-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the schema from `SUPABASE_SETUP.md`
   - Enable Realtime for `profiles`, `messages`, and `chat_settings` tables

4. **Configure environment variables**
   
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
gabstep-business-chat/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── PreLoader.jsx    # 3s animated preloader
│   │   ├── ChatHeader.jsx   # Main chat header
│   │   ├── ChatSidebar.jsx  # User list sidebar
│   │   ├── MessageList.jsx  # Message container
│   │   ├── Message.jsx      # Individual message component
│   │   ├── MessageInput.jsx # Message input with file upload
│   │   └── Lightbox.jsx     # Image viewer
│   ├── pages/               # Page components
│   │   ├── SignIn.jsx       # Sign in page
│   │   ├── SignUp.jsx       # Sign up page
│   │   ├── Chat.jsx         # Main chat interface
│   │   └── Profile.jsx      # Profile settings
│   ├── context/             # React Context providers
│   │   ├── AuthContext.jsx  # Authentication state
│   │   ├── ChatContext.jsx  # Chat & messaging state
│   │   └── ThemeContext.jsx # Theme state
│   ├── lib/
│   │   └── supabase.js      # Supabase client config
│   ├── App.jsx              # Main app with routing
│   └── main.jsx             # Entry point
├── SUPABASE_SETUP.md        # Database schema & setup
├── .env.example             # Environment variables template
└── package.json
```

## 🎯 Usage

### Creating an Admin Account
1. Go to Sign Up
2. Enter username: `admin`
3. Fill in email and password
4. Upload a profile picture
5. An additional "Admin Passcode" field will appear
6. Enter: `Gabstep@768`
7. Sign up to create admin account

### Admin Capabilities
- Click the hamburger menu to open user sidebar
- Click "Mute Chat" to disable messaging for all non-admins
- Click on any user to see options:
  - **Mute** - Prevent that user from sending messages
  - **Block** - Remove user from chat entirely
  - **Send DM** - Direct message to that user

### Regular User Features
- Sign up and sign in with email/password
- Upload a profile picture
- Send text messages, photos, and files
- Reply to messages with slide gesture
- Edit/delete your own messages
- Toggle dark/light mode
- Update your profile

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.3
- **Database & Auth**: Supabase 12.3.0
- **Animations**: Framer Motion 12.23.22
- **Icons**: Lucide React 0.544.0
- **Styling**: CSS with liquid glass effects

## 🔒 Security Features

- Row Level Security (RLS) policies in Supabase
- Secure password hashing via Supabase Auth
- Admin passcode validation
- Environment variables for sensitive data
- File upload validation

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-optimized sidebar
- Touch-friendly message interactions
- Adaptive layouts for all screen sizes
- Mobile gesture support (slide-to-reply)

## 🎨 Design Features

- **Deep Green Theme** (#047857) with white background
- **Liquid Glass Effect** - Translucent, blurred backgrounds throughout
- **Smooth Transitions** - All interactions animated
- **Particle Effects** - Dynamic data flow visualization
- **Modern UI** - Clean, minimalist interface

## 🚧 Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |

## 🤝 Contributing

This project was built for Gabstep Business Chat. For contributions or issues, please contact the development team.

## 📄 License

© 2025 Gabstep Business Chat. All rights reserved.

## 🎉 Acknowledgments

- Built with ❤️ using React and Supabase
- Animated with Framer Motion
- Icons by Lucide
- Design inspired by modern business communication tools

---

**Current Status**: ✅ Fully functional and deployed

**Version**: 1.0.0

**Last Updated**: January 2025
