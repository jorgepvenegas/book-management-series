import type { AppType } from "@books/api/routes";
import type { CreateBookSchema, UpdateBookSchema } from "@books/api/schemas";
import { hc } from "hono/client";

const BASE_URL = "http://localhost:3000";

const client = hc<AppType>(BASE_URL);

export const fetchBooks = async () => {
  const request = await client.books.$get();
  if (!request.ok) {
    const error = await request.json();
    throw new Error(error.error);
  }
  const response = await request.json();
  return response;
};

export const fetchBook = async (id: number) => {
  const request = await client.books[":id"].$get({
    param: {
      id: id.toString(),
    },
  });
  if (!request.ok) {
    const error = await request.json();
    throw new Error(error.error);
  }
  const response = await request.json();
  return response;
};

export const submitBook = async (book: CreateBookSchema) => {
  const request = await client.books.$post({
    json: {
      title: book.title,
      year: book.year,
      author: book.author,
    },
  });

  if (!request.ok) {
    const error = await request.json();
    throw new Error(error.error);
  }

  const response = await request.json();
  return response;
};

export const updateBook = async (book: UpdateBookSchema) => {
  const request = await client.books[":id"].$put({
    param: {
      id: book.id.toString(),
    },
    json: book,
  });
  if (!request.ok) {
    const error = await request.json();
    throw new Error(error.error);
  }
  const response = await request.json();
  return response;
};

export const deleteBook = async (id: number) => {
  const request = await client.books[":id"].$delete({
    param: {
      id: id.toString(),
    },
  });
  if (!request.ok) {
    const error = await request.json();
    throw new Error(error.error);
  }
  const response = await request.json();
  return response;
};
