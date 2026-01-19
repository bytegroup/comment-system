// Import all models to ensure they're registered with Mongoose
import { User } from '@/user/models/user.model';
import { Comment } from '@/comment/models/comment.model';
import { Reaction } from '@/comment/models/reaction.model';

// Export them for convenience
export { User, Comment, Reaction };