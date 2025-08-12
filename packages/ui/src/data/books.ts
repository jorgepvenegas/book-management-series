import type { Book } from "@/components/book-form";

const BASE_URL = "http://localhost:3000";

export const fetchBooks = async () => {
  const request = await fetch(`${BASE_URL}/books`);
  const response = await request.json();
  return response;
};

export const submitBook = async (book: Book) => {
  const request = await fetch(`${BASE_URL}/book`, {
    method: "POST",
    body: JSON.stringify({
      title: book.title,
      year: book.year,
      author: book.author,
    }),
  });
  const response = await request.json();
  return response;
};

export const updateBook = async ({ id, ...book }: Required<Book>) => {
  const request = await fetch(`${BASE_URL}/book/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: book.title,
      year: book.year,
      author: book.author,
    }),
  });
  const response = await request.json();
  return response;
};

export const deleteBook = async (id: number) => {
  const request = await fetch(`${BASE_URL}/book/${id}`, {
    method: "DELETE",
  });
  const response = await request.json();
  return response;
};
