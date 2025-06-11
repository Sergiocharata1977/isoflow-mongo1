
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { Camera, Trash2 } from "lucide-react";

function NoticiaModal({ isOpen, onClose, onSave, noticia }) {
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    imagen: null,
    imagenPreview: null
  });

  useEffect(() => {
    if (noticia) {
      setFormData({
        ...noticia,
        imagenPreview: noticia.imagen
      });
    } else {
      setFormData({
        titulo: "",
        contenido: "",
        imagen: null,
        imagenPreview: null
      });
    }
  }, [noticia]);

  const onDrop = async (acceptedFiles) => {
    try {
      const file = acceptedFiles[0];
      
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imagen: reader.result,
          imagenPreview: reader.result
        }));
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {noticia ? "Editar Noticia" : "Nueva Noticia"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Imagen destacada */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                {...getRootProps()}
                className="w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-primary/50 hover:border-primary transition-colors cursor-pointer flex items-center justify-center bg-muted"
              >
                <input {...getInputProps()} />
                {formData.imagenPreview ? (
                  <img
                    src={formData.imagenPreview}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Haz clic para subir una imagen destacada
                    </p>
                  </div>
                )}
              </div>
              {formData.imagenPreview && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData(prev => ({
                      ...prev,
                      imagen: null,
                      imagenPreview: null
                    }));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contenido">Contenido</Label>
            <Textarea
              id="contenido"
              value={formData.contenido}
              onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
              required
              className="min-h-[200px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {noticia ? "Guardar Cambios" : "Publicar Noticia"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NoticiaModal;
