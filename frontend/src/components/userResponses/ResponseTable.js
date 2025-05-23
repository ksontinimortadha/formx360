import React, { useState } from "react";
import { Button } from "react-bootstrap";
import {
  FaRegArrowAltCircleUp,
  FaRegArrowAltCircleDown,
  FaPencilAlt,
  FaTrash,
} from "react-icons/fa";
import EditResponseModal from "../../modals/EditResponseModal";
import ConfirmDeleteModal from "../../modals/ConfirmDeleteModal";

const ResponseTable = ({
  headers,
  responses,
  currentResponses,
  sortConfig,
  requestSort,
  handleEdit,
  handleDelete,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);

  const openEditModal = (response) => {
    setEditRow(response);
    const initialEdit = {};
    response.responses.forEach((res) => {
      initialEdit[res.field_id] = res.value;
    });
    setEditValues(initialEdit);
    setShowModal(true);
  };

  const closeEditModal = () => {
    setShowModal(false);
    setEditRow(null);
    setEditValues({});
  };

  const saveEditing = () => {
    const updatedResponse = {
      ...editRow,
      responses: editRow.responses.map((res) => ({
        ...res,
        value: editValues[res.field_id] || "",
      })),
    };
    handleEdit(updatedResponse);
    closeEditModal();
  };

  const handleInputChange = (fieldId, value) => {
    setEditValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const openDeleteModal = (responseId) => {
    setDeleteRowId(responseId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteRowId(null);
  };

  const confirmDelete = (responseId) => {
    handleDelete(responseId);
    closeDeleteModal();
  };

  return (
    <>
      <table className="w-full table-auto" style={{ marginLeft: "150px" }}>
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {headers.map((fieldId) => {
              const field = responses[0]?.responses?.find(
                (res) => res.field_id === fieldId
              );

              return (
                <th
                  key={fieldId}
                  className="border p-3 text-left cursor-pointer"
                >
                  {field ? field.field_name : "Unknown Field"}{" "}
                  {sortConfig.key === fieldId ? (
                    sortConfig.direction === "asc" ? (
                      <FaRegArrowAltCircleUp
                        onClick={() => requestSort(fieldId)}
                      />
                    ) : (
                      <FaRegArrowAltCircleDown
                        onClick={() => requestSort(fieldId)}
                      />
                    )
                  ) : (
                    <FaRegArrowAltCircleDown
                      onClick={() => requestSort(fieldId)}
                    />
                  )}
                </th>
              );
            })}
            <th
              className="border p-3 text-left cursor-pointer"
              onClick={() => requestSort("submitted_at")}
            >
              Submitted At{" "}
              {sortConfig.key === "submitted_at" ? (
                sortConfig.direction === "asc" ? (
                  <FaRegArrowAltCircleUp />
                ) : (
                  <FaRegArrowAltCircleDown />
                )
              ) : (
                <FaRegArrowAltCircleDown />
              )}
            </th>
            <th className="border p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentResponses.map((response) => (
            <tr
              key={response._id}
              className="border hover:bg-gray-50 transition-all"
            >
              {headers.map((fieldId) => {
                const field = response.responses.find(
                  (res) => res.field_id === fieldId
                );
                return (
                  <td key={fieldId} className="border p-3 text-gray-700">
                    {field?.value || "N/A"}
                  </td>
                );
              })}
              <td className="border p-3 text-gray-700">
                {new Date(response.submitted_at).toLocaleString()}
              </td>
              <td className="border p-3 text-gray-700 flex gap-2 items-center">
                <Button
                  style={{ marginRight: "10px" }}
                  variant="secondary"
                  size="sm"
                  onClick={() => openEditModal(response)}
                >
                  <FaPencilAlt size={13} />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => openDeleteModal(response._id)}
                >
                  <FaTrash size={13} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <EditResponseModal
        show={showModal}
        onClose={closeEditModal}
        onSave={saveEditing}
        editValues={editValues}
        headers={headers}
        responses={responses}
        onChange={handleInputChange}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        responseId={deleteRowId}
      />
    </>
  );
};

export default ResponseTable;
