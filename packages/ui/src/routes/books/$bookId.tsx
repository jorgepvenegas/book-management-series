import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchBook } from "@/data/books";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Calendar, Hash, User } from "lucide-react";

export const Route = createFileRoute("/books/$bookId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { bookId } = Route.useParams();
  const { data: book } = useQuery({
    queryKey: ["book"],
    queryFn: () => fetchBook(Number(bookId)),
  });

  if (!book) {
    return (
      <div className="w-full flex justify-center h-screen bg-white">
        <div className="w-full md:w-3/4 p-8">
          <h1 className="text-xl text-red-600">Book not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex h-screen justify-center">
      <div className="w-full md:w-3/4 p-8 bg-white">
        <div className="flex justify-between gap-3 flex-row">
          <div className="flex gap-3 flex-row">
            <div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2 text-balance">
                {book.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">by {book.author}</p>
            </div>
          </div>
          <div>
            <Link to="/books">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Books
              </Button>
            </Link>
          </div>
        </div>
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Book Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">ID</div>
                <div className="text-foreground">{book.id}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Title</div>
                <div className="text-foreground">{book.title}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Author</div>
                <div className="text-foreground">{book.author}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Published</div>
                <div className="text-foreground">{book.year}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
