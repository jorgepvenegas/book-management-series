import { useForm } from "react-hook-form";
import { z } from "zod";
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

const bookSchema = z.object({
  id: z.optional(z.number()),
  title: z.string().min(5, {
    message: "Title should be at least 1 character",
  }),
  author: z.string().min(10).max(200),
  year: z.coerce.number(),
});

export type Book = z.infer<typeof bookSchema>;

interface BookFormProps {
  book?: Book;
  onOpenChange: (open: boolean) => void;
}

function BookForm({ book, onOpenChange }: BookFormProps) {
  const bookForm = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      id: book ? book.id : undefined,
      title: book ? book.title : "",
      author: book ? book.author : "",
    },
  });

  useEffect(() => {
    bookForm.reset(book);
  }, [book]);

  const createBookMutation = useMutation({
    mutationFn: submitBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      onOpenChange(false);
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      onOpenChange(false);
    },
  });

  const onSubmit = (values: z.infer<typeof bookSchema>) => {
    if (values.id) {
      updateBookMutation.mutate({
        author: values.author,
        id: values.id,
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
                <Input placeholder="1998" {...field} />
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
