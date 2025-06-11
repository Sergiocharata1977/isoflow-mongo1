
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  MessageSquare,
  Send,
  Paperclip,
  Image as ImageIcon,
  Trash2
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";

function CommentSection({ recordId, recordType }) {
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem(`comments_${recordType}_${recordId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    try {
      setIsUploading(true);
      
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };

      const compressedFiles = await Promise.all(
        acceptedFiles.map(async file => {
          if (file.type.startsWith("image/")) {
            return await imageCompression(file, options);
          }
          return file;
        })
      );

      const fileUrls = await Promise.all(
        compressedFiles.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve({
              url: reader.result,
              type: file.type,
              name: file.name
            });
            reader.readAsDataURL(file);
          });
        })
      );

      addComment("", fileUrls);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5242880 // 5MB
  });

  const addComment = (text = newComment, attachments = []) => {
    if (!text && attachments.length === 0) return;

    const comment = {
      id: Date.now(),
      text,
      attachments,
      author: "Usuario Actual",
      timestamp: new Date().toISOString()
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(
      `comments_${recordType}_${recordId}`,
      JSON.stringify(updatedComments)
    );
    setNewComment("");
  };

  const deleteComment = (commentId) => {
    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem(
      `comments_${recordType}_${recordId}`,
      JSON.stringify(updatedComments)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          {comments.length} Comentarios
        </Button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex space-x-4"
              >
                <Avatar className="h-8 w-8">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author)}`}
                    alt={comment.author}
                    className="h-full w-full object-cover"
                  />
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{comment.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(comment.timestamp), "d 'de' MMMM 'a las' HH:mm", { locale: es })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteComment(comment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {comment.attachments && comment.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {comment.attachments.map((attachment, index) => (
                          <div key={index}>
                            {attachment.type.startsWith("image/") ? (
                              <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="max-w-full rounded-lg"
                              />
                            ) : (
                              <div className="flex items-center space-x-2 p-2 bg-background rounded-lg">
                                <Paperclip className="h-4 w-4" />
                                <span className="text-sm truncate">
                                  {attachment.name}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {comment.text && (
                      <p className="mt-2 text-sm whitespace-pre-line">
                        {comment.text}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Comment Input */}
          <div className="flex space-x-4">
            <Avatar className="h-8 w-8">
              <img
                src="https://ui-avatars.com/api/?name=Usuario+Actual"
                alt="Usuario Actual"
                className="h-full w-full object-cover"
              />
            </Avatar>
            <div className="flex-1">
              <div className="relative">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="min-h-[100px]"
                />
                <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={isUploading}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => addComment()}
                    disabled={!newComment.trim() && !isUploading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default CommentSection;
