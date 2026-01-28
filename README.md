
# Beauty Salon Backend

## Setup Instructions

### Database Migrations
When you change anything in the Prisma schema, run these commands:

```bash
npx prisma migrate dev
npx prisma generate
npm run dev  # Restart the backend
```

## Seeding the Database

To populate the database with test data (users, services, staff, and sample appointments), run:

```bash
npm run seed
```

This will seed the database with:
- **Services**: 8 beauty salon services with pricing
- **Test Users**: 1 admin user + 4 customer users
- **Staff Members**: 4 staff members with different specialties
- **Sample Appointments**: Sample appointments for testing

---

## 🔐 Test Login Credentials

### Admin Account
- **Email**: `admin@beautysalon.com`
- **Password**: `Admin@123`
- **Role**: Admin

### Customer Accounts

1. **Sarah Johnson**
   - **Email**: `sarah@example.com`
   - **Password**: `Sarah@123`
   - **Role**: Customer

2. **Emma Wilson**
   - **Email**: `emma@example.com`
   - **Password**: `Emma@123`
   - **Role**: Customer

3. **Jessica Brown**
   - **Email**: `jessica@example.com`
   - **Password**: `Jessica@123`
   - **Role**: Customer

4. **Lisa Anderson**
   - **Email**: `lisa@example.com`
   - **Password**: `Lisa@123`
   - **Role**: Customer

---

## Available Services

| Service | Duration | Price |
|---------|----------|-------|
| Hair Cut | 30 min | $25.00 |
| Hair Wash | 20 min | $15.00 |
| Hair Coloring | 90 min | $80.00 |
| Manicure | 45 min | $30.00 |
| Pedicure | 60 min | $40.00 |
| Facial Treatment | 60 min | $50.00 |
| Massage | 90 min | $70.00 |
| Eyebrow Shaping | 15 min | $12.00 |

---

## Staff Members

- **Michael Chen** - Hair Stylist
- **Rachel Martinez** - Makeup Artist
- **David Kim** - Massage Therapist
- **Angela Thompson** - Skin Care Specialist

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get user's appointments

---

## Environment Variables

Create a `.env` file in the Backend folder with:

```
DATABASE_URL=your_mariadb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

---

## Running the Backend

```bash
npm run dev      # Development with hot reload
npm run start    # Production mode
```