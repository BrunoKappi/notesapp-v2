import React, { useState } from "react";
import { connect } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus, Check, Trash2, Edit2, X } from "lucide-react";
import { UpdateUser, EditarUsuario, UpdateNota, Notificar } from "./utils/Utilidades";
import store from "./store/store";
import { editNotaAction } from "./store/actions/NotasActions";

const ManageLabelsDialog = ({ open, onOpenChange, Usuario, Notas }) => {
  const [newLabel, setNewLabel] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  const labels = Usuario?.labels || [];

  const handleCreateLabel = async () => {
    if (!newLabel.trim()) return;
    if (labels.includes(newLabel.trim())) {
      Notificar("Este marcador já existe");
      return;
    }
    const updatedLabels = [...labels, newLabel.trim()];
    const updatedUser = { ...Usuario, labels: updatedLabels };
    
    try {
      await UpdateUser(updatedUser);
      EditarUsuario(Usuario.uid, updatedUser);
      setNewLabel("");
      Notificar("Marcador criado com sucesso");
    } catch (e) {
      console.error(e);
      Notificar("Erro ao criar marcador");
    }
  };

  const handleStartEdit = (index, text) => {
    setEditingIndex(index);
    setEditingText(text);
  };

  const handleSaveEdit = async (index) => {
    const oldLabel = labels[index];
    const newText = editingText.trim();
    if (!newText || oldLabel === newText) {
      setEditingIndex(null);
      return;
    }

    if (labels.filter((_, i) => i !== index).includes(newText)) {
      Notificar("Este marcador já existe");
      return;
    }

    const updatedLabels = [...labels];
    updatedLabels[index] = newText;
    const updatedUser = { ...Usuario, labels: updatedLabels };

    try {
      await UpdateUser(updatedUser);
      EditarUsuario(Usuario.uid, updatedUser);

      // Update all notes containing the old label
      const notesToUpdate = Notas.filter(note => note.tags && note.tags.includes(oldLabel));
      for (const note of notesToUpdate) {
        const updatedTags = note.tags.map(t => t === oldLabel ? newText : t);
        const updatedNote = { ...note, tags: updatedTags };
        await UpdateNota(updatedNote);
        // Also update local redux store for notes
        store.dispatch(editNotaAction(note.docID, updatedNote));
      }

      setEditingIndex(null);
      Notificar("Marcador atualizado");
    } catch (e) {
      console.error(e);
      Notificar("Erro ao atualizar marcador");
    }
  };

  const handleDeleteLabel = async (index) => {
    const labelToDelete = labels[index];
    const updatedLabels = labels.filter((_, i) => i !== index);
    const updatedUser = { ...Usuario, labels: updatedLabels };

    try {
      await UpdateUser(updatedUser);
      EditarUsuario(Usuario.uid, updatedUser);

      // Remove label from all notes containing it
      const notesToUpdate = Notas.filter(note => note.tags && note.tags.includes(labelToDelete));
      for (const note of notesToUpdate) {
        const updatedTags = note.tags.filter(t => t !== labelToDelete);
        const updatedNote = { ...note, tags: updatedTags };
        await UpdateNota(updatedNote);
        store.dispatch(editNotaAction(note.docID, updatedNote));
      }

      Notificar("Marcador excluído");
    } catch (e) {
      console.error(e);
      Notificar("Erro ao excluir marcador");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle>Editar Marcadores</DialogTitle>
          <DialogDescription className="sr-only">
            Crie, edite ou exclua marcadores para organizar suas notas.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 mt-4 pb-4 border-b">
          <Input
            placeholder="Criar novo marcador"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateLabel()}
            className="flex-1"
          />
          <Button size="icon" variant="ghost" onClick={handleCreateLabel}>
            <Plus className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </Button>
        </div>

        <div className="max-h-[300px] overflow-y-auto space-y-2 mt-4 pr-1">
          {labels.length === 0 ? (
            <p className="text-sm text-center text-muted-foreground py-6">
              Nenhum marcador criado ainda.
            </p>
          ) : (
            labels.map((label, index) => (
              <div key={index} className="flex items-center justify-between gap-2 group p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                {editingIndex === index ? (
                  <>
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(index)}
                      className="flex-1 h-8 text-sm"
                      autoFocus
                    />
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleSaveEdit(index)}>
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingIndex(null)}>
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium pl-2">{label}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleStartEdit(index, label)}>
                        <Edit2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteLabel(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => onOpenChange(false)}>Concluído</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ConnectedManageLabelsDialog = connect((state) => {
  return {
    Usuario: state.Usuarios.find(u => u.email === state.LoggedUser.email) || {},
    Notas: state.Notas || [],
  };
})(ManageLabelsDialog);

export default ConnectedManageLabelsDialog;
