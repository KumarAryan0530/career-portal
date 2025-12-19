# CareerPortal - Professional Job Portal Application

A modern, professional Career Portal web application built with React and Firebase, featuring a beautiful red and white skeuomorphic UI design.

![CareerPortal](https://img.shields.io/badge/React-18.2.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

### For Candidates
- **Job Search & Discovery** - Browse and search jobs with filters (location, type, experience level)
- **One-Click Apply** - Apply to jobs instantly with your saved profile
- **Resume Upload** - Securely upload and manage your resume in the cloud
- **Application Tracking** - Monitor status of all your applications in real-time
- **Profile Management** - Build your professional profile with skills and experience

### For Recruiters
- **Job Posting** - Create and manage unlimited job listings
- **Applicant Management** - Review applications with status workflow
- **Resume Access** - Download and review candidate resumes
- **Hiring Pipeline** - Track candidates through interview stages
- **Company Profile** - Showcase your company to attract top talent

### Technical Features
- 🔐 **Firebase Authentication** - Secure email/password authentication with role-based access
- ☁️ **Cloud Storage** - Resume and document storage with Firebase Storage
- 🔥 **Real-time Database** - Firestore for instant data synchronization
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Skeuomorphic UI** - Beautiful red and white themed interface with depth and shadows

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router 6
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Styling**: CSS with skeuomorphic design principles
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Deployment**: Netlify

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/career-portal.git
   cd career-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Email/Password authentication
   - Create a Firestore database
   - Enable Firebase Storage
   - Deploy the security rules:
     ```bash
     firebase deploy --only firestore:rules
     firebase deploy --only storage:rules
     ```

5. **Start the development server**
   ```bash
   npm start
   ```

## 🚀 Deployment to Netlify

### Option 1: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod
```

### Option 2: GitHub Integration
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Environment Variables on Netlify
Add these environment variables in your Netlify dashboard:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

## 📁 Project Structure

```
career-portal/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── _redirects
├── src/
│   ├── components/
│   │   ├── auth/           # Login, Signup, ProtectedRoute
│   │   ├── candidate/      # Candidate-specific components
│   │   ├── recruiter/      # Recruiter-specific components
│   │   ├── layout/         # Header, Footer, Layout
│   │   └── shared/         # Reusable UI components
│   ├── config/
│   │   └── firebase.js     # Firebase configuration
│   ├── contexts/
│   │   └── AuthContext.js  # Authentication context
│   ├── hooks/
│   │   ├── useApplications.js
│   │   ├── useJobs.js
│   │   └── useResumeUpload.js
│   ├── pages/
│   │   └── Home.js         # Landing page
│   ├── styles/
│   │   ├── globals.css
│   │   └── components/     # Component-specific styles
│   ├── App.js
│   └── index.js
├── firestore.rules
├── storage.rules
├── netlify.toml
├── package.json
└── README.md
```

## 🎨 Design System

### Colors
- **Primary Red**: `#C41E3A`
- **Primary Dark**: `#A01830`
- **Background**: `#F5F5F5`
- **Card Background**: `#FFFFFF`
- **Text Primary**: `#2D2D2D`
- **Text Secondary**: `#666666`

### Components
The app uses a skeuomorphic design language with:
- Paper-like cards with subtle shadows
- Raised buttons with press animations
- Soft gradients and depth
- Folder/document metaphors

## 🔒 Security

### Firestore Rules
- Users can only access their own data
- Recruiters can view candidate profiles for applications
- Only recruiters can create/manage jobs
- Applications are protected by ownership

### Storage Rules
- Resume uploads limited to PDF, DOC, DOCX (5MB max)
- Users can only upload to their own folders
- Recruiters can view resumes for review

## 📜 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (not recommended)
npm run eject
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Netlify](https://www.netlify.com/)
- [React Hot Toast](https://react-hot-toast.com/)
- [date-fns](https://date-fns.org/)

---

Made with ❤️ by Kumar Aryan
