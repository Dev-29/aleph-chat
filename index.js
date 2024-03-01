import express from 'express'
import mongoose, {mongo} from 'mongoose'

const app = express()

const port = 3000

await mongoose.connect('mongodb+srv://dev227:dev227@cluster0.yg7wejf.mongodb.net/chat?retryWrites=true&w=majority&appName=Cluster0')

const userSchema = new mongoose.Schema({
    username: String,
    password: String
})

const User = mongoose.model('User', userSchema)

// User.create({ username: 'Jim', password: 'abc' })

app.get('/', (req, res) => {
    res.send('Hello')
})

app.get('/users/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username })
    res.send({ user: user })
})

app.listen(3000, () => {
    console.log('Listening on port 3000.')
})