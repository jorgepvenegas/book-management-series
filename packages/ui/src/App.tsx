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

const testData: Book[] = [
  {
    id: 1,
    title: "Love in the Time of Cholera",
    author: "Gabriel García Márquez",
  },
  {
    id: 2,
    title: "Gulliver’s Travels",
    author: "Jonathan Swift",
  },
  {
    id: 3,
    title: "To the Lighthouse",
    author: "Virginia Woolf",
  },
];

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testData.map((book) => (
              <TableRow>
                <TableCell className="font-medium">{book.id}</TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
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
