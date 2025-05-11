import client from '../../../config/database';
import { Post } from '../interfaces/posts.entities.interface';
import { QueryResult } from 'pg'; // Importing QueryResult for type safety


// { NO_ACTIVE = 0, ACTIVE = 1 }
const ACTIVE_REPORT_STATUS = 1;

export interface ReportedPost {
    id: string;
    content: string | null;
    file_url: string | null;
    media_type: number | null;
    username: string;
    email: string;
    created_at: Date;
    post_status: number;
    active_reports: number;
    total_reports: number;
}

/**
 * Retrieves paginated reported posts.
 *
 */
export const getReportedPostsPaginated = async (
    limit: number,
    offset: number
): Promise<ReportedPost[] | { message: string }> => {
    const paginatedQuery = `
    SELECT
      p.id,
      p.content,
      p.file_url,
      p.media_type,
      u.username,
      u.email,
      p.created_at,
      p.status               AS post_status,
      COALESCE(SUM(CASE WHEN r.status = $1 THEN 1 ELSE 0 END), 0) AS active_reports,
      COUNT(r.id)                                AS total_reports
    FROM posts p
    JOIN users u
      ON p.user_id = u.id
    JOIN reports r
      ON r.reported_content_id = p.id
    GROUP BY
      p.id,
      p.content,
      p.file_url,
      p.media_type,
      u.username,
      u.email,
      p.created_at,
      p.status
    ORDER BY p.created_at DESC
    LIMIT $2
    OFFSET $3;
  `;

    const values = [ACTIVE_REPORT_STATUS, limit, offset];
    const result: QueryResult<ReportedPost> = await client.query(paginatedQuery, values);

    if (result.rows.length === 0) {
        return { message: 'No hay publicaciones reportadas en este rango de páginas.' };
    }

    return result.rows;
};


export const getAllReports = async () => {
    const reportsQuery = 'SELECT * FROM reports';
    const reportResult: QueryResult = await client.query(reportsQuery, []);


    return reportResult.rows.length > 0 ? reportResult.rows : [];
}

export const getAllReportedPosts = async (): Promise<ReportedPost[] | { message: string }> => {
    const reportsQuery = `
    SELECT
      p.id,
      p.content,
      p.file_url,
      p.media_type,
      u.username,
      u.email,
      p.created_at,
      p.status            AS post_status,
      COALESCE(SUM(CASE WHEN r.status = $1 THEN 1 ELSE 0 END), 0) AS active_reports,
      COUNT(r.id)                               AS total_reports
    FROM posts p
    JOIN users u
      ON p.user_id = u.id
    JOIN reports r
      ON r.reported_content_id = p.id
    GROUP BY
      p.id,
      p.content,
      p.file_url,
      p.media_type,
      u.username,
      u.email,
      p.created_at,
      p.status
    ORDER BY p.created_at DESC;
  `;

    const values = [ACTIVE_REPORT_STATUS];
    const result: QueryResult<ReportedPost> = await client.query(reportsQuery, values);

    if (result.rows.length === 0) {
        return { message: 'No hay publicaciones reportadas en este momento.' };
    }

    return result.rows;
};

export const getReportedPostsCount = async (): Promise<number> => {
    const countQuery = `
    SELECT COUNT(DISTINCT p.id) AS reported_count
    FROM posts p
    JOIN reports r
      ON r.reported_content_id = p.id;
  `;
    const result = await client.query<{ reported_count: string }>(countQuery);

    return parseInt(result.rows[0].reported_count, 10);
};

export const createPost = async (post: Post) => {
  // Insert a new post into the database
  // Check Post interface for required fields
}
