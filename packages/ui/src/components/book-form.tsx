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

const bookSchema = z.object({
  id: z.optional(z.number()),
  title: z.string().min(5, {
    message: "Title should be at least 1 character",
  }),
  author: z.string().min(10).max(200),
});

export type Book = z.infer<typeof bookSchema>;

interface BookFormProps {
  book?: Book;
}

function BookForm({ book }: BookFormProps) {
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

  const onSubmit = (values: z.infer<typeof bookSchema>) => {
    console.log(values);
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
