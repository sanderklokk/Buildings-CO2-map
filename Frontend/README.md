# BuildingsCO2Map frontend

The frontend of this project is built using React and TypeScript. The frontend provides the following functionality:

- Interactive map showing estimated materials in buildings in Trondheim.
- Search for a specific address, or whole areas filtered by type of building, material and area.
- Create waste reports for buildings.
- Administrate materials available to be used in waste reports.
- View and search for waste reports.

To ensure all functionality works, also follow the instructions given in the [Backend](../Backend/README.md) README.

## Prerequisites

- Enure node is installed. https://nodejs.org/en/download

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/sanderklokk/Buildings-CO2-map.git
   ```

2. Enter the frontend directory:
   ```bash
   cd Frontend
   ```
3. Install dependencies:
   ```bash
    npm install
   ```

## Run the application

1. Start the frontend application:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:5173/` to view the application.

## Build

1. Build the application:
   ```bash
    npm run build
   ```

## Tests

There are comprehensive component-tests created for the frontend using Vitest covering about 80% of the code. The tests are found in [src/tests](src/tests).

1. Run tests:
   ```bash
   npm run test
   ```
2. View test coverage
   ```bash
   npm run coverage
   ```

## Other relevant information

- The different routes in application are found and defined in the [router](src/pages/Router.tsx) component.
  - The page for creating reports are not accessible from the navigation bar, as it is not a part of the admin functionality. To view this page, open `http://localhost:5173/report/create`
- The application currently uses [localhost:8000](http://localhost:8000/) as the backend. This can be changed in [api/config.ts](src/api/config.ts).
