import { Card, CardContent } from "@/components/ui/card";

interface CommandCardProps {
  title: string;
  syntax: string;
  example: string;
  response: string;
  note?: string;
}

export default function CommandCard({ title, syntax, example, response, note }: CommandCardProps) {
  return (
    <Card className="bg-discord-secondary border-none">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-discord-text-header mb-2">{title}</h3>
        <div className="mb-3">
          <p className="text-sm text-discord-text-muted mb-1">Command Syntax:</p>
          <p className="command-syntax">{syntax}</p>
        </div>
        <div className="mb-3">
          <p className="text-sm text-discord-text-muted mb-1">Example:</p>
          <div className="bg-discord-tertiary p-2 rounded-md">
            <p><span className="text-discord-text-muted">User: </span>{example}</p>
            <div className="mt-2 border-l-4 border-discord-accent pl-2 py-1">
              <p className="whitespace-pre-line">
                <span className="text-discord-text-muted">Bot: </span>
                {response}
              </p>
            </div>
          </div>
        </div>
        {note && <p className="text-sm text-discord-text-muted">{note}</p>}
      </CardContent>
    </Card>
  );
}
