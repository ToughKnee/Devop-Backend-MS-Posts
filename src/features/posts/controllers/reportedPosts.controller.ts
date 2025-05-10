import { NextFunction, Request, Response } from 'express';
import { getReportedPosts } from '../services/reportedPosts.service';
import * as yup from 'yup';
import { AuthenticatedRequest } from '../../../features/middleware/authenticate.middleware';
import { BadRequestError, UnauthorizedError } from '../../../utils/errors/api-error';
import { getReportedPostsSchema, GetReportedPostsDto } from '../dto/getReportedPosts.dto';

export const getUReportedPostsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Validate and cast the query parameters to GetUserPostsDTO
    const validatedQuery = await getReportedPostsSchema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    }) as GetReportedPostsDto;

    // Service Usage
    const {message, posts, metadata} = await getReportedPosts(validatedQuery.page, validatedQuery.limit);
    res.status(200).json({
      message: message,
      posts: posts,
      metadata: metadata,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      next(new BadRequestError('Validation error', error.errors));
    } else {
      next(error);
    }
  }
};
