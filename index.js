import express from 'express'
import mongoose, {mongo} from 'mongoose'
import bodyParser from 'body-parser'

const expressSession = require('express-session')({
    secret: 'vit',
    resave: 'false',
    saveUninitialized: false
})

import passport from 'passport'
import passportLocalMongoose from 'passport-local-mongoose'
import connectEnsureLogin from 'connect-ensure-login'

const app = express()
const port = 3000

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSession)

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect('mongodb+srv://dev227:dev227@cluster0.yg7wejf.mongodb.net/chat?retryWrites=true&w=majority&appName=Cluster0')
    .catch(err => handleError(err))

const userSchema = new mongoose.Schema({
    username: String,
    password: String
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', userSchema)
passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// User.create({ username: 'Jim', password: 'abc' })

// User.register({ username: 'jack', active: false }, 'password')

app.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.sendFile('views/index.html', { root: __dirname })
})

app.get('/login', (req, res) => {
    res.sendFile('views/login.html', { root: __dirname })
})

app.get('/register', (req, res) => {
    res.sendFile('views/register.html', { root: __dirname })
})

app.post('/login', passport.authenticate('local'), (req, res) => {
    res.redirect('/')
})

app.post('/register', (req, res) => {
    User.register({ username: req.body.username, active: false }, req.body.password, (err, user) => {
        passport.authenticate('local')(req, res, () => {
            res.redirect('/')
        })
    })
})

app.get('/users/:username', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
    const user = await User.findOne({ username: req.params.username })
    res.send({ user: user })
})

// Test commit
app.listen(3000, () => {
    console.log('Listening on port 3000.')
})