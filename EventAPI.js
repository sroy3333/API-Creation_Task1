const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());

const MONGO_URI = 'mongodb+srv://new-user_31:nJ2eDpCCyyEhlkOz@cluster0.dvyo9.mongodb.net'; 
const DB_NAME = 'event_app';
let db;

MongoClient.connect(MONGO_URI)
  .then(client => {
    db = client.db(DB_NAME);
    console.log('MongoDB connected');
  })
  .catch(err => console.error(err));

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const router = express.Router();

router.get('/events', async (req, res) => {
  try {
    if (req.query.id) {
      const event = await db
        .collection('events')
        .findOne({ _id: new ObjectId(req.query.id) });

      if (!event) return res.status(404).json({ message: 'Event not found' });
      return res.json(event);
    }
    const { type, limit = 5, page = 1 } = req.query;

    if (type === 'latest') {
      const events = await db
        .collection('events')
        .find({})
        .sort({ schedule: -1 })
        .skip((page - 1) * Number(limit))
        .limit(Number(limit))
        .toArray();

      return res.json(events);
    }

    res.status(400).json({ message: 'Invalid query' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/events', upload.single('image'), async (req, res) => {
  try {
    const payload = {
      type: 'event',
      uid: Number(req.body.uid),
      name: req.body.name,
      tagline: req.body.tagline,
      schedule: new Date(req.body.schedule),
      description: req.body.description,
      files: req.file ? { image: req.file.path } : {},
      moderator: req.body.moderator,
      category: req.body.category,
      sub_category: req.body.sub_category,
      rigor_rank: Number(req.body.rigor_rank),
      attendees: req.body.attendees ? JSON.parse(req.body.attendees) : [],
      createdAt: new Date()
    };

    const result = await db.collection('events').insertOne(payload);

    res.status(201).json({ event_id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/events/:id', upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.body.schedule) {
      updates.schedule = new Date(req.body.schedule);
    }

    if (req.file) {
      updates.files = { image: req.file.path };
    }

    if (req.body.attendees) {
      updates.attendees = JSON.parse(req.body.attendees);
    }

    const result = await db.collection('events').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );

    if (!result.matchedCount) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    const result = await db
      .collection('events')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (!result.deletedCount) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/v3/app', router);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

