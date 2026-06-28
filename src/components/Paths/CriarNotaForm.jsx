import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import { DefaultNota } from '../../GlobalVars'
import { v4 } from 'uuid';
import { CirclePicker } from 'react-color';
import { Palette, X } from "lucide-react";
import { CreateNota } from "../utils/Utilidades";
import { MaxLengthTitle, MaxLengthContent } from "../../GlobalVars";
import Dropdown from 'react-bootstrap/Dropdown';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { getNoteColorClass } from "@/lib/utils";
import NoteTagsPopover from "../NoteTagsPopover";

const CriarNotaForm = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [Titulo, setTitulo] = useState('');
  const [Conteudo, setConteudo] = useState('');
  const [Color, setColor] = useState('#ffffff');
  const [ColorPicker, setColorPicker] = useState(false);
  const [tags, setTags] = useState([]);
  
  const ColorOptionsDefault = ['#F28B82', '#FBBC05', '#FFF475', '#CCFF90', '#A7FFEB', '#CBF0F8', '#AECBFA', '#D7AEFB', '#E6C9A8', '#E8EAED', '#FFFFFF'];
  const [ColorOptions, setColorOptions] = useState(ColorOptionsDefault);

  useEffect(() => {
    setColorOptions(ColorOptionsDefault.filter(color => color !== Color.toUpperCase()))
  }, [Color]);

  const Salvar = () => {
    if (Titulo.trim() || Conteudo.trim()) {
      const NovaNota = {
        ...DefaultNota,
        email: props.LoggedUser.email,
        titulo: Titulo,
        conteudo: Conteudo,
        ID: v4(),
        cor: Color || '#ffffff',
        tags: tags || []
      }
      CreateNota(NovaNota)
    }
    LimparCampos()
    setShowModal(false)
  }

  const handleClose = () => {
    Salvar()
  }

  const LimparCampos = () => {
    setTitulo('')
    setConteudo('')
    setColor('#ffffff')
    setColorPicker(false)
    setTags([])
  }

  const initCreatingNote = () => {
    setShowModal(true)
  }

  const handleChangeColor = (color) => {
    setColor(color.hex)
    setColorPicker(false)
  }

  const isDark = document.documentElement.classList.contains('dark')
  const cardBg = getNoteColorClass(Color);
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <div className="w-full max-w-2xl mx-auto my-8 px-4">
      <div 
        className="relative flex items-center w-full rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-text bg-card"
        onClick={initCreatingNote}
      >
        <input
          type="text"
          className="w-full bg-transparent border-none outline-none py-3 px-4 font-medium text-foreground placeholder:text-muted-foreground"
          placeholder="Criar uma nota..."
          readOnly
        />
      </div>

      <Dialog open={showModal} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent 
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
          className="p-0 border shadow-lg max-w-2xl gap-0 overflow-hidden flex flex-col max-h-[90vh]"
        >
          <DialogTitle className="sr-only">Criar Nota</DialogTitle>
          <DialogDescription className="sr-only">Crie uma nova nota aqui.</DialogDescription>
          
          <div className="px-6 py-4">
            <input
              className="w-full border-none outline-none bg-transparent font-medium text-xl text-foreground placeholder:text-foreground/70"
              maxLength={MaxLengthTitle}
              placeholder="Título"
              value={Titulo}
              onChange={e => setTitulo(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="px-6 flex-1 overflow-y-auto min-h-[40vh]">
            <textarea
              className="w-full h-full min-h-[40vh] border-none outline-none bg-transparent resize-none text-base text-foreground placeholder:text-foreground/70"
              maxLength={MaxLengthContent}
              placeholder="Criar uma nota..."
              value={Conteudo}
              onChange={e => setConteudo(e.target.value)}
            />
          </div>

          {tags && tags.length > 0 && (
            <div className="px-6 pb-4 flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <span key={index} className="flex items-center gap-1 px-2.5 py-1 text-xs bg-black/5 dark:bg-white/5 text-foreground/80 rounded-full border border-black/10 dark:border-white/10">
                  <span>{tag}</span>
                  <button 
                    onClick={() => setTags(tags.filter(t => t !== tag))}
                    className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          
          <div className="px-4 py-3 flex items-center justify-between border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Dropdown>
                <Dropdown.Toggle variant="link" className="p-2 text-foreground/70 hover:bg-black/10 dark:hover:bg-white/10 rounded-full flex items-center justify-center border-none shadow-none no-underline after:hidden">
                  <Palette size={18} />
                </Dropdown.Toggle>

                <Dropdown.Menu className="p-2 min-w-[200px] border-none shadow-lg rounded-xl">
                  <CirclePicker colors={ColorOptions} onChange={handleChangeColor} />
                </Dropdown.Menu>
              </Dropdown>

              <NoteTagsPopover tags={tags} onUpdateTags={setTags} />
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
  )
}

const ConnectedCriarNotaForm = connect((state) => {
  return {
    LoggedUser: state.LoggedUser
  }
})(CriarNotaForm)

export default ConnectedCriarNotaForm

