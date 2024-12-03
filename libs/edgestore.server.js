import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket({
    accept: ['application/pdf'],
    maxSize: 1024 * 1024 * 10, // 10MB
  }),
});

export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { edgeStoreRouter }; 