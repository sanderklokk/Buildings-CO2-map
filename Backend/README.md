# BuildingsCO2Map backend

The frontend of this project is built using Django and python, and uses a PostgreSQL database for storage. The backend provides api and database functionality used by the frontend. The functionality is described in the [Frontend](../Frontend/README.md) README.

## Prerequisites
- Ensure python is installed.
- Ensure docker is installed.

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/sanderklokk/Buildings-CO2-map.git
    ```
2. Enter the backend directory:
   ```bash
   cd Backend
   ```
3. Install dependencies (recommended to use a virtual environment):
   ```bash
    pip install -r requirements.txt
    ```
4. To install the postgres docker image and run the database:
   ```bash
   docker-compose up 
    ```
5. Set up the database tables:
   ```bash
   python manage.py migrate
    ```
6. Ensure starting the server works:
   ```bash
   python manage.py runserver
    ```
7. Stop the server and fill the databse with data:
    - Ensure the data files are located in the `Data` folder in the root directory as `Data/data14.json` and `Data/data15.json`
    - Run:
   ```bash
   python manage.py bootstrapdata
    ```

## Run the application
1. Start the server:
   ```bash
   python manage.py runserver
    ```
2. The api will be available at `http://localhost:8000/`.

## Tests
Tests for the api can be run using:
```bash
python manage.py test
```

## Other relevant information
- Ensure bootstrapdata has been run before running the tests.
- The api endpoints are defined in the `urls.py` file under `App/urls.py`.
- The implementation of the api endpoints are found in `App/views/`folder.
- The connection to the database is defined and can be altered in `Backend/settings.py`.