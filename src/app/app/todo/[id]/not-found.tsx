export default function TodoItemErrorPage() {
  return (
    <div className="px-8 py-16 flex flex-col gap-2">
      <h1 className="h1">Todo Item Not Found</h1>
      <p>
        You either don't have access to view this resource, or it doesn't exist
      </p>
    </div>
  );
}
