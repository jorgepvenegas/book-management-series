import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BookForm, { type Book } from "./book-form";

function BookModal({
  open,
  onOpenChange,
  book,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{book ? "Edit book" : "Add book"}</DialogTitle>
          <DialogDescription>A form for books</DialogDescription>
          <BookForm onOpenChange={onOpenChange} book={book} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default BookModal;
