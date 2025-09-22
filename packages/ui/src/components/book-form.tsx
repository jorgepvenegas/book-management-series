import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { submitBook, updateBook } from "@/data/books";
import { queryClient } from "@/main";
import toast from "react-hot-toast";
import {
  createBookSchema,
  type BookSchema,
  type CreateBookSchema,
} from "@books/api/schemas";

interface BookFormProps {
  book?: BookSchema;
  onOpenChange: (open: boolean) => void;
}

function BookForm({ book, onOpenChange }: BookFormProps) {
  const bookForm = useForm<CreateBookSchema>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: book ? book.title : "",
      author: book ? book.author : "",
      year: book ? book.year : 2025,
    },
  });

  useEffect(() => {
    bookForm.reset(book);
  }, [book]);

  const createBookMutation = useMutation({
    mutationFn: submitBook,
    onSuccess: () => {
      toast.success("Book has been created successfully!");
      queryClient.invalidateQueries({ queryKey: ["books"] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Oops, something went wrong");
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      toast.success("Book has been updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["books"] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Oops, something went wrong");
    },
  });

  const onSubmit = (values: CreateBookSchema) => {
    if (book) {
      updateBookMutation.mutate({
        id: book.id,
        author: values.author,
        title: values.title,
        year: values.year,
      });
    } else {
      createBookMutation.mutate({
        author: values.author,
        title: values.title,
        year: values.year,
      });
    }
  };

  return (
    <Form {...bookForm}>
      <form onSubmit={bookForm.handleSubmit(onSubmit)}>
        <FormField
          control={bookForm.control}
          name="title"
          render={({ field }) => (
            <FormItem className="py-3">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={bookForm.control}
          name="author"
          render={({ field }) => (
            <FormItem className="py-3">
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Author" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={bookForm.control}
          name="year"
          render={({ field }) => (
            <FormItem className="py-3">
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input
                  placeholder="1998"
                  type="number"
                  {...field}
                  onChange={(e) => {
                    field.onChange(parseInt(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-3">
          <Button className="py-3" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default BookForm;
