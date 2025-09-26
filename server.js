const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const fs = require('fs');
//const expressLayouts = require('express-ejs-layouts');


const methodOverride = require('method-override');
require('dotenv').config();

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Respect proxy headers in production (e.g., Render) for correct secure cookies
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Ensure upload directories exist
const uploadBasePath = process.env.UPLOAD_PATH || path.join(__dirname, 'public', 'uploads');
const prescriptionsPath = path.join(uploadBasePath, 'prescriptions');
try {
    fs.mkdirSync(prescriptionsPath, { recursive: true });
} catch (err) {
    console.error('Failed to ensure upload directories exist:', err);
}

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/telemedicine';
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

// Middleware
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(expressLayouts);

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'telemedicine-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.use(flash());

// Flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/patient', require('./routes/patient'));
app.use('/doctor', require('./routes/doctor'));

// Realtime Chat with Socket.io
io.on('connection', (socket) => {
	console.log('A user connected to chat');

	// Join default room
	socket.join('general');

	// Receive and broadcast chat messages
	socket.on('chatMessage', (payload) => {
		// payload: { name: string, message: string, timestamp?: number }
		var hasName = payload && typeof payload.name === 'string';
		var hasMessage = payload && typeof payload.message === 'string';
		var hasTimestamp = payload && typeof payload.timestamp === 'number';

		var safePayload = {
			name: hasName ? payload.name : 'User',
			message: hasMessage ? payload.message : '',
			timestamp: hasTimestamp ? payload.timestamp : Date.now()
		};
		if (!safePayload.message) return;
		io.to('general').emit('chatMessage', safePayload);
	});

	socket.on('disconnect', () => {
		console.log('A user disconnected from chat');
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
