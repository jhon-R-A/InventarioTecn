import { useState, useRef, useEffect } from "react";
import { Form, InputGroup, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  Wrench,
  PersonBadge,
  Upc,
  CardText,
  Camera,
  X,
  Save,
  Eraser,
  CheckCircleFill,
  ExclamationCircleFill,
  Clipboard2Check,
  PlusCircle,
} from "react-bootstrap-icons";

const INITIAL_VALUES = {
  nombre: "",
  codigo: "",
  descripcion: "",
};

const MAX_FILE_MB = 5;
const MAX_DESCRIPTION = 500;

/* Mensaje de error debajo de cada campo */
function FieldError({ id, message }) {
  if (!message) return null;

  return (
    <div id={id} className="field-error" role="alert">
      <ExclamationCircleFill />
      <span>{message}</span>
    </div>
  );
}

/*
  Props:
  - onSave(formData): función opcional (puede ser async) que recibe un
    FormData con: nombre, codigo, foto y descripcion.
    Si no la pasas, el formulario muestra los datos en la consola.
*/
function FormReparacion({ onSave }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileRef = useRef(null);

  // Libera la URL de la vista previa cuando cambia o se desmonta
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* ---------- Campos de texto ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSaved(false);
  };

  /* ---------- Foto ---------- */
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, foto: "El archivo debe ser una imagen (JPG, PNG o WEBP)." }));
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, foto: `La imagen no puede pesar más de ${MAX_FILE_MB} MB.` }));
      e.target.value = "";
      return;
    }

    setFoto(file);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, foto: undefined }));
    setSaved(false);
  };

  const removeFoto = () => {
    setFoto(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ---------- Validación ---------- */
  const validate = () => {
    const next = {};

    if (values.nombre.trim().length < 3) {
      next.nombre = "Escribe el nombre completo del técnico.";
    }

    if (!/^[A-Za-z0-9-]{3,15}$/.test(values.codigo.trim())) {
      next.codigo = "Usa de 3 a 15 caracteres: letras, números o guion (ej: TEC-0142).";
    }

    if (!foto) {
      next.foto = "Sube una foto del componente cambiado.";
    }

    if (values.descripcion.trim().length < 15) {
      next.descripcion = "Describe la reparación con al menos 15 caracteres.";
    }

    return next;
  };

  /* ---------- Limpiar ---------- */
  const resetForm = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    removeFoto();
  };

  const handleClear = () => {
    resetForm();
    setSaved(false);
  };

  /* ---------- Guardar ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);

    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      const firstField = ["nombre", "codigo", "foto", "descripcion"].find(
        (key) => found[key]
      );
      document.getElementById(firstField)?.focus();
      return;
    }

    const data = new FormData();
    data.append("nombre", values.nombre.trim());
    data.append("codigo", values.codigo.trim().toUpperCase());
    data.append("foto", foto);
    data.append("descripcion", values.descripcion.trim());

    setSaving(true);

    try {
      if (onSave) {
        await onSave(data);
      } else {
        console.log("Reparación:", Object.fromEntries(data));
      }

      resetForm();
      setSaved(true);
    } catch (error) {
      setErrors({ general: "No se pudo guardar el registro. Inténtalo de nuevo." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid" id="formulario-producto">
      {/* Encabezado */}
       <div className="full-box page-header">

        <h3 className="text-left">

          <Wrench />

          &nbsp; Registrar reparación

        </h3>


        <p className="text-justify">

          Completa los datos del técnico y del componente cambiado.

        </p>

      </div>
       {/* ==========================================
          PESTAÑAS
      ========================================== */}

      <div className="container-fluid">

        <ul className="full-box list-unstyled page-nav-tabs">

          <li>

            <Link
              to="/CreateReparacion"
              className="active"
            >

             <PlusCircle />

              &nbsp; AGREGAR REPARACIÓN

            </Link>

          </li>


          <li>

            <Link to="/TableReparacion" >
                  
              <Clipboard2Check />

              &nbsp; LISTA DE REPARACIONES

            </Link>

          </li>

        </ul>

      </div>

      <Form
        noValidate
        className="form-neon form-reparacion"
        onSubmit={handleSubmit}
      >
        {/* Mensajes generales */}
        {saved && (
          <div className="form-alert form-alert-ok" role="status">
            <CheckCircleFill />
            <span>La reparación se guardó correctamente.</span>
          </div>
        )}

        {errors.general && (
          <div className="form-alert form-alert-error" role="alert">
            <ExclamationCircleFill />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Nombre + código */}
        <Row>
          <Col md={7}>
            <Form.Group className="mb-4">
              <Form.Label htmlFor="nombre">
                Nombre del técnico <span className="required">*</span>
              </Form.Label>

              <InputGroup>
                <InputGroup.Text>
                  <PersonBadge />
                </InputGroup.Text>

                <Form.Control
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Ej: Nombre del Técnico"
                  value={values.nombre}
                  onChange={handleChange}
                  isInvalid={!!errors.nombre}
                  aria-describedby="nombre-error"
                  autoComplete="off"
                />
              </InputGroup>

              <FieldError id="nombre-error" message={errors.nombre} />
            </Form.Group>
          </Col>

          <Col md={5}>
            <Form.Group className="mb-4">
              <Form.Label htmlFor="codigo">
                Código del técnico <span className="required">*</span>
              </Form.Label>

              <InputGroup>
                <InputGroup.Text>
                  <Upc />
                </InputGroup.Text>

                <Form.Control
                  id="codigo"
                  name="codigo"
                  type="text"
                  placeholder="Ej: TEC-0142"
                  value={values.codigo}
                  onChange={handleChange}
                  isInvalid={!!errors.codigo}
                  aria-describedby="codigo-error"
                  autoComplete="off"
                />
              </InputGroup>

              <FieldError id="codigo-error" message={errors.codigo} />
            </Form.Group>
          </Col>
        </Row>

        {/* Foto */}
        <Form.Group className="mb-4">
          <Form.Label htmlFor="foto">
            Foto del componente cambiado <span className="required">*</span>
          </Form.Label>

          <input
            id="foto"
            ref={fileRef}
            type="file"
            accept="image/*"
            className="upload-input visually-hidden"
            onChange={handleFile}
            aria-describedby="foto-error"
          />

          {preview ? (
            <div className="upload-preview">
              <img src={preview} alt="Vista previa del componente cambiado" />

              <button
                type="button"
                className="upload-remove"
                onClick={removeFoto}
                aria-label="Quitar foto"
              >
                <X />
              </button>

              <small>
                {foto.name} · {(foto.size / 1024 / 1024).toFixed(2)} MB
              </small>
            </div>
          ) : (
            <label
              htmlFor="foto"
              className={`upload-box ${errors.foto ? "is-invalid" : ""}`}
            >
              <Camera />
              <span className="upload-title">Haz clic para subir una foto</span>
              <span className="upload-hint">
                JPG, PNG o WEBP · máximo {MAX_FILE_MB} MB
              </span>
            </label>
          )}

          <FieldError id="foto-error" message={errors.foto} />
        </Form.Group>

        {/* Descripción */}
        <Form.Group className="mb-2">
          <Form.Label htmlFor="descripcion">
            Descripción de la reparación <span className="required">*</span>
          </Form.Label>

          <InputGroup className="input-group-textarea">
            <InputGroup.Text>
              <CardText />
            </InputGroup.Text>

            <Form.Control
              as="textarea"
              rows={5}
              id="descripcion"
              name="descripcion"
              maxLength={MAX_DESCRIPTION}
              placeholder="Ej: Se reemplazó la fuente de poder de 500W por falla en el voltaje de salida. Se probó el equipo durante 30 minutos y quedó funcionando correctamente."
              value={values.descripcion}
              onChange={handleChange}
              isInvalid={!!errors.descripcion}
              aria-describedby="descripcion-error"
            />
          </InputGroup>

          <div className="field-meta">
            <FieldError id="descripcion-error" message={errors.descripcion} />

            <span className="field-counter">
              {values.descripcion.length}/{MAX_DESCRIPTION}
            </span>
          </div>
        </Form.Group>

        {/* Botones */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-clear"
            onClick={handleClear}
            disabled={saving}
          >
            <Eraser />
            Limpiar campos
          </button>

          <button type="submit" className="btn btn-save" disabled={saving}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" />
                Guardando...
              </>
            ) : (
              <>
                <Save />
                Guardar
              </>
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}

export default FormReparacion;
