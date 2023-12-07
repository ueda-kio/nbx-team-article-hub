import { Article, User } from '@prisma/client';
import { BASE_URL } from './baseUrl';

export const getUsers = async (uid?: string) => {
  const url = `${BASE_URL}/api/user${uid ? `?id=${uid}` : ''}`;
  const tag = uid ? `user-${uid}` : 'users';
  const res = await fetch(url, { next: { tags: [tag] } });
  const json = await res.json();
  return json.users as User[];
};

export const getArticles = async (creatorId?: string) => {
  const url = `${BASE_URL}/api/article${creatorId ? `?creatorId=${creatorId}` : ''}`;
  const tag = creatorId ? `articles-${creatorId}` : 'articles';
  const res = await fetch(url, { next: { tags: [tag] } });
  const json = await res.json();
  return json.articles as Article[];
};