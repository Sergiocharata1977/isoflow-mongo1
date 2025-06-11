// backend/routes/personal.routes.js
console.log('<<<<< personal.routes.js CARGADO >>>>>');
import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../lib/mongoClient.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Middleware para validar ObjectId
const validateObjectId = (idParam) => (req, res, next) => {
  const id = req.params[idParam];
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: `El ID '${id}' no es válido` });
  }
  req.objectId = new ObjectId(id);
  next();
};

// Middleware para validación de personal
const validatePersonal = async (req, res, next) => {
  const { nombre, apellido, dni, departamentoId, puestoId, legajo } = req.body;
  const errors = {};

  // Validaciones básicas de campos requeridos
  if (!nombre) errors.nombre = 'El nombre es requerido';
  if (!apellido) errors.apellido = 'El apellido es requerido';
  if (!dni) errors.dni = 'El DNI es requerido';
  if (!departamentoId) errors.departamentoId = 'El departamento es requerido';
  if (!puestoId) errors.puestoId = 'El puesto es requerido';
  if (!legajo) errors.legajo = 'El legajo es requerido';

  // Si hay errores básicos, devolver
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const db = getDB();
    
    // Verificar que el departamento existe
    if (departamentoId) {
      if (!ObjectId.isValid(departamentoId)) {
        errors.departamentoId = 'ID de departamento inválido';
      } else {
        const deptoExists = await db.collection('departamentos').findOne({ _id: new ObjectId(departamentoId) });
        if (!deptoExists) {
          errors.departamentoId = 'El departamento especificado no existe';
        }
      }
    }

    // Verificar que el puesto existe
    if (puestoId) {
      if (!ObjectId.isValid(puestoId)) {
        errors.puestoId = 'ID de puesto inválido';
      } else {
        const puesto = await db.collection('puestos').findOne({ _id: new ObjectId(puestoId) });
        if (!puesto) {
          errors.puestoId = 'El puesto especificado no existe';
        } 
        // Verificar que el puesto pertenece al departamento indicado
        else if (departamentoId && puesto.departamentoId.toString() !== departamentoId.toString()) {
          errors.puestoId = 'El puesto no pertenece al departamento indicado';
          console.log(`Error de coherencia: puesto ${puestoId} no pertenece al departamento ${departamentoId}`);
        }
      }
    }

    // Verificar DNI único (excepto si es actualización del mismo registro)
    if (dni) {
      const query = { dni };
      if (req.params.id && ObjectId.isValid(req.params.id)) {
        query._id = { $ne: new ObjectId(req.params.id) };
      }
      const existingDni = await db.collection('personal').findOne(query);
      if (existingDni) {
        errors.dni = 'Este DNI ya está registrado para otro empleado';
      }
    }

    // Verificar legajo único (excepto si es actualización del mismo registro)
    if (legajo) {
      const query = { legajo };
      if (req.params.id && ObjectId.isValid(req.params.id)) {
        query._id = { $ne: new ObjectId(req.params.id) };
      }
      const existingLegajo = await db.collection('personal').findOne(query);
      if (existingLegajo) {
        errors.legajo = 'Este número de legajo ya está en uso';
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    next();
  } catch (error) {
    console.error('Error en validación de personal:', error);
    res.status(500).json({ error: 'Error al validar los datos del personal' });
  }
};

// GET /api/personal - Obtener lista de personal con info de departamento y puesto
router.get('/', async (req, res) => {
  console.log('<<<<< ACCEDIENDO A RUTA GET /api/personal >>>>>');
  try {
    const db = getDB();
    // Usamos aggregation para obtener datos enriquecidos
    const personal = await db.collection('personal').aggregate([
      {
        $lookup: {
          from: 'departamentos',
          localField: 'departamentoId',
          foreignField: '_id',
          as: 'departamento'
        }
      },
      {
        $lookup: {
          from: 'puestos',
          localField: 'puestoId',
          foreignField: '_id',
          as: 'puesto'
        }
      },
      {
        $unwind: {
          path: '$departamento',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$puesto',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          nombre: 1,
          apellido: 1,
          dni: 1,
          legajo: 1,
          fechaIngreso: 1,
          departamentoId: 1,
          puestoId: 1,
          'departamento.nombre': 1,
          'puesto.nombre': 1
        }
      }
    ]).toArray();

    res.json(personal);
  } catch (error) {
    console.error('Error al obtener personal:', error);
    res.status(500).json({ error: 'Error al obtener la lista de personal' });
  }
});

// GET /api/personal/:id - Obtener detalles de un empleado específico
router.get('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const db = getDB();
    const personal = await db.collection('personal').aggregate([
      {
        $match: { _id: req.objectId }
      },
      {
        $lookup: {
          from: 'departamentos',
          localField: 'departamentoId',
          foreignField: '_id',
          as: 'departamento'
        }
      },
      {
        $lookup: {
          from: 'puestos',
          localField: 'puestoId',
          foreignField: '_id',
          as: 'puesto'
        }
      },
      {
        $unwind: {
          path: '$departamento',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$puesto',
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();

    if (personal.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.json(personal[0]);
  } catch (error) {
    console.error('Error al obtener detalles del empleado:', error);
    res.status(500).json({ error: 'Error al obtener los detalles del empleado' });
  }
});

// POST /api/personal - Crear nuevo empleado
router.post('/', validatePersonal, async (req, res) => {
  try {
    const db = getDB();
    const { nombre, apellido, dni, fechaIngreso, departamentoId, puestoId, legajo, ...otrosCampos } = req.body;

    // Crear objeto empleado con conversiones correctas de tipo
    const nuevoEmpleado = {
      nombre,
      apellido,
      dni,
      legajo,
      fechaIngreso: fechaIngreso ? new Date(fechaIngreso) : new Date(),
      departamentoId: new ObjectId(departamentoId),
      puestoId: new ObjectId(puestoId),
      fechaCreacion: new Date(),
      ...otrosCampos
    };

    const result = await db.collection('personal').insertOne(nuevoEmpleado);
    
    // Obtener el empleado recién creado con datos enriquecidos
    const empleadoCreado = await db.collection('personal').aggregate([
      {
        $match: { _id: result.insertedId }
      },
      {
        $lookup: {
          from: 'departamentos',
          localField: 'departamentoId',
          foreignField: '_id',
          as: 'departamento'
        }
      },
      {
        $lookup: {
          from: 'puestos',
          localField: 'puestoId',
          foreignField: '_id',
          as: 'puesto'
        }
      },
      {
        $unwind: {
          path: '$departamento',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$puesto',
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();

    res.status(201).json({ 
      message: 'Empleado creado con éxito',
      empleado: empleadoCreado[0] 
    });
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(500).json({ error: 'Error al crear el empleado' });
  }
});

// PUT /api/personal/:id - Actualizar empleado existente
router.put('/:id', validateObjectId('id'), validatePersonal, async (req, res) => {
  try {
    const db = getDB();
    const { nombre, apellido, dni, fechaIngreso, departamentoId, puestoId, legajo, ...otrosCampos } = req.body;

    const actualizaciones = {
      nombre,
      apellido,
      dni,
      legajo,
      fechaIngreso: fechaIngreso ? new Date(fechaIngreso) : undefined,
      departamentoId: departamentoId ? new ObjectId(departamentoId) : undefined,
      puestoId: puestoId ? new ObjectId(puestoId) : undefined,
      fechaActualizacion: new Date(),
      ...otrosCampos
    };

    // Eliminar campos undefined
    Object.keys(actualizaciones).forEach(key => 
      actualizaciones[key] === undefined && delete actualizaciones[key]
    );
    
    const result = await db.collection('personal').updateOne(
      { _id: req.objectId },
      { $set: actualizaciones }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    // Obtener el empleado actualizado con datos enriquecidos
    const empleadoActualizado = await db.collection('personal').aggregate([
      {
        $match: { _id: req.objectId }
      },
      {
        $lookup: {
          from: 'departamentos',
          localField: 'departamentoId',
          foreignField: '_id',
          as: 'departamento'
        }
      },
      {
        $lookup: {
          from: 'puestos',
          localField: 'puestoId',
          foreignField: '_id',
          as: 'puesto'
        }
      },
      {
        $unwind: {
          path: '$departamento',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$puesto',
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();

    res.json({ 
      message: 'Empleado actualizado con éxito',
      empleado: empleadoActualizado[0] 
    });
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ error: 'Error al actualizar el empleado' });
  }
});

// DELETE /api/personal/:id - Eliminar empleado
router.delete('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const db = getDB();
    
    // Primero verificar si existe
    const empleado = await db.collection('personal').findOne({ _id: req.objectId });
    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    
    // Luego eliminar
    await db.collection('personal').deleteOne({ _id: req.objectId });
    
    res.json({ 
      message: 'Empleado eliminado con éxito',
      empleado: { _id: req.params.id, ...empleado } 
    });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ error: 'Error al eliminar el empleado' });
  }
});

// POST /api/personal/register - Registrar nuevo usuario
// POST /api/personal/register - Registrar nuevo personal CON credenciales de usuario (opcionalmente)
router.post('/register', async (req, res) => {
  console.log('<<<<< ACCEDIENDO A RUTA POST /api/personal/register >>>>>');
  try {
    const db = getDB();
    const { nombre, apellido, email, password, role, dni, fechaIngreso, departamentoId, puestoId, legajo, ...otrosCampos } = req.body;
    let newUserDocument = {
      nombre,
      apellido,
      email: email || null,
      role: null,
      password: null,
      dni: dni || null,
      fechaIngreso: fechaIngreso ? new Date(fechaIngreso) : null,
      departamentoId: departamentoId ? new ObjectId(departamentoId) : null,
      puestoId: puestoId ? new ObjectId(puestoId) : null,
      legajo: legajo || null,
      ...otrosCampos,
      createdAt: new Date()
    };

    if (!nombre || !apellido) {
      return res.status(400).json({ error: 'Nombre y apellido son requeridos para el personal.' });
    }

    if (email && password) {
      const existingUser = await db.collection('personal').findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado para otro usuario.' });
      }
      const saltRounds = 10;
      newUserDocument.password = await bcrypt.hash(password, saltRounds);
      newUserDocument.role = role || 'user';
    } else if (email || password) {
      return res.status(400).json({ error: 'Para registrar un usuario, se requieren tanto email como contraseña.' });
    }

    const result = await db.collection('personal').insertOne(newUserDocument);
    
    const insertedUser = {
        _id: result.insertedId,
        ...newUserDocument
    };
    delete insertedUser.password;

    res.status(201).json({
      message: newUserDocument.password ? 'Personal registrado con éxito como usuario.' : 'Personal registrado con éxito (sin acceso al sistema).',
      personal: {
        id: insertedUser._id,
        nombre: insertedUser.nombre,
        apellido: insertedUser.apellido,
        email: insertedUser.email,
        role: insertedUser.role,
        dni: insertedUser.dni,
        legajo: insertedUser.legajo
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    if (error.message && (error.message.includes('departamentoId') || error.message.includes('puestoId')) && error.message.includes('ObjectId failed')){
        return res.status(400).json({ error: 'El departamentoId o puestoId proporcionado no es un ObjectId válido.' });
    }
    res.status(500).json({ error: 'Error interno del servidor durante el registro.', details: error.message });
  }
});

// GET /api/personal/departamento/:id - Obtener personal por departamento
router.get('/departamento/:id', validateObjectId('id'), async (req, res) => {
  try {
    const db = getDB();
    const personal = await db.collection('personal').aggregate([
      {
        $match: { departamentoId: req.objectId }
      },
      {
        $lookup: {
          from: 'departamentos',
          localField: 'departamentoId',
          foreignField: '_id',
          as: 'departamento'
        }
      },
      {
        $lookup: {
          from: 'puestos',
          localField: 'puestoId',
          foreignField: '_id',
          as: 'puesto'
        }
      },
      {
        $unwind: {
          path: '$departamento',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$puesto',
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();

    res.json(personal);
  } catch (error) {
    console.error('Error al obtener personal por departamento:', error);
    res.status(500).json({ error: 'Error al obtener el personal del departamento' });
  }
});

// POST /api/personal/login - Autenticar usuario
router.post('/login', async (req, res) => {
  console.log('<<<<< ACCEDIENDO A RUTA POST /api/personal/login >>>>>');
  try {
    const db = getDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario por email (asumiendo que el email es único y se usa para login)
    // Asegúrate de que el campo email exista en tu colección 'personal'
    const user = await db.collection('personal').findOne({ email });

    if (!user || !user.password) { // Verificar que el usuario exista Y TENGA UNA CONTRASEÑA (es decir, sea un usuario del sistema)
      return res.status(401).json({ error: 'Credenciales inválidas o usuario no habilitado para acceso.' });
    }

    // Comparar la contraseña proporcionada con la contraseña hasheada almacenada
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' }); // Contraseña incorrecta
    }

    // Login exitoso, devolver datos del usuario (excluyendo la contraseña)
    // Ajusta los campos devueltos según lo que necesite tu frontend
    res.json({
      id: user._id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      role: user.role || 'user' // Devolver el rol del usuario
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor durante el login' });
  }
});

export default router;
