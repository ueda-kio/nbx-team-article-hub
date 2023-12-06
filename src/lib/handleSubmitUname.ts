'use server';

import { getServerSession } from '@/auth';
import { Site } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getQiitaArticles, getZennArticles } from './getArticles';

export default async function handleSubmitUname(site: Site, uname: string) {
  const session = await getServerSession();
  const uid = session?.user?.id ?? '';

  await Promise.all([
    fetch(`http://localhost:3000/api/user/${uid}`, {
      method: 'PUT',
      body: JSON.stringify({
        [site]: uname,
      }),
      next: {
        tags: ['users'],
      },
    }),
    (async () => {
      const articles = await (async () => (site === 'qiita' ? await getQiitaArticles(uname, uid) : getZennArticles(uname, uid)))();
      fetch('http://localhost:3000/api/article', {
        method: 'POST',
        body: JSON.stringify({
          uid,
          site,
          articles,
        }),
        next: {
          tags: ['articles'],
        },
      });
    })(),
  ]).finally(() => {
    revalidatePath(`/member/${uid}`, 'page');
    console.log('revalidatePath!');
  });
  return Promise.resolve();
}