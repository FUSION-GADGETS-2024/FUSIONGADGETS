import { Star } from "lucide-react";

interface ReviewCardProps {
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export const ReviewCard = ({ author, rating, date, comment, verified }: ReviewCardProps) => {
  return (
    <div className="border border-border rounded-lg p-6 bg-surface">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-foreground">{author}</h4>
            {verified && (
              <span className="text-xs text-success font-medium">Verified Purchase</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < rating ? 'fill-accent text-accent' : 'text-border'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-text-tertiary">{date}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">{comment}</p>
    </div>
  );
};