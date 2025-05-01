# TechShethra Backend API

This is the backend API for the TechShethra technical symposium website. It provides endpoints for managing events, schedules, registrations, speakers, sponsors, and contact submissions.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Token (JWT) for authentication
- bcrypt for password hashing
- Joi for validation

## Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/techshethra
   JWT_SECRET=your_jwt_secret_key_should_be_long_and_complex
   NODE_ENV=development
   ```

## Running the Application

To start the development server:
```
npm run dev
```

To start the production server:
```
npm start
```

## Database Seeding

To seed the database with sample data:
```
npm run seed
```

To clear all data from the database:
```
npm run seed:clear
```

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

### Schedule
- `GET /api/schedule` - Get the full schedule
- `GET /api/schedule/day/:day` - Get schedule for a specific day
- `GET /api/schedule/event/:eventId` - Get schedule for a specific event
- `POST /api/schedule` - Create a new schedule item
- `PUT /api/schedule/:id` - Update a schedule item
- `DELETE /api/schedule/:id` - Delete a schedule item

### Registration
- `GET /api/registration` - Get all registrations
- `GET /api/registration/event/:eventId` - Get registrations for a specific event
- `POST /api/registration` - Create a new registration
- `GET /api/registration/:id` - Get a specific registration
- `PUT /api/registration/:id` - Update registration status
- `DELETE /api/registration/:id` - Delete a registration

### Speakers
- `GET /api/speakers` - Get all speakers
- `GET /api/speakers/featured` - Get featured speakers
- `GET /api/speakers/:id` - Get a specific speaker
- `POST /api/speakers` - Create a new speaker
- `PUT /api/speakers/:id` - Update a speaker
- `DELETE /api/speakers/:id` - Delete a speaker

### Sponsors
- `GET /api/sponsors` - Get all sponsors
- `GET /api/sponsors/tier/:tier` - Get sponsors by tier
- `GET /api/sponsors/:id` - Get a specific sponsor
- `POST /api/sponsors` - Create a new sponsor
- `PUT /api/sponsors/:id` - Update a sponsor
- `DELETE /api/sponsors/:id` - Delete a sponsor

### Contact
- `POST /api/contact` - Submit a contact form
- `GET /api/contact` - Get all contact submissions
- `GET /api/contact/:id` - Get a specific contact submission
- `PUT /api/contact/:id` - Update contact submission status
- `DELETE /api/contact/:id` - Delete a contact submission 