TrainingLog {
  _id: ObjectId // training log's id
  user: ObjectId // user this training log corresponds to
  animal: ObjectId // animal this training log corresponds to
  title: string // title of training log
  date: Date // date of training log
  description: string // description of training log
  hours: number // number of hours the training log records
}

