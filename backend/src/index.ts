import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';

// Import routes
import { roomsRoutes } from './routes/rooms';
import { motionRoutes } from './routes/motion';
import { adminRoutes } from './routes/admin';
import { userRoutes } from './routes/user';
import { bookingRoutes } from './routes/booking';
import { dashboardRoutes } from './routes/dashboard';

const app = new Elysia()
    .use(cors())
    .use(swagger({
        documentation: {
            info: {
                title: 'Smart Room API Documentation',
                version: '1.0.0',
                description: 'API untuk sistem Smart Room dengan sensor gerak dan manajemen ruangan'
            },
            tags: [
                { name: 'General', description: 'Endpoint umum' },
                { name: 'Auth', description: 'Endpoint untuk autentikasi user (Register & Login)' },
                { name: 'Bookings', description: 'Endpoint untuk booking ruangan' },
                { name: 'Rooms', description: 'Endpoint untuk data ruangan (User/Frontend)' },
                { name: 'IoT', description: 'Endpoint untuk ESP32 dan sensor IoT' },
                { name: 'Admin', description: 'Endpoint untuk administrasi ruangan' },
                { name: 'Dashboard', description: 'Endpoint untuk data dashboard' }
            ]
        }
    }))
    .get("/", () => "Smart Room API is Online 🚀", {
        detail: {
            tags: ['General'],
            summary: 'Health Check',
            description: 'Cek apakah API sudah online dan berjalan'
        }
    })

    // Use modular routes
    .use(userRoutes)
    .use(bookingRoutes)
    .use(roomsRoutes)
    .use(motionRoutes)
    .use(adminRoutes)
    .use(dashboardRoutes)

    .listen(8000);

console.log(`✅ Backend jalan di http://localhost:8080`);
console.log(`📚 Swagger UI: http://localhost:8080/swagger`);