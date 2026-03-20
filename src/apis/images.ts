import { apiClient } from './client';

export interface ImageItem {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export interface ImageListData {
  items: ImageItem[];
  total: number;
}

export interface ImageListParams {
  page?: number;
  pageSize?: number;
}

export function getImageList(params?: ImageListParams, options?: { signal?: AbortSignal }) {
  return apiClient.get<ImageListData>('/images', { params, signal: options?.signal });
}
