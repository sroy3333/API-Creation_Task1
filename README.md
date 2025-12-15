Task 1 – Event API (Backend)

Overview

This project implements the Event API as specified in the provided task documentation.

* Backend-only API (no frontend required)
* APIs are tested using Postman
* Built using Node.js, Express, and MongoDB Native Driver
* No Mongoose and no fixed schemas are used
* MongoDB _id (ObjectId) is used as the unique identifier for events

Tech Stack

Node.js
* Express.js
* MongoDB (Native mongodb driver)
* Multer (for image/file upload)
* Postman (for API testing)

 Design Constraints (As Per Task)

* Mongoose is NOT used
* No schema definitions
* Flexible, schema-less data storage
* Ability to add/remove fields freely
* Query/search using any field

Project Setup

Install Dependencies

npm init -y
npm install express mongodb multer dotenv

Environment Variables

Create a .env file:

env
MONGO_URI=<your_mongodb_connection_string>
DB_NAME=event_app

Start the Server

node app.js

Expected output:

MongoDB connected
Server running on port 3000

Base URL
http://localhost:3000/api/v3/app

API Endpoints

Get Event by ID

GET /events?id=:event_id

Example:
GET http://localhost:3000/api/v3/app/events?id=65a8f6c1d8c8f8e9c9b12345

Get Latest Events (Paginated)
GET /events?type=latest&limit=5&page=1

Create Event

POST /events

Body Type: form-data

Fields:

* uid (number)
* name (string)
* tagline (string)
* schedule (ISO date-time)
* description (string)
* moderator (string)
* category (string)
* sub_category (string)
* rigor_rank (number)
* attendees (JSON array of user IDs)
* image (file upload)

Response:

json
{
  "event_id": "<MongoDB_ObjectId>"
}

Update Event

PUT /events/:id

* Accepts same payload as POST
* Updates only provided fields

Delete Event
DELETE /events/:id


API Testing

* All APIs are tested using Postman
* No browser or frontend testing is required

Event Data Model (Logical, Not Enforced)

json
{
  "type": "event",
  "uid": 18,
  "name": "Tech Meetup",
  "tagline": "Learn & Network",
  "schedule": "2025-01-20T10:00:00Z",
  "description": "Backend-focused meetup",
  "files": { "image": "uploads/123.png" },
  "moderator": "John Doe",
  "category": "Technology",
  "sub_category": "Backend",
  "rigor_rank": 5,
  "attendees": [1, 2, 3]
}

This is not a schema, only a reference structure.

Task Compliance Checklist

* MongoDB Native Driver used
* No Mongoose
* No fixed schemas
* _id used as unique identifier
* APIs implemented exactly as per documentation
* Tested via Postman

Notes

* Database structure is flexible and can evolve
* The API design intentionally avoids schema restrictions
* This implementation strictly follows the provided task instructions

End of Task 1 Documentation
