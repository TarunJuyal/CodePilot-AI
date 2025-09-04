import { Loader2 } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <Loader2 className="h-24 w-3xl animate-spin text-muted-foreground" />
    </div>
  );
}
