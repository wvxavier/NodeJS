const express = require('express')
const User = require('../db/models/user')
const router = new express.Router()
//Auth Express middleware
const auth = require('../middleware/auth')

//HTTP ROUTES / ENDPOINTS
//Async changes the Promisse behaiviour, it alwasys will return a Promise - better than Promise chaining

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})


router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token !== req.token
        })
        await req.user.save()

        res.status(200).send()
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens =[]
        await req.user.save()

        res.status(200).send()
    } catch (error) {
        res.status(400).send(error)
    }
})


router.post('/users', async (req, res) => {
    //Instances a object type User
    const user = new User(req.body)

    //Use await to chain promises
    try {
        user.token = await user.generateAuthToken()
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }

})
//Auth runs first as it's my middleware and then next() there call this function
router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user)

})

//Path using Route ID, obtained using req.params
router.get('/users/:id', async (req, res) => {

    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.status(201).send(user)

    } catch (error) {
        res.status(400).send(error)
    }
    /*
    
        User.findById(req.params.id).then((result) => {
            if (!result) {
                return res.status(404).send('Could not find User')
            }
            res.status(200).send(result)
    
        }).catch((error) => {
            res.status(400).send(error)
        })
        */
})


router.patch('/users/:id', async (req, res) => {
    //
    const allowedUpdates = [
        'name',
        'email',
        'password',
        'age'
    ]
    //Object.keys converst the JSON body in array
    const updates = Object.keys(req.body)
    // every() => {} Runs this function for everu single item in the array
    // OR sintaxe in 1 line:   const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = await User.findById(req.params.id)

        updates.forEach((update) => {
            //[@] notation, dynamic
            user[update] = req.body[update]
        })

        await user.save()
        //Old Method to update because does not inconporate hashin on method save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!user) {

            return res.status(404).send()
        }

        res.status(200).send(user)

    } catch (error) {
        res.status(400).send(error)
    }
})


router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.status(200).send(user)

    } catch (error) {
        res.status(400).send(error)

    }
})

module.exports = router