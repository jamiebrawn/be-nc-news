# Northcoders News API

[Live Demo](https://be-nc-news-ws53.onrender.com)

## Overview

This project is a RESTful API designed to serve up articles, comments, and user information. It provides endpoints for fetching articles, comments, and users, as well as endpoints for adding, updating, and deleting comments. The API also allows users to vote on articles.

## Installation and Setup

To run this project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone <https://github.com/jamiebrawn/be-nc-news.git>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd <be-nc-news>
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Configure Environment**
   - Create `.env` files for test and development, following pattern provided in .env-example and using database names found in `./db/setup.sql`.
   - Ensure `.env` files are included in `.gitignore` (`.env.*` already provided).

5. **Set Up Local Development Database:**

   ```bash
   npm run setup-dbs
   ```

6. **Seed Local Development Database:**

   ```bash
   npm run seed
   ```

7. **Run Tests:**

   ```bash
   npm test
   ```

### Minimum Requirements

- Node.js version: 14.x.x or higher
- PostgreSQL version: 8.0 or higher

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
