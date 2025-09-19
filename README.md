# SkyBox Design Management System

A comprehensive web application for managing cardboard box manufacturing designs exported from ArtiosCAD. This system provides a Docker-based solution with a PostgreSQL database, Node.js backend API, and React frontend for browsing, searching, and analyzing design data.

## Features

- **Design Management**: Import and organize ArtiosCAD design files
- **Database Storage**: PostgreSQL database with structured schema for design data
- **Web Interface**: Modern React frontend with responsive design
- **Search & Filter**: Advanced search capabilities across designs
- **Statistics Dashboard**: Overview of design library and usage statistics
- **File Management**: Track ARD, PDF, and TXT files for each design

## Architecture

- **Frontend**: React 18 with modern UI components
- **Backend**: Node.js/Express API server
- **Database**: PostgreSQL 15 with structured schema
- **Containerization**: Docker Compose for easy deployment

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git (for cloning the repository)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd SkyBox
   ```

2. **Start the application**:
   ```bash
   docker-compose up -d
   ```

3. **Import design data**:
   ```bash
   docker-compose exec backend npm run import
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Manual Setup (Development)

If you prefer to run components separately:

1. **Database Setup**:
   ```bash
   # Start PostgreSQL
   docker-compose up postgres -d
   
   # Or install PostgreSQL locally and run init.sql
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Database Schema

The system uses a structured PostgreSQL schema with the following main tables:

- **designs**: Core design information (ID, dates, designer, etc.)
- **dimensions**: Physical dimensions (length, width, height, depth)
- **box_specifications**: Box type, board specifications, material info
- **design_parameters**: Technical parameters and settings
- **file_references**: Links to ARD, PDF, and TXT files

## API Endpoints

- `GET /api/designs` - List all designs
- `GET /api/designs/:id` - Get design details
- `GET /api/designs/search/:query` - Search designs
- `GET /api/stats` - Get statistics
- `GET /api/health` - Health check

## File Structure

```
SkyBox/
├── docker-compose.yml          # Docker configuration
├── init.sql                   # Database schema
├── backend/                   # Node.js API server
│   ├── server.js             # Main server file
│   ├── scripts/
│   │   └── importData.js     # Data import script
│   └── package.json
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API services
│   │   └── styles/           # CSS styles
│   └── package.json
└── README.md
```

## Data Import

The system automatically parses ArtiosCAD text files and extracts:

- Design metadata (ID, dates, designer)
- Physical dimensions
- Box specifications
- Technical parameters
- File references

Supported file formats:
- `.txt` - ArtiosCAD text export
- `.ard` - ArtiosCAD drawing file
- `.pdf` - Exported PDF

## Usage

1. **Dashboard**: Overview of design library with statistics
2. **Design Library**: Browse all designs with search and filtering
3. **Design Details**: View comprehensive information for each design
4. **Search**: Find designs by ID, designer, type, or specifications

## Development

### Adding New Features

1. **Backend**: Add new routes in `backend/server.js`
2. **Frontend**: Create components in `frontend/src/components/`
3. **Database**: Update schema in `init.sql` if needed

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `REACT_APP_API_URL`: Backend API URL for frontend
- `NODE_ENV`: Environment (development/production)

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running and accessible
2. **Import Errors**: Check file permissions and format of text files
3. **Port Conflicts**: Modify ports in docker-compose.yml if needed

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**SkyBox Design Management System** - Streamlining cardboard box design workflows since 2024.
