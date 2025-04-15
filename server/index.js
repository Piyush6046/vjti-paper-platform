
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create upload directories if they don't exist
const uploadDir = path.join(__dirname, 'uploads');
const avatarDir = path.join(uploadDir, 'avatars');
const paperDir = path.join(uploadDir, 'papers');
const bookDir = path.join(uploadDir, 'books');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir);
if (!fs.existsSync(paperDir)) fs.mkdirSync(paperDir);
if (!fs.existsSync(bookDir)) fs.mkdirSync(bookDir);

// Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadDir;
    
    if (file.fieldname === 'avatar') {
      uploadPath = avatarDir;
    } else if (file.fieldname === 'paper') {
      uploadPath = paperDir;
    } else if (file.fieldname === 'bookImage') {
      uploadPath = bookDir;
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'avatar' || file.fieldname === 'bookImage') {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed for avatars and book images!'));
      }
    } else if (file.fieldname === 'paper') {
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Only PDF files are allowed for papers!'));
      }
    }
    cb(null, true);
  }
});

// Import Models
const User = require('./models/User');
const Paper = require('./models/Paper');
const Review = require('./models/Review');
const Report = require('./models/Report');
const Message = require('./models/Message');
const Book = require('./models/Book');

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Routes

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    const savedUser = await user.save();
    
    // Create and send JWT
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user data (excluding password)
    const userData = {
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      avatar: savedUser.avatar
    };
    
    res.status(201).json({ user: userData, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create and send JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user data (excluding password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      branch: user.branch,
      year: user.year,
      bio: user.bio
    };
    
    res.json({ user: userData, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Routes
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/:id', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    // Check if user is updating their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }
    
    const updateData = {
      name: req.body.name,
      branch: req.body.branch || undefined,
      year: req.body.year || undefined,
      bio: req.body.bio || undefined
    };
    
    // If avatar was uploaded, add path to updateData
    if (req.file) {
      // Get the server URL
      const serverUrl = `${req.protocol}://${req.get('host')}`;
      updateData.avatar = `${serverUrl}/uploads/avatars/${req.file.filename}`;
    }
    
    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Paper Routes
app.get('/api/papers', async (req, res) => {
  try {
    const { branch, semester, year, search } = req.query;
    
    // Build query
    const query = {};
    
    if (branch) {
      query.branch = branch;
    }
    
    if (semester) {
      query.semester = semester;
    }
    
    if (year) {
      query.year = year;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const papers = await Paper.find(query)
      .sort({ uploadDate: -1 })
      .populate('uploadedBy', 'name avatar');
    
    res.json(papers);
  } catch (error) {
    console.error('Get papers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/papers/:id', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id)
      .populate('uploadedBy', 'name avatar');
    
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    
    res.json(paper);
  } catch (error) {
    console.error('Get paper error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/papers/user/:userId', authenticateToken, async (req, res) => {
  try {
    const papers = await Paper.find({ uploadedBy: req.params.userId })
      .sort({ uploadDate: -1 });
    
    res.json(papers);
  } catch (error) {
    console.error('Get user papers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/papers', authenticateToken, upload.single('paper'), async (req, res) => {
  try {
    const { title, description, branch, semester, year } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Get the server URL
    const serverUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${serverUrl}/uploads/papers/${req.file.filename}`;
    
    const paper = new Paper({
      title,
      description,
      branch,
      semester,
      year,
      uploadedBy: req.user.id,
      fileUrl,
      uploadDate: new Date(),
      rating: 0,
      reviewCount: 0,
      downloadCount: 0
    });
    
    const savedPaper = await paper.save();
    await savedPaper.populate('uploadedBy', 'name avatar');
    
    res.status(201).json(savedPaper);
  } catch (error) {
    console.error('Upload paper error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/papers/:id/download', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    
    // Increment download count
    paper.downloadCount += 1;
    await paper.save();
    
    res.json({ message: 'Download count incremented', downloadCount: paper.downloadCount });
  } catch (error) {
    console.error('Paper download error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Review Routes
app.post('/api/papers/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Check if paper exists
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    
    // Check if user already reviewed this paper
    const existingReview = await Review.findOne({
      paperId: req.params.id,
      userId: req.user.id
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this paper' });
    }
    
    // Create new review
    const review = new Review({
      paperId: req.params.id,
      userId: req.user.id,
      rating,
      comment,
      createdAt: new Date()
    });
    
    const savedReview = await review.save();
    await savedReview.populate('userId', 'name avatar');
    
    // Update paper rating
    const allReviews = await Review.find({ paperId: req.params.id });
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const newRating = totalRating / allReviews.length;
    
    paper.rating = parseFloat(newRating.toFixed(1));
    paper.reviewCount = allReviews.length;
    await paper.save();
    
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/papers/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ paperId: req.params.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name avatar');
    
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Report Routes
app.post('/api/papers/:id/report', authenticateToken, async (req, res) => {
  try {
    const { reason, description } = req.body;
    
    // Create new report
    const report = new Report({
      paperId: req.params.id,
      userId: req.user.id,
      reason,
      description,
      status: 'pending',
      createdAt: new Date()
    });
    
    const savedReport = await report.save();
    
    res.status(201).json({ message: 'Report submitted successfully', report: savedReport });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book Routes
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find({ sold: false })
      .sort({ listedDate: -1 })
      .populate('listedBy', 'name avatar');
    
    res.json(books);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/books/user/:userId', authenticateToken, async (req, res) => {
  try {
    const books = await Book.find({ listedBy: req.params.userId })
      .sort({ listedDate: -1 });
    
    res.json(books);
  } catch (error) {
    console.error('Get user books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/books', authenticateToken, upload.single('bookImage'), async (req, res) => {
  try {
    const { title, author, price, condition, description } = req.body;
    
    let imageUrl = null;
    if (req.file) {
      // Get the server URL
      const serverUrl = `${req.protocol}://${req.get('host')}`;
      imageUrl = `${serverUrl}/uploads/books/${req.file.filename}`;
    }
    
    const book = new Book({
      title,
      author,
      price: parseFloat(price),
      condition,
      description,
      imageUrl,
      listedBy: req.user.id,
      listedDate: new Date(),
      sold: false
    });
    
    const savedBook = await book.save();
    await savedBook.populate('listedBy', 'name avatar');
    
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/books/:id/sold', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if user is the book owner
    if (book.listedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }
    
    book.sold = true;
    await book.save();
    
    res.json({ message: 'Book marked as sold', book });
  } catch (error) {
    console.error('Mark book as sold error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Message Routes
app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: 1 })
      .limit(100)
      .populate('user', 'name avatar');
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    
    const message = new Message({
      content,
      user: req.user.id,
      timestamp: new Date()
    });
    
    const savedMessage = await message.save();
    await savedMessage.populate('user', 'name avatar');
    
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
