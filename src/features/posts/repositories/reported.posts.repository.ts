import client from '../../../config/database';
import { Post } from '../interfaces/posts.entities.interface';
import { QueryResult } from 'pg'; // Importing QueryResult for type safety

/**
 * Retrieves paginated reported posts.
 *
 */
export const getReportedPostsPaginated = async (offset: number, limit: number) => {
  /*
  const userQuery = 'SELECT uuid FROM users WHERE email = $1';
  const userResult: QueryResult = await client.query(userQuery, [email]);

  if (userResult.rows.length === 0) {
    return null; // User not found
  }

  const userUuid = userResult.rows[0].uuid;

  // Fetching posts for the user
  // LIMIT: Represents the maximum number of rows to return.
  // OFFSET: Represents the number of rows to skip before starting to return rows from the query.
  // Useful for pagination.
  const postQuery = `
    SELECT text, file_url, file_type, file_size, created_at FROM post 
    WHERE uuid = $1 AND state = 'visible' 
    ORDER BY created_at DESC 
    LIMIT $2 OFFSET $3
  `;

  const postResult: QueryResult = await client.query(postQuery, [userUuid, limit, offset]);

  return postResult.rows.length > 0 ? postResult.rows : [];

   */
};

/**
 *
 */
export const getTotalReportedPosts = async () => {
  /*
  const userQuery = 'SELECT uuid FROM users WHERE email = $1';
  const userResult: QueryResult = await client.query(userQuery, [email]);

  if (userResult.rows.length === 0) {
    return 0; // User not found, so no posts
  }

  const userUuid = userResult.rows[0].uuid;

  const countQuery = 'SELECT COUNT(*) FROM post WHERE uuid = $1 AND state = $2';
  const countResult: QueryResult = await client.query(countQuery, [userUuid, 'visible']);

  return parseInt(countResult.rows[0].count, 10);

   */
};

export const createPost = async (post: Post) => {
  // Insert a new post into the database
  // Check Post interface for required fields
}
