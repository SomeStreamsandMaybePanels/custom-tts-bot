class JobQueue {
  constructor () {
    this.queue = []
    this.isProcessing = false
  }

  enqueue (job) {
    this.queue.push(job)
    if (!this.isProcessing) {
      this.processQueue()
    }
  }

  async processQueue () {
    this.isProcessing = true
    while (this.queue.length > 0) {
      const job = this.queue.shift()
      try {
        await job()
      } catch (error) {
        logger.error('Error processing job:', error)
      }
    }
    this.isProcessing = false
  }
}

module.exports = JobQueue
