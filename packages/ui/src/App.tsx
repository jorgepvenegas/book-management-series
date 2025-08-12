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

import { Button } from "./components/ui/button";
import { EllipsisIcon } from "lucide-react";
import { useState } from "react";
import BookModal from "./components/book-modal";
import { type Book } from "./components/book-form";
import DeleteBookDialog from "./components/delete-book-dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchBooks } from "./data/books";

const testData: Book[] = [
  {
    id: 1,
    title: "Love in the Time of Cholera",
    year: 2000,
    author: "Gabriel García Márquez",
  },
  {
    id: 2,
    title: "Gulliver’s Travels",
    year: 2000,
    author: "Jonathan Swift",
  },
  {
    id: 3,
    title: "To the Lighthouse",
    year: 2020,
    author: "Virginia Woolf",
  },
];

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: books } = useQuery<Array<Book>>({
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
      <div className="w-3/4 p-8 bg-white">
        <div className="flex justify-between pb-8">
          <h1 className="text-2xl">Books</h1>
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
                <TableCell>{book.title}</TableCell>
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

export default App;
