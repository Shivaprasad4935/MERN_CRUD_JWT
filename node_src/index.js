const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usermodel = require('./models/Users');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'shivaprasth755'; 

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/CRUD_operation");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.error("Token Verification Error:", err);
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        req.user = user; 
        next();
    });
};

app.post('/createUser', async (req, res) => {
    try {
        const newUser = await usermodel.create(req.body);
        const payload = { userId: newUser._id, email: newUser.email };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        res.json({ token, user: payload }); 
    } catch (err) {
        res.status(400).json(err);
    }
});

app.get('/', authenticateToken, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const skip = (page - 1) * limit;
        const users = await usermodel.find({})
            .skip(skip)
            .limit(limit);

        const totalUsers = await usermodel.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);

        res.json({
            users,
            page,
            limit,
            totalPages,
            totalUsers
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get('/getuser/:id', authenticateToken, (req, res) => {
    const id = req.params.id;
    usermodel.findById({ _id: id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' }); // Handle the case where the user is not found
            }
            res.json(user);
        })
        .catch(err => res.status(500).json(err));
});

app.put('/updateuser/:id', authenticateToken, (req, res) => {
    const id = req.params.id;
    usermodel.findByIdAndUpdate({ _id: id }, {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        })
        .catch(err => res.status(500).json(err));
});

app.delete('/deleteuser/:id', authenticateToken, (req, res) => {
    const id = req.params.id;
    usermodel.findByIdAndDelete({ _id: id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        })
        .catch(err => res.status(500).json(err));
});

app.listen('3001', () => {
    console.log('server is running');
});