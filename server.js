import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let requestCount = 0;

function requestLogger(req, res, next) {
  const time = new Date().toISOString();
  console.log('[' + time + '] ' + req.method + ' ' + req.url);
  next();
}

function requestCounter(req, res, next) {
  requestCount = requestCount + 1;
  next();
}

app.use(requestLogger);
app.use(requestCounter);
app.use(express.static(path.join(__dirname, 'public')));

const courses = [
  { id: 1, title: 'Web Programming', credits: 5 },
  { id: 2, title: 'Operating Systems', credits: 6 },
  { id: 3, title: 'Software Engineering', credits: 4 }
];

app.get('/hello', function (req, res) {
  res.send("Hello from Fatima's server");
});

app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /api/');
});

app.get('/old-page', function (req, res) {
  res.redirect('/hello');
});

app.get('/api/courses', function (req, res) {
  res.json(courses);
});

app.get('/api/status', function (req, res) {
  res.json({
    status: 'OK',
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime())
  });
});

app.get('/api/headers', function (req, res) {
  res.json({
    'User-Agent': req.get('User-Agent'),
    'Accept': req.get('Accept')
  });
});

app.post('/api/subscribe', function (req, res) {
  res.status(201).json({ subscribed: true });
});

app.get('/api/admin', function (req, res) {
  res.status(403).json({ error: 'Forbidden' });
});

app.get('/api/stats', function (req, res) {
  res.json({ requestsServed: requestCount });
});

app.use(function (req, res) {
  res.status(404).json({
    error: 'Not Found',
    path: req.url
  });
});

app.listen(PORT, function () {
  console.log('Server running on port ' + PORT);
});