import { Router } from 'express';
import { body, query, param } from 'express-validator';
import { validate } from '@/middleware/validator.middleware';
import { asyncHandler } from '@/middleware/error-handler.middleware';
import { authenticate } from '@/middleware/auth.middleware';
import passport from 'passport';
import {CommentController} from "@/comment/controllers/comment.controller";

const router = Router();
const commentController = new CommentController();

// Optional authentication middleware (allows both authenticated and guest users)
const optionalAuth = (req: any, res: any, next: any) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};

// Validation rules
const createCommentValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters'),
  body('parentComment').optional().isMongoId().withMessage('Invalid parent comment ID'),
  validate,
];

const updateCommentValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters'),
  validate,
];

const getCommentsValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'most_liked', 'most_disliked'])
    .withMessage('Invalid sort option'),
  query('parentComment').optional(),
  validate,
];

const commentIdValidation = [
  param('id').isMongoId().withMessage('Invalid comment ID'),
  validate,
];

/**
 * @route   GET /api/v1/comments
 * @desc    Get all comments with pagination
 * @access  Public (with optional auth for user reactions)
 */
router.get(
  '/',
  getCommentsValidation,
  optionalAuth,
  asyncHandler(commentController.getComments.bind(commentController))
);

/**
 * @route   GET /api/v1/comments/:id
 * @desc    Get single comment
 * @access  Public (with optional auth for user reaction)
 */
router.get(
  '/:id',
  commentIdValidation,
  optionalAuth,
  asyncHandler(commentController.getComment.bind(commentController))
);

/**
 * @route   POST /api/v1/comments
 * @desc    Create a new comment
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  createCommentValidation,
  asyncHandler(commentController.createComment.bind(commentController))
);

/**
 * @route   PUT /api/v1/comments/:id
 * @desc    Update comment
 * @access  Private (Author only)
 */
router.put(
  '/:id',
  authenticate,
  commentIdValidation,
  updateCommentValidation,
  asyncHandler(commentController.updateComment.bind(commentController))
);

/**
 * @route   DELETE /api/v1/comments/:id
 * @desc    Delete comment
 * @access  Private (Author only)
 */
router.delete(
  '/:id',
  authenticate,
  commentIdValidation,
  asyncHandler(commentController.deleteComment.bind(commentController))
);

/**
 * @route   POST /api/v1/comments/:id/like
 * @desc    Like a comment
 * @access  Private
 */
router.post(
  '/:id/like',
  authenticate,
  commentIdValidation,
  asyncHandler(commentController.likeComment.bind(commentController))
);

/**
 * @route   POST /api/v1/comments/:id/dislike
 * @desc    Dislike a comment
 * @access  Private
 */
router.post(
  '/:id/dislike',
  authenticate,
  commentIdValidation,
  asyncHandler(commentController.dislikeComment.bind(commentController))
);

export default router;