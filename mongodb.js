const { MongoClient, ObjectId } = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
const id = new ObjectId()
console.log(id)

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database! -> ' + error)
    }

    const db = client.db(databaseName)
    db.collection('users').findOne({_id: new ObjectId("6370c919c5c5088201711bc6")}, (error, user) => {
        if (error) {
            return console.log('Unable to fetch')
        }
        console.log(user)
    })
    db.collection('users').find({age: 25}).toArray((error, users) => {
        console.log(users)
    })
    // db.collection('users').insertOne({
    //     _id: id,
    //     name: 'Kartikeya',
    //     age: 25
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert')
    //     }
    //     console.log(result.insertedId)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Temp1',
    //         age: 27
    //     },
    //     {
    //         name: 'Temp2',
    //         age: 29
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert')
    //     }
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Task 1',
    //         completed: true
    //     },
    //     {
    //         description: 'Task 2',
    //         completed: false
    //     },
    //     {
    //         description: 'Task 3',
    //         completed: true
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert')
    //     }
    // })


})