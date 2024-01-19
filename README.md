## Introduction

The Post-it App is a collaborative brainstorming web application designed to empower individuals and teams to express and develop ideas in an anonymous yet cooperative environment. It offers features like hosting and joining brainstorming sessions, easy sign-in options, and a user-friendly interface.

## Features

- **User Authentication:** Sign in using Google or GitHub accounts.
- **Role-based Access:** Different functionalities for hosts and clients.
- **Dynamic Routing:** Utilizing React Router for seamless navigation.
- **Real-time Updates:** Powered by Firebase for real-time data handling.
- **User Interaction:** Smooth scroll and interactive design elements.

## Technologies Used

- **React:** For building the user interface.
- **Firebase:** For authentication and real-time database.
- **React Router:** For handling routing.
- **Vercel Analytics:** For tracking and analytics.
- **CSS:** For styling.

## Installation

1. Clone the repository:
   ```
   git clone [repository-link]
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the application:
   ```
   npm start
   ```

## Usage

After starting the app, users can sign in using their Google or GitHub accounts. Depending on the role (host or client), users can either create a session to brainstorm ideas or join an existing session.

## Components

- **AuthHandler:** Manages user authentication state.
- **SignIn:** Component for user sign-in.
- **SignOutButton:** Allows users to sign out.
- **Home:** The landing page for authenticated users.
- **Host/Client:** Role-specific components for different functionalities.

## Resources

- **Database Schema:** [View Database Schema](https://post-it-woad.vercel.app/resources/database)
- **Presentation Material:** [View Presentation Material](https://post-it-woad.vercel.app/resources/presentation)
- **ER Diagram:** [View ER Diagram](https://www.figma.com/file/nbQ8V95fEHM0QtgGRi1KlJ/ER-diagram?type=whiteboard&t=ril984dVMA7gEAl8-6)

## Contributing

Contributions to improve the Post-it App are welcome. Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT license

---

*Created by Lucas Bateson, Max T.Aarre, Nicklas F.Hagen & Ines Touiti.*
