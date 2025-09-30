import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../../components/ui/button";
import { EllipsisIcon } from "lucide-react";
import { useState } from "react";
import BookModal from "../../components/book-modal";
import DeleteBookDialog from "../../components/delete-book-dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchBooks } from "../../data/books";
import type { BookSchema } from "@books/api/schemas";
import toast from "react-hot-toast";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/books/")({
  component: IndexComponent,
});

function IndexComponent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<BookSchema>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: books } = useQuery<Array<BookSchema>>({
    queryKey: ["books"],
    queryFn: fetchBooks,
    initialData: [],
  });

  return (
    <div className="w-full flex justify-center h-screen bg-gray-100">
      <BookModal open={modalOpen} onOpenChange={setModalOpen} book={currentBook} />
      {currentBook && (
        <DeleteBookDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          book={currentBook}
        />
      )}
      <div className="w-full md:w-3/4 p-8 bg-white">
        <div className="flex justify-between pb-8">
          <h1
            className="text-2xl"
            onClick={() => {
              toast("Hello World");
            }}
          >
            Books
          </h1>
          <Button
            onClick={() => {
              setModalOpen(true);
              setCurrentBook(undefined);
            }}
          >
            Add Book
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.id}</TableCell>
                <TableCell>
                  <Link to="/books/$bookId" params={{ bookId: book.id.toString() }}>
                    {book.title}
                  </Link>
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.year}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setModalOpen(true);
                          setCurrentBook(book);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setDeleteDialogOpen(true);
                          setCurrentBook(book);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
