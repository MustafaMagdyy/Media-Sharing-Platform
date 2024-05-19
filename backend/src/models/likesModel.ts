import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;   // Reference to the User schema
  media: mongoose.Types.ObjectId;  // Reference to the MediaContent schema
  createdAt: Date;                 
}

const LikeSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  media: { type: Schema.Types.ObjectId, ref: 'MediaContent', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Like = mongoose.model<ILike>('Like', LikeSchema);

export default Like;