import { NextFunction, Request, Response, RequestHandler } from 'express';
import { getUserPosts } from '../services/userPosts.service';
import * as yup from 'yup';
import { AuthenticatedRequest } from '../../../features/middleware/authenticate.middleware';
import { BadRequestError, UnauthorizedError } from '../../../utils/errors/api-error';
import { getUserPostsSchema, GetUserPostsDTO } from '../dto/getUserPosts.dto';

export const getUserPostsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate and cast the query parameters to GetUserPostsDTO
    const validatedQuery = await getUserPostsSchema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    }) as GetUserPostsDTO;

    // Check if the user is authorized
    if (req.user.role !== 'user') {
      throw new UnauthorizedError('User not authenticated');
    }

    const posts = await getUserPosts(req.user.uuid, validatedQuery.page, validatedQuery.limit);
    res.status(200).json(posts);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      next(new BadRequestError('Validation error', error.errors));
    } else {
      next(error);
    }
  }
};
