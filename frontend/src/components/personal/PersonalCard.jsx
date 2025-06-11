import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import { motion } from "framer-motion";

function PersonalCard({ person, onView, onEdit, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
        onClick={() => onView(person)}
      >
        <div className="aspect-square relative">
          <img 
            className="w-full h-full object-cover"
            alt={`Foto de ${person.nombre}`}
            src={person.imagen || "/images/personal/v3_0277343.jpg"}
            loading="lazy"
            onError={(e) => {
              e.target.src = "/images/personal/v3_0277343.jpg";
            }}
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold truncate">{person.nombre}</h3>
          <p className="text-sm text-muted-foreground truncate">{person.puesto?.nombre}</p>
          <p className="text-sm text-muted-foreground truncate">{person.departamento?.nombre}</p>
          
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-50 hover:bg-blue-100 border-blue-200"
              onClick={(e) => {
                e.stopPropagation();
                onView(person);
              }}
            >
              <Eye className="h-4 w-4 mr-1 text-blue-600" />
              <span className="text-blue-600">Ver</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-green-50 hover:bg-green-100 border-green-200"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(person);
              }}
            >
              <Pencil className="h-4 w-4 mr-1 text-green-600" />
              <span className="text-green-600">Editar</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-red-50 hover:bg-red-100 border-red-200"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(person._id);
              }}
            >
              <Trash2 className="h-4 w-4 mr-1 text-red-600" />
              <span className="text-red-600">Borrar</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default PersonalCard;
