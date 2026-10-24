# Event Management System — Backend

A Java Spring Boot backend for the Event Management System. It provides the server-side foundation for processing requests, validating input, interacting with a PostgreSQL database, and applying application security.

**Repository:** [eventmanagement_backend](https://github.com/thejasree25/eventmanagement_backend)

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Backend Workflow](#backend-workflow)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Database Configuration](#database-configuration)
- [OAuth Configuration](#oauth-configuration)
- [Running the Application](#running-the-application)
- [API Testing](#api-testing)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)

## Project Overview

The backend is responsible for receiving HTTP requests from the frontend, processing business logic, interacting with PostgreSQL, and returning responses.

The project uses Spring Boot, Spring Data JPA, Spring Security, request validation, and the PostgreSQL JDBC driver.

### Main Responsibilities

- Process HTTP requests and provide REST API functionality.
- Validate incoming request data where validation is implemented.
- Persist and retrieve application data using JPA.
- Connect to PostgreSQL.
- Apply authentication and authorization rules configured in Spring Security.
- Support event-management workflows implemented by the application.

## Technology Stack

| Technology | Purpose |
|---|---|
| Java 21 | Programming language |
| Spring Boot 3.5.6 | Application framework |
| Spring Web | HTTP endpoints and REST APIs |
| Spring Data JPA | Database access |
| Hibernate | ORM and entity persistence |
| Spring Security | Authentication and authorization |
| Jakarta Bean Validation | Request validation |
| PostgreSQL | Relational database |
| Maven | Dependency management and builds |
| Google API Client | Google API integration dependency |

The configuration file also contains Google and GitHub OAuth registration settings. Verify that the OAuth2 client dependency and corresponding security configuration are present before relying on Spring Security OAuth login.

## Backend Workflow

```text
React frontend
      |
      | HTTP request
      v
Spring Boot application
      |
      v
Spring Security
      |
      v
Controller
      |
      v
Service / business logic
      |
      v
Repository
      |
      v
Spring Data JPA / Hibernate
      |
      v
PostgreSQL database
      |
      v
Response returned to frontend
```

The exact controller, service, and repository flow depends on how each feature is implemented in the source code.

## Project Structure

```text
eventmanagement_backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── ...           # Application packages and Java classes
│   │   └── resources/
│   │       └── application.properties
│   └── test/                 # Automated tests, if present
├── .mvn/
│   └── wrapper/
├── mvnw                      # Maven wrapper for Unix-like systems
├── mvnw.cmd                  # Maven wrapper for Windows
├── pom.xml                   # Maven dependencies and build settings
├── .gitignore
└── README.md
```

## Prerequisites

Install the following:

- JDK 21
- PostgreSQL
- Git
- An IDE such as IntelliJ IDEA, Eclipse, or VS Code
- Postman or another API testing tool

## Installation and Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/thejasree25/eventmanagement_backend.git
cd eventmanagement_backend
```

### Step 2: Create the PostgreSQL database

Open PostgreSQL or pgAdmin and execute:

```sql
CREATE DATABASE event_management;
```

The database name must match the configured JDBC URL.

### Step 3: Configure application properties

Open:

```text
src/main/resources/application.properties
```

The committed configuration uses placeholders for credentials. Replace them locally with valid configuration or use environment-variable placeholders.

For example:

```properties
spring.application.name=eventmanagement
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/event_management
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

Set `DB_USERNAME` and `DB_PASSWORD` in your local environment or IDE run configuration before starting the application.

Keep the other required properties from the existing configuration file, including OAuth settings, if the corresponding features are being used.

### Step 4: Configure OAuth credentials if needed

For Google and GitHub login, obtain the appropriate credentials from the respective developer consoles and configure them locally.

Do not commit actual OAuth client secrets. Use environment variables, for example:

```properties
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}

spring.security.oauth2.client.registration.github.client-id=${GITHUB_CLIENT_ID}
spring.security.oauth2.client.registration.github.client-secret=${GITHUB_CLIENT_SECRET}
```

The required redirect URLs and provider settings must match the application's Spring Security configuration.

### Step 5: Build the application

On Windows:

```cmd
mvnw.cmd clean install
```

On macOS or Linux:

```bash
./mvnw clean install
```

If the Maven wrapper cannot run, install Maven and use:

```bash
mvn clean install
```

### Step 6: Start the backend

On Windows:

```cmd
mvnw.cmd spring-boot:run
```

On macOS or Linux:

```bash
./mvnw spring-boot:run
```

The configured application port is:

```text
http://localhost:8080
```

This is the server address, not necessarily a browser page. Use the actual API endpoints declared in the controllers.

## Database Configuration

The application is configured for PostgreSQL with:

```text
Database: event_management
Host: localhost
Port: 5432
```

JPA uses Hibernate to map Java entities to database tables. The configured `spring.jpa.hibernate.ddl-auto=update` setting allows Hibernate to update the schema based on entity changes.

For production, use a controlled database migration process and review schema changes before deployment.

## OAuth Configuration

The configuration contains Google and GitHub OAuth registration properties.

Before enabling these providers:

1. Configure valid client IDs and client secrets.
2. Verify the OAuth2 client dependency is present in `pom.xml`.
3. Verify the Spring Security login configuration.
4. Register the required redirect URLs with each provider.
5. Test successful login, login failure, and logout behavior.

A property entry alone does not implement an OAuth login flow; the required dependencies and security configuration must also be present.

## API Testing

Use Postman or another HTTP client to test endpoints defined by the backend.

For each endpoint, document:

- HTTP method and URL
- Required headers
- Request body
- Authentication requirements
- Expected response and status code

Refer to the controller classes in `src/main/java` for the authoritative list of available endpoints.

The backend is intended to be consumed by the separate React frontend repository.

## Troubleshooting

**Database connection failed**

- Confirm PostgreSQL is running.
- Check the database name, username, password, host, and port.
- Verify that the PostgreSQL driver is available.

**Application does not start**

- Confirm JDK 21 is installed.
- Check the terminal output for dependency or configuration errors.
- Run `mvnw.cmd clean install` on Windows.

**401 Unauthorized or 403 Forbidden**

- Check the endpoint's security rules.
- Verify the authentication method and credentials.
- Check required roles and authorities.

**OAuth login fails**

- Confirm the OAuth2 client dependency and security configuration.
- Verify provider credentials and redirect URLs.
- Check the backend logs for authentication errors.

**Frontend cannot access the backend**

- Confirm the backend is running on port 8080.
- Verify the frontend API base URL.
- Check CORS configuration and endpoint paths.

## Security Notes

- Never commit real OAuth client secrets, database passwords, API keys, or JWT signing secrets.
- Use environment variables or a secret manager for credentials.
- Rotate credentials that have been exposed.
- Avoid exposing stack traces and sensitive error details in production.
- Configure appropriate authentication, authorization, and CORS policies before deployment.
- Use HTTPS for production deployments.

## Author

**Thejasree Ganginepalli**

- GitHub: [thejasree25](https://github.com/thejasree25)

