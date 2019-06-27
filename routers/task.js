//Dependecies
const express = require('express')
const Task = require('../db/models/task')
//Method to structures routes
const router = new express.Router()


//HTTP ROUTES / ENDPOINTS
//Async changes the Promisse behaiviour, it alwasys will return a Promise

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)

    } catch (error) {
        res.status(400).send(error)
    }
 

})

router.get('/tasks', async (req, res) => {
 
    try {
        const task = await Task.find({})
        res.status(201).send(task)

    } catch (error) {
        res.status(400).send(error)
    }

})

router.get('/tasks/:id', async (req, res) => {

    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(400).send()
        }
        res.status(201).send(task)

    } catch (error) {
        res.status(400).send(error)
    }

})

router.patch('/tasks/:id', async (req, res) => {
    const allowedUpdates = [
        'description',
        'completed'
    ]
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const task = await Task.findById(req.params.id)

        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send()
        }
        res.status(201).send(task)

    } catch (error) {
        res.status(400).send(error)
    }

})

router.delete('/tasks/:id', async (req, res) => {

    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            return res.status(404).send()
        }

        res.status(200).send(task)

    } catch (error) {
        res.status(400).send(error)

    }


})


module.exports = router
