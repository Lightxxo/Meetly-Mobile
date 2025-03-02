
# Meetup Clone

This project is a personal endeavor to replicate the core functionalities of Meetup.com, a platform that enables users to create and join events, and connect with individuals sharing similar interests.

## Features

- **User Authentication**: Users can register, log in, and manage their profiles.
- **Event Management**: Users can create, edit, and delete events within their groups.
- **RSVP Functionality**: Users can RSVP to events and view attendee lists.
- **Search**: Users can search for groups and events based on interests and location.

## Technology Stack

- **Frontend**:
  - React.js for building the user interface.
  - Tailwind CSS for styling.
- **Backend**:
  - Node.js with Express.js for server-side development.
  - PostgreSQL + Sequelize for database management.
- **Authentication**:
  - JWT (JSON Web Tokens) for secure user authentication and authorization.


## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/meetly.git
   ```
2. **Install Dependencies**:
   ```bash
   cd meetly
   npm i
   cd server
   npm i
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the necessary environment variables. Setup PostgreSQL server accordingly.
4. **Run the Application**:
   ```bash
   npm run dev
   ```
5. **Run the Server**:
   ```bash
   cd server
   nodemon
   ```

## Contributing

Contributions are welcome. Please fork the repository, create a new branch, and submit a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License.

## Acknowledgments

Inspired by the features and functionalities of Meetup.com.

For more information about Meetup.com, visit their [official website](https://www.meetup.com).
