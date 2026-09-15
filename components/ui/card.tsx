import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  BookOpen,
  ExternalLink,
  Download,
  FileText,
} from "lucide-react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-md border border-neutral-200 bg-white shadow-sm overflow-hidden",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight text-heading-1 font-poppins",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-body text-neutral-700", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export interface CourseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: number;
  image?: string;
}

const CourseCard = React.forwardRef<HTMLDivElement, CourseCardProps>(
  (
    {
      className,
      title,
      description,
      level,
      duration,
      modules,
      image,
      ...props
    },
    ref,
  ) => (
    <Card
      ref={ref}
      className={cn("hover:shadow-md transition-shadow", className)}
      {...props}
    >
      {image && (
        <div className="aspect-video w-full overflow-hidden">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-heading-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-wrap gap-2 text-small text-neutral-500">
        <span className="flex items-center gap-1">
          <BookOpen className="h-4.5 w-4.5" />
          {level}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4.5 w-4.5" />
          {duration}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-4.5 w-4.5" />
          {modules} modules
        </span>
      </CardFooter>
    </Card>
  ),
);
CourseCard.displayName = "CourseCard";

export interface VideoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  lesson: string;
  timestamp: string;
  thumbnail?: string;
}

const VideoCard = React.forwardRef<HTMLDivElement, VideoCardProps>(
  (
    { className, title, description, lesson, timestamp, thumbnail, ...props },
    ref,
  ) => (
    <Card
      ref={ref}
      className={cn("hover:shadow-md transition-shadow", className)}
      {...props}
    >
      {thumbnail && (
        <div className="aspect-video w-full overflow-hidden relative">
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge variant="video">Video</Badge>
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-heading-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between text-small text-neutral-500">
        <span>{lesson}</span>
        <span className="flex items-center gap-1">
          <Clock className="h-4.5 w-4.5" />
          {timestamp}
        </span>
      </CardFooter>
    </Card>
  ),
);
VideoCard.displayName = "VideoCard";

export interface LessonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  module: string;
  externalLink?: string;
}

const LessonCard = React.forwardRef<HTMLDivElement, LessonCardProps>(
  ({ className, title, description, module, externalLink, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn("hover:shadow-md transition-shadow", className)}
      {...props}
    >
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="lesson">Lesson</Badge>
        </div>
        <CardTitle className="text-heading-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between text-small text-neutral-500">
        <span>{module}</span>
        {externalLink && (
          <a
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary-accent hover:underline"
          >
            View lesson
            <ExternalLink className="h-4.5 w-4.5" />
          </a>
        )}
      </CardFooter>
    </Card>
  ),
);
LessonCard.displayName = "LessonCard";

export interface StudyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  downloadLink?: string;
}

const StudyCard = React.forwardRef<HTMLDivElement, StudyCardProps>(
  (
    {
      className,
      title,
      description,
      fileType,
      fileSize,
      downloadLink,
      ...props
    },
    ref,
  ) => (
    <Card
      ref={ref}
      className={cn("hover:shadow-md transition-shadow", className)}
      {...props}
    >
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-neutral-500" />
        </div>
        <CardTitle className="text-heading-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between text-small text-neutral-500">
        <span className="flex items-center gap-2">
          <span className="uppercase font-medium">{fileType}</span>
          <span>·</span>
          <span>{fileSize}</span>
        </span>
        {downloadLink && (
          <a
            href={downloadLink}
            download
            className="flex items-center gap-1 text-primary-accent hover:underline"
          >
            <Download className="h-4.5 w-4.5" />
          </a>
        )}
      </CardFooter>
    </Card>
  ),
);
StudyCard.displayName = "StudyCard";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CourseCard,
  VideoCard,
  LessonCard,
  StudyCard,
};
