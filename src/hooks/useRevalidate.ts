'use server';
import { revalidatePath, revalidateTag } from 'next/cache';

export const userRevalidateTag = (...arg: Parameters<typeof revalidateTag>) => {
  const [tag] = arg;
  revalidateTag(tag);
};

export const useRevalidatePath = (...arg: Parameters<typeof revalidatePath>) => {
  const [originalPath, type] = arg;
  revalidatePath(originalPath, type);
};
