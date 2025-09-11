import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { deleteBook } from "@/data/books";
import { queryClient } from "@/main";
import type { BookSchema } from "@books/api/schemas";

interface DeleteBookDialogProps {
  book: BookSchema;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

function DeleteBookDialog({ book, ...props }: DeleteBookDialogProps) {
  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const handleClick = () => {
    deleteBookMutation.mutate(book.id!);
  };

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm delete</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <span className="font-bold">{book.title}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteBookDialog;
