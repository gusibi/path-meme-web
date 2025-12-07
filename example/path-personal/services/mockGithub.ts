import { Post, PostType, Comment, User } from '../types';

// Mock Data Store
const MOCK_USER: User = {
  id: 'u1',
  username: 'PathUser',
  avatar_url: 'https://picsum.photos/100/100',
  is_owner: true,
};

const GUEST_USER: User = {
  id: 'guest',
  username: 'GuestVisitor',
  avatar_url: 'https://picsum.photos/100/100?grayscale',
  is_owner: false,
};

const generateMockPosts = (count: number, startId: number): Post[] => {
  return Array.from({ length: count }).map((_, i) => {
    const id = startId + i;
    const type = i % 4 === 0 ? PostType.DIARY : (i % 3 === 0 ? PostType.ARTICLE : PostType.TEXT);
    const date = new Date();
    date.setDate(date.getDate() - i);

    return {
      id,
      title: type === PostType.TEXT ? null : (type === PostType.DIARY ? date.toLocaleDateString() : `The Beauty of Moment ${id}`),
      body: `This is a simulated markdown content for post **#${id}**. \n\n It supports *markdown* syntax like lists:\n- Item 1\n- Item 2\n\n> "Path was known for its beautiful design."`,
      created_at: date.toISOString(),
      type,
      tags: ['life', 'design', 'memory'],
      user: MOCK_USER,
      comments_count: Math.floor(Math.random() * 5),
    };
  });
};

let postsCache = generateMockPosts(40, 1);
const commentsCache: Record<number, Comment[]> = {};

// Service Methods
export const getPosts = async (page: number, limit: number = 20): Promise<Post[]> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency
  const start = (page - 1) * limit;
  return postsCache.slice(start, start + limit);
};

export const getPostById = async (id: number): Promise<Post | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return postsCache.find(p => p.id === id);
};

export const createPost = async (post: Omit<Post, 'id' | 'created_at' | 'user' | 'comments_count'>): Promise<Post> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newPost: Post = {
    ...post,
    id: Date.now(),
    created_at: new Date().toISOString(),
    user: MOCK_USER,
    comments_count: 0,
  };
  postsCache = [newPost, ...postsCache];
  return newPost;
};

export const getComments = async (postId: number): Promise<Comment[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return commentsCache[postId] || [];
};

export const addComment = async (postId: number, body: string, user: User): Promise<Comment> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newComment: Comment = {
    id: Date.now(),
    user,
    body,
    created_at: new Date().toISOString(),
  };
  if (!commentsCache[postId]) commentsCache[postId] = [];
  commentsCache[postId].push(newComment);
  return newComment;
};

export const login = async (password: string): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (password === 'secret') return MOCK_USER;
  return null;
};

export const checkDiaryPassword = async (password: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return password === '1234'; // Simple diary password
};
