import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Pagination,
  Modal,
  Toast,
  ToastContainer,
  Spinner,
} from "react-bootstrap";

import {
  Clipboard2Check,
  PlusCircle,
  ArrowRepeat,
  Trash,
  Image,
  ExclamationTriangleFill,
  CheckCircleFill,
  ExclamationCircleFill,
  X,Wrench
} from "react-bootstrap-icons";

/* Devuelve los números de página a mostrar: 1 … 4 5 6 … 12 */
function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("start-ellipsis");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("end-ellipsis");

  pages.push(total);
  return pages;
}

/*
  Props (mismos nombres que TablaProduct):
  - reparaciones: arreglo de { id, nombre, codigo, foto, descripcion }
  - onActualizar(item): se llama al pulsar el botón de actualizar
  - onEliminar(id):     se llama al CONFIRMAR la eliminación
                        (puede ser async; si lanza error se muestra alerta roja)
  - pageSize:           filas por página (por defecto 5)
  - encabezado:         muestra el título y las pestañas (por defecto true)
  - crearPath / listaPath: rutas de las pestañas
*/
function TablaReparaciones({
  reparaciones = [],
  onActualizar,
  onEliminar,
  pageSize = 5,
  encabezado = true,
  crearPath = "/CreateReparacion",
  listaPath = "/TableReparacion",
}) {
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showToast, setShowToast] = useState(false);

  /* ---------- Paginación ---------- */
  const total = reparaciones.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages); // si se borra la última fila de una página, retrocede sola
  const startIndex = (current - 1) * pageSize;
  const visible = reparaciones.slice(startIndex, startIndex + pageSize);

  const from = total === 0 ? 0 : startIndex + 1;
  const to = startIndex + visible.length;

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  /* ---------- Eliminar ---------- */
  const openToast = (type, message) => {
    setToast({ type, message });
    setShowToast(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;

    setDeleting(true);

    try {
      await onEliminar?.(toDelete.id);
      openToast(
        "success",
        `Se eliminó la reparación de ${toDelete.nombre} (${toDelete.codigo}).`
      );
    } catch (error) {
      openToast("error", "No se pudo eliminar el registro. Inténtalo de nuevo.");
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  const closeModal = () => {
    if (!deleting) setToDelete(null);
  };

  return (
    <div className="container-fluid" id="lista-reparaciones">
      {encabezado && (
        <>
          {/* ==========================================
              ENCABEZADO
          ========================================== */}
          <div className="full-box page-header">
            <h3 className="text-left">
              <Wrench />
              &nbsp; LISTA DE REPARACIONES
            </h3>

            <p className="text-justify">
              Consulta las reparaciones registradas por los técnicos. Puedes
              actualizar y eliminar cada registro.
            </p>
          </div>

          {/* ==========================================
              PESTAÑAS
          ========================================== */}
          <div className="container-fluid">
            <ul className="full-box list-unstyled page-nav-tabs">
              <li>
                <Link to={crearPath}>
                  <PlusCircle />
                  &nbsp; AGREGAR REPARACIÓN
                </Link>
              </li>

              <li>
                <Link to={listaPath} className="active">
                  <Clipboard2Check />
                  &nbsp; LISTA DE REPARACIONES
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}

      {/* ==========================================
          TABLA
      ========================================== */}
      <div className="table-responsive">
        <table className="table table-dark table-sm align-middle">
          <thead>
            <tr className="text-center roboto-medium">
              <th>#</th>
              <th>FOTO</th>
              <th>TÉCNICO</th>
              <th>CÓDIGO</th>
              <th>DESCRIPCIÓN</th>
              <th>ACTUALIZAR</th>
              <th>ELIMINAR</th>
            </tr>
          </thead>

          <tbody>
            {visible.length === 0 ? (
              <tr className="text-center">
                <td colSpan="7">No hay reparaciones registradas.</td>
              </tr>
            ) : (
              visible.map((item, index) => (
                <tr key={item.id} className="text-center">
                  <td>{startIndex + index + 1}</td>

                  <td>
                    {item.foto ? (
                      <img
                        src={item.foto}
                        alt={`Componente cambiado por ${item.nombre}`}
                        className="tabla-thumb mx-auto"
                        loading="lazy"
                      />
                    ) : (
                      <span className="tabla-thumb tabla-thumb-empty mx-auto">
                        <Image />
                      </span>
                    )}
                  </td>

                  <td>{item.nombre}</td>
                  <td>{item.codigo}</td>

                  <td>
                    <p className="tabla-desc mx-auto" title={item.descripcion}>
                      {item.descripcion}
                    </p>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      title="Actualizar reparación"
                      aria-label={`Actualizar reparación de ${item.nombre}`}
                      onClick={() => onActualizar?.(item)}
                    >
                      <ArrowRepeat />
                    </button>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      title="Eliminar reparación"
                      aria-label={`Eliminar reparación de ${item.nombre}`}
                      onClick={() => setToDelete(item)}
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ==========================================
          PAGINADOR
      ========================================== */}
      {total > 0 && (
        <footer className="tabla-footer">
          <span className="tabla-info">
            Mostrando {from}–{to} de {total}
          </span>

          <Pagination className="paginador mb-0">
            <Pagination.Prev
              disabled={current === 1}
              onClick={() => goTo(current - 1)}
            />

            {getPageNumbers(current, totalPages).map((p) =>
              typeof p === "number" ? (
                <Pagination.Item
                  key={p}
                  active={p === current}
                  onClick={() => goTo(p)}
                >
                  {p}
                </Pagination.Item>
              ) : (
                <Pagination.Ellipsis key={p} disabled />
              )
            )}

            <Pagination.Next
              disabled={current === totalPages}
              onClick={() => goTo(current + 1)}
            />
          </Pagination>
        </footer>
      )}

      {/* ==========================================
          MODAL DE CONFIRMACIÓN
      ========================================== */}
      <Modal
        show={Boolean(toDelete)}
        onHide={closeModal}
        centered
        contentClassName="modal-confirm"
      >
        <Modal.Body>
          <span className="modal-confirm-icon">
            <ExclamationTriangleFill />
          </span>

          <h4>¿Eliminar esta reparación?</h4>

          {toDelete && (
            <div className="modal-confirm-item">
              {toDelete.foto ? (
                <img src={toDelete.foto} alt="" className="tabla-thumb" />
              ) : (
                <span className="tabla-thumb tabla-thumb-empty">
                  <Image />
                </span>
              )}

              <div>
                <strong>{toDelete.nombre}</strong>
                <span>{toDelete.codigo}</span>
              </div>
            </div>
          )}

          <p>Esta acción no se puede deshacer.</p>

          <div className="modal-confirm-actions">
            <button
              type="button"
              className="btn btn-cancelar"
              onClick={closeModal}
              disabled={deleting}
            >
              <X />
              Cancelar
            </button>

            <button
              type="button"
              className="btn btn-eliminar"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Spinner animation="border" size="sm" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash />
                  Sí, eliminar
                </>
              )}
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* ==========================================
          ALERTA DE RESULTADO (éxito / error)
      ========================================== */}
      <ToastContainer
        position="top-end"
        className="position-fixed p-3 toast-zone"
      >
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={4500}
          autohide
          className={`toast-alert toast-${toast?.type ?? "success"}`}
        >
          <Toast.Body>
            {toast?.type === "error" ? (
              <ExclamationCircleFill />
            ) : (
              <CheckCircleFill />
            )}

            <span>{toast?.message}</span>

            <button
              type="button"
              className="toast-close"
              onClick={() => setShowToast(false)}
              aria-label="Cerrar alerta"
            >
              <X />
            </button>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default TablaReparaciones;
