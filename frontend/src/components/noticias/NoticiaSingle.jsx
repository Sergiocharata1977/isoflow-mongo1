
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  FileText,
  Pencil,
  Trash2,
  Calendar,
  User
} from "lucide-react";

function NoticiaSingle({ noticia, onBack, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Noticias
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onEdit(noticia)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => {
            onDelete(noticia.id);
            onBack();
          }}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Header Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{noticia.titulo}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(noticia.fecha_publicacion).toLocaleDateString()}
                </span>
                <span className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-1" />
                  {noticia.autor}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Imagen destacada */}
        {noticia.imagen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            <img
              src={noticia.imagen}
              alt={noticia.titulo}
              className="w-full h-auto max-h-[400px] object-cover"
            />
          </motion.div>
        )}

        {/* Contenido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-line">{noticia.contenido}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default NoticiaSingle;
