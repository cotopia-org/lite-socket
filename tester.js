import {Connection} from 'rabbitmq-client'

// Initialize:
const rabbit = new Connection('amqp://rabbitmq:gUVi7ebl89iqzQMltbiPbXYvTUVxfbY1@aa806ae2-6ce3-4074-a993-bf0620841149.hsvc.ir:30255\n')
rabbit.on('error', (err) => {
    console.log('RabbitMQ connection error', err)
})
rabbit.on('connection', () => {
    console.log('Connection successfully (re)established')
})

// Consume messages from a queue:
// See API docs for all options
const sub = rabbit.createConsumer({exchanges: 'tester',}, async (msg) => {
    console.log(msg.body.toString())

})


sub.on('error', (err) => {
    // Maybe the consumer was cancelled, or the connection was reset before a
    // message could be acknowledged.
    console.log('consumer error (user-events)', err)
})
//
// // Declare a publisher
// // See API docs for all options
// const pub = rabbit.createPublisher({
//     // Enable publish confirmations, similar to consumer acknowledgements
//     confirm: true,
//     // Enable retries
//     maxAttempts: 2,
//     // Optionally ensure the existence of an exchange before we use it
//     exchanges: [{exchange: 'my-events', type: 'topic'}]
// })
//
// // Publish a message to a custom exchange
// await pub.send(
//     {exchange: 'my-events', routingKey: 'users.visit'}, // metadata
//     {id: 1, name: 'Alan Turing'}) // message content
//
// // Or publish directly to a queue
// await pub.send('user-events', {id: 1, name: 'Alan Turing'})

// Clean up when you receive a shutdown signal
async function onShutdown() {
    // Waits for pending confirmations and closes the underlying Channel
    await pub.close()
    // Stop consuming. Wait for any pending message handlers to settle.
    await sub.close()
    await rabbit.close()
}

process.on('SIGINT', onShutdown)
process.on('SIGTERM', onShutdown)