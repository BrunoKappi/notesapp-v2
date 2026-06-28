import React, { useState, useEffect, useRef } from "react";
import { connect } from 'react-redux'
import { DefaultNota } from "../../GlobalVars";
import { Archive, Trash2, Palette, X } from "lucide-react";
import { Notificar } from "../utils/Utilidades";
import Dropdown from 'react-bootstrap/Dropdown';
import { CirclePicker } from 'react-color';
import { MaxLengthTitle, MaxLengthContent } from "../../GlobalVars";
import { cn, getNoteColorClass } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { useUpdateNote } from "../../hooks/useUpdateNote";
import NoteTagsPopover from "../NoteTagsPopover";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Nota = (props) => {
  const [show, setShow] = useState(false);
  const [ColorPicker, setColorPicker] = useState(false);
  const ColorOptionsDefault = ['#F28B82', '#FBBC05', '#FFF475', '#CCFF90', '#A7FFEB', '#CBF0F8', '#AECBFA', '#D7AEFB', '#E6C9A8', '#E8EAED', '#FFFFFF'];
  const [ColorOptions, setColorOptions] = useState(ColorOptionsDefault);
  const [TituloPrevState, setTituloPrevState] = useState(props.Note.titulo);
  const [ConteudoPrevState, setConteudoPrevState] = useState(props.Note.conteudo);
  
  const { mutate: updateNote } = useUpdateNote();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.Note.ID,
    disabled: show, // Disable drag when edit dialog is open to allow normal selection
  });

  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
    position: isDragging ? 'relative' : 'static',
  };
  const textareaRef = useRef(null);

  useEffect(() => {
    if (show && textareaRef.current) {
      // Focus textarea and move cursor to the end of the content
      const el = textareaRef.current;
      setTimeout(() => {
        el.focus();
        const len = el.value.length;
        el.setSelectionRange(len, len);
      }, 50); // slight timeout to let Radix finish rendering and transition
    }
  }, [show]);

  const [Note, setNote] = useState({
    ...DefaultNota,
    ...props.Note
  });

  const toggleColorPicker = () => setColorPicker(!ColorPicker);

  const handleShow = () => {
    setShow(true);
  }
  
  const handleClose = () => {
    setShow(false);
  }

  const handleDeleteNote = (e) => {
    e.stopPropagation();
    const EditedNote = { ...Note, status: 'Deletada' }
    updateNote(EditedNote)
    Notificar("Nota excluída")
  }
  
  const handleArchiveNote = (e) => {
    e.stopPropagation();
    const EditedNote = { ...Note, status: 'Arquivada' }
    updateNote(EditedNote)
    Notificar("Nota arquivada")
  }

  const handleUpdateTags = (newTags) => {
    const EditedNote = { ...Note, tags: newTags };
    setNote(EditedNote);
    updateNote(EditedNote);
  };

  useEffect(() => {
    setColorOptions(ColorOptionsDefault.filter(color => color !== Note.cor.toUpperCase()))
  }, [Note.cor]);

  const handleChangeColor = (color) => {
    const EditedNote = { ...Note, cor: color.hex }
    setNote(EditedNote)
    updateNote(EditedNote)
    toggleColorPicker()
  }

  const [UpdateTimeout, setUpdateTimeout] = useState(null);

  useEffect(() => {
    clearTimeout(UpdateTimeout)
    if (TituloPrevState !== Note.titulo) {
      setUpdateTimeout(setTimeout(() => {
        updateNote(Note)
        setTituloPrevState(Note.titulo)
      }, 1500))
    }
  }, [Note.titulo, Note, TituloPrevState, updateNote]);

  useEffect(() => {
    clearTimeout(UpdateTimeout)
    if (ConteudoPrevState !== Note.conteudo) {
      setUpdateTimeout(setTimeout(() => {
        updateNote(Note)
        setConteudoPrevState(Note.conteudo)
      }, 1500))
    }
  }, [Note.conteudo, Note, ConteudoPrevState, updateNote]);

  const isDark = document.documentElement.classList.contains('dark')
  
  const cardBg = getNoteColorClass(Note.cor);
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <div 
      ref={setNodeRef}
      style={{
        ...dndStyle,
        backgroundColor: cardBg,
        borderColor: cardBorder,
      }}
      className={cn(
        "group relative flex flex-col w-full rounded-xl border transition-all duration-200 ease-in-out overflow-hidden mb-4",
        isDragging ? "shadow-2xl scale-[1.03] rotate-[0.5deg] z-50 cursor-grabbing select-none border-primary/40" : "hover:shadow-md cursor-grab",
        show && "opacity-0"
      )}
      onClick={e => { if (!show) handleShow() }}
      {...attributes}
      {...listeners}
    >
      <div className="p-4 flex flex-col gap-2">
        {Note.titulo && (
          <div className="font-medium text-base tracking-tight leading-6 text-foreground break-words line-clamp-3">
            {Note.titulo}
          </div>
        )}
        {Note.conteudo && (
          <div className="text-sm text-foreground/90 whitespace-pre-wrap break-words line-clamp-[8] font-normal">
            {Note.conteudo}
          </div>
        )}
        {Note.tags && Array.isArray(Note.tags) && Note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {Note.tags.map((tag, index) => (
              <span key={index} className="px-2 py-0.5 text-xs bg-background/50 text-foreground/70 rounded-full border border-border">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div 
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 px-2 pb-2 mt-auto"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button 
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-foreground/70 transition-colors"
            onClick={(e) => { e.stopPropagation(); toggleColorPicker(); }}
        >
          <Palette size={16} />
        </button>
        <div onClick={(e) => e.stopPropagation()}>
          <NoteTagsPopover tags={Note.tags} onUpdateTags={handleUpdateTags} />
        </div>
        <button 
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-foreground/70 transition-colors"
            onClick={handleArchiveNote}
        >
          <Archive size={16} />
        </button>
        <button 
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-foreground/70 transition-colors"
            onClick={handleDeleteNote}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent 
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
          className="p-0 border shadow-lg max-w-2xl gap-0 overflow-hidden flex flex-col max-h-[90vh]"
        >
          <DialogTitle className="sr-only">Edit Note</DialogTitle>
          <DialogDescription className="sr-only">Make changes to your note here. Click save when you're done.</DialogDescription>
          
          <div className="px-6 py-4">
            <input 
              className="w-full border-none outline-none bg-transparent font-medium text-xl text-foreground placeholder:text-foreground/70"
              maxLength={MaxLengthTitle} 
              placeholder="Título" 
              value={Note.titulo} 
              onChange={e => setNote({ ...Note, titulo: e.target.value })}
            />
          </div>
          
          <div className="px-6 flex-1 overflow-y-auto min-h-[40vh]">
            <textarea 
              ref={textareaRef}
              className="w-full h-full min-h-[40vh] border-none outline-none bg-transparent resize-none text-base text-foreground placeholder:text-foreground/70"
              maxLength={MaxLengthContent} 
              placeholder="Conteúdo da nota..." 
              value={Note.conteudo} 
              onChange={e => setNote({ ...Note, conteudo: e.target.value })}
            />
          </div>

          {Note.tags && Array.isArray(Note.tags) && Note.tags.length > 0 && (
            <div className="px-6 pb-4 flex flex-wrap gap-1">
              {Note.tags.map((tag, index) => (
                <span key={index} className="flex items-center gap-1 px-2.5 py-1 text-xs bg-black/5 dark:bg-white/5 text-foreground/80 rounded-full border border-black/10 dark:border-white/10">
                  <span>{tag}</span>
                  <button 
                    onClick={() => handleUpdateTags(Note.tags.filter(t => t !== tag))}
                    className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          
          <div className="px-4 py-3 flex items-center justify-between border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-1">
              <Dropdown>
                <Dropdown.Toggle variant="link" className="p-2 text-foreground/70 hover:bg-black/10 dark:hover:bg-white/10 rounded-full flex items-center justify-center border-none shadow-none no-underline after:hidden">
                  <Palette size={18} />
                </Dropdown.Toggle>
                <Dropdown.Menu className="p-2 min-w-[200px] border-none shadow-lg rounded-xl">
                  <CirclePicker colors={ColorOptions} onChange={handleChangeColor} />
                </Dropdown.Menu>
              </Dropdown>

              <NoteTagsPopover tags={Note.tags} onUpdateTags={handleUpdateTags} />
              
              <button 
                  className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-foreground/70 transition-colors"
                  onClick={handleArchiveNote}
              >
                <Archive size={18} />
              </button>
              <button 
                  className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-foreground/70 transition-colors"
                  onClick={handleDeleteNote}
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <button 
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors text-foreground"
            >
              Fechar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const ConnectedNota = connect((state) => {
  return {
    LoggedUser: state.LoggedUser
  }
})(Nota)

export default ConnectedNota

