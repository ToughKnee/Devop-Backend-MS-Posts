import {
  getReportedPostsPaginated,
  getReportedPostsCount,
  ReportedPost
} from '../repositories/reported.posts.repository';
import {BadRequestError, InternalServerError} from '../../../utils/errors/api-error';

/**
 * Fetches paginated posts for a user by their email.
 *
 * @param page - The page number to fetch.
 * @param limit - The number of posts per page.
 * @returns An object containing the posts and metadata (total posts, total pages, current page).
 * @throws InternalServerError if fetching posts fails.
 */
interface ReportedPostsResponse {
  message: string;
  posts: ReportedPost[];
  metadata: {
    totalPosts: number;
    totalPages: number;
    currentPage: number;
  };
}

/**
 * Fetches paginated reported posts.
 *
 * @param page  - The page number to fetch (1-based).
 * @param limit - The number of posts per page (must be > 0).
 * @returns An object containing:
 *  - message: confirmation string,
 *  - posts: array of ReportedPost,
 *  - metadata: { totalPosts, totalPages, currentPage }.
 * @throws BadRequestError      If page or limit no son válidos.
 * @throws InternalServerError  Si ocurre cualquier error en la consulta.
 */
export const getReportedPosts = async (
    page: number,
    limit: number
): Promise<ReportedPostsResponse> => {
  if (page < 1 || limit < 1) {
    throw new BadRequestError('page y limit deben ser números enteros positivos.');
  }

  try {
    const offset = (page - 1) * limit;

    const totalPosts = await getReportedPostsCount();
    const totalPages = Math.ceil(totalPosts / limit);

    const postsOrMessage = await getReportedPostsPaginated(limit, offset);

    let posts: ReportedPost[];
    if (Array.isArray(postsOrMessage)) {
      posts = postsOrMessage;
    } else {
      posts = [];
    }

    return {
      message: 'Posts fetched successfully',
      posts,
      metadata: {
        totalPosts,
        totalPages,
        currentPage: page,
      },
    };
  } catch (err) {
    console.error('Error en getReportedPosts:', err);
    throw new InternalServerError('Failed to fetch reported posts');
  }
};