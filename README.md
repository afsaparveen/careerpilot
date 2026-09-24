# CareerPilot

CareerPilot is a web-based career development platform designed to help students and job seekers manage their learning, practice technical skills, track progress, and prepare for career opportunities from a single platform.

## Project Overview

CareerPilot provides a centralized environment for students to organize their career preparation activities. The platform combines learning resources, coding practice, progress tracking, career-related tools, and user authentication into a single web application.

The system is designed with a responsive frontend and a cloud-connected backend to provide a personalized learning experience.

## Objectives

* Provide a centralized platform for career preparation.
* Help users organize and track their learning activities.
* Provide technical learning and coding practice resources.
* Track user progress and study activity.
* Provide personalized career-oriented features.
* Maintain user data securely using authentication and database services.
* Provide a responsive and user-friendly interface.

## Key Features

### User Authentication

* User registration and login.
* Authentication using Firebase Authentication.
* User-specific data management.
* Protected application features for authenticated users.

### Learning Management

* Structured learning content.
* Chapter-based learning resources.
* Learning progress tracking.
* Study activity tracking.
* Daily learning activity management.

### DSA and Coding Practice

* Data Structures and Algorithms practice.
* Coding problem tracking.
* Daily problem-solving activity.
* DSA progress monitoring.
* Streak calculation based on study and problem-solving activities.

### Progress Tracking

CareerPilot tracks different types of user activity, including:

* Study dates
* Activity dates
* Daily DSA problem dates
* Learning progress
* Coding practice progress
* Study streaks

The system combines these activities to calculate the user's learning streak and overall progress.

### Study Streak

The application maintains a study streak by analyzing user activity from multiple sources such as:

```text
studyDates
activityDates
dsaProgress.dailyProblemDates
```

A `Set` is used to avoid duplicate dates while calculating consecutive study activity.

### Responsive UI

The frontend is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile devices

## Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* React.js

### Backend and Cloud Services

* Firebase
* Firebase Authentication
* Cloud Firestore
* Firebase Storage

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Node.js
* npm

## Firebase Integration

CareerPilot uses Firebase for backend and cloud functionality.

### Firebase Authentication

Used for:

* User registration
* User login
* User authentication
* User session management

### Cloud Firestore

Used to store application data such as:

* User profiles
* Learning progress
* DSA progress
* Study activity
* Career-related information

### Firebase Storage

Used for storing and managing application files and user-related resources where required.

Firebase Storage security rules are maintained in:

```text
storage.rules
```

## Project Structure

A simplified structure of the project is:

```text
careerpilot-ai/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   └── ...
│
├── index.html
├── package.json
├── storage.rules
├── firebase configuration
└── README.md
```

The exact folder structure may vary depending on the current implementation.

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/afsaparveen/careerpilot.git
```

### 2. Navigate to the Project

```bash
cd careerpilot
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Firebase

Create and configure your Firebase project and connect the application to Firebase.

Configure the required Firebase services:

* Authentication
* Firestore Database
* Storage

### 5. Start the Development Server

```bash
npm run dev
```

The application will then be available through the local development server URL displayed in the terminal.

## Application Workflow

```text
User
  |
  v
Authentication
  |
  v
CareerPilot Dashboard
  |
  +-- Learning
  |
  +-- DSA Practice
  |
  +-- Progress Tracking
  |
  +-- Study Activity
  |
  +-- Career Preparation
          |
          v
   Firebase Services
          |
          +-- Authentication
          +-- Firestore
          +-- Storage
```

## Technical Implementation

### Activity Tracking

The application collects activity dates from multiple parts of the system and combines them to determine study activity.

Example data sources:

```javascript
studyDates
activityDates
dsaProgress.dailyProblemDates
```

A `Set` can be used to store unique dates:

```javascript
const studyDates = new Set();
```

This prevents duplicate activity dates from affecting streak calculations.

### Progress Management

User progress is maintained based on learning and coding activities. The system can use stored progress information to display:

* Completed learning content
* Coding activity
* Daily activity
* Learning streak
* Overall progress

## Security

The application uses Firebase security mechanisms to protect user data.

Security considerations include:

* Firebase Authentication for identity management.
* Firestore security rules for database access.
* Firebase Storage rules for file access.
* User-specific data access.
* Client-side validation combined with backend security rules.

Sensitive credentials and private configuration values should not be committed to the Git repository.

## Future Enhancements

Possible future improvements include:

* AI-powered career recommendations.
* AI resume analysis.
* Personalized learning paths.
* Job recommendation system.
* Interview preparation assistant.
* AI-powered coding assistance.
* Skill-gap analysis.
* Progress analytics dashboard.
* Leaderboards and gamification.
* Notification and reminder system.
* Integration with job platforms.
* Mobile application.
* Advanced career analytics.

## Development

CareerPilot is developed as a continuously evolving project. New learning modules, technical features, tracking mechanisms, and career-oriented functionality can be integrated as the platform grows.

## License

This project is developed for educational and career-development purposes.

## Author

**Afsa Parveen A**

Computer Science and Engineering

CareerPilot Project
