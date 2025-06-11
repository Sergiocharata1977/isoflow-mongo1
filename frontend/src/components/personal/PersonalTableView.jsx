import React from "react";
import { Button } from "../../components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function PersonalTableView({ data, onView, onEdit, onDelete }) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-2 text-left">Foto</th>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Puesto</th>
            <th className="p-2 text-left">Departamento</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {data.map(person => (
              <motion.tr
                key={person._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-b hover:bg-muted/50 cursor-pointer"
                onClick={() => onView(person)}
              >
                <td className="p-4">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img
                      src={person.imagen || "/images/personal/v3_0277343.jpg"}
                      alt={person.nombre}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = "/images/personal/v3_0277343.jpg";
                      }}
                    />
                  </div>
                </td>
                <td className="p-4 font-medium">{person.nombre}</td>
                <td className="p-4">{person.puesto}</td>
                <td className="p-4">{person.departamento}</td>
                <td className="p-4">{person.email}</td>
                <td className="p-4 text-right space-x-2">
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
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

export default PersonalTableView;
