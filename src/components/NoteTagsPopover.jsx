import React, { useState } from "react";
import { connect } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tag, Plus, Check } from "lucide-react";
import { UpdateUser, EditarUsuario, Notificar } from "./utils/Utilidades";

const NoteTagsPopover = ({ tags = [], onUpdateTags, Usuario, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const labels = Usuario?.labels || [];

  const handleToggleTag = (label) => {
    let newTags;
    if (tags.includes(label)) {
      newTags = tags.filter(t => t !== label);
    } else {
      newTags = [...tags, label];
    }
    onUpdateTags(newTags);
  };

  const handleCreateLabel = async () => {
    const trimmed = search.trim();
    if (!trimmed) return;

    let updatedLabels = [...labels];
    if (!labels.includes(trimmed)) {
      updatedLabels.push(trimmed);
      const updatedUser = { ...Usuario, labels: updatedLabels };
      try {
        await UpdateUser(updatedUser);
        EditarUsuario(Usuario.uid, updatedUser);
      } catch (e) {
        console.error(e);
        Notificar("Erro ao criar marcador global");
        return;
      }
    }

    // Associate it with the current note if not already associated
    if (!tags.includes(trimmed)) {
      onUpdateTags([...tags, trimmed]);
    }
    setSearch("");
  };

  const filteredLabels = labels.filter(l => 
    l.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-foreground/70 transition-colors">
            <Tag size={16} />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent 
        className="p-3 w-56 border shadow-lg rounded-xl flex flex-col gap-2 bg-popover text-popover-foreground"
        align="start"
      >
        <span className="text-xs font-semibold text-muted-foreground px-1 py-0.5">
          Marcadores da nota
        </span>
        
        <div className="flex items-center gap-1 my-1">
          <Input 
            placeholder="Pesquisar/criar marcador"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateLabel()}
            className="h-7 text-xs px-2"
          />
          {search.trim() && !labels.includes(search.trim()) && (
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCreateLabel}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="max-h-[160px] overflow-y-auto space-y-1 py-1">
          {filteredLabels.length === 0 ? (
            <span className="text-xs text-muted-foreground block text-center py-2">
              Nenhum marcador encontrado
            </span>
          ) : (
            filteredLabels.map((label, index) => {
              const isChecked = tags.includes(label);
              return (
                <div 
                  key={index} 
                  className="flex items-center gap-2 px-1.5 py-1 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleToggleTag(label)}
                >
                  <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center transition-colors ${isChecked ? "bg-primary border-primary" : "border-muted-foreground/40"}`}>
                    {isChecked && <Check className="h-2.5 w-2.5 text-primary-foreground stroke-[3px]" />}
                  </div>
                  <span className="text-xs select-none truncate flex-1">{label}</span>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ConnectedNoteTagsPopover = connect((state) => {
  return {
    Usuario: state.Usuarios.find(u => u.email === state.LoggedUser.email) || {},
  };
})(NoteTagsPopover);

export default ConnectedNoteTagsPopover;
