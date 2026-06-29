import React, { useState } from "react";
import { connect } from 'react-redux'
import './css/Notas.css'
import CriarNotaForm from './CriarNotaForm'
import Nota from './Nota'
import { cn } from "@/lib/utils"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useUpdateNote } from "../../hooks/useUpdateNote";
import { editNotaAction } from "../store/actions/NotasActions";
import store from "../store/store";

const Notas = (props) => {
  const { mutate: updateNote } = useUpdateNote();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid accidental drags on simple click
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredNotas = props.Notas;

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredNotas.findIndex((note) => note.ID === active.id);
      const newIndex = filteredNotas.findIndex((note) => note.ID === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(filteredNotas, oldIndex, newIndex);

        // Instantly update Redux to keep UI responsive
        reordered.forEach((note, index) => {
          if (note.order !== index) {
            const updatedNote = { ...note, order: index };
            store.dispatch(editNotaAction(note.docID, updatedNote));
            updateNote(updatedNote); // autosave/debounce will trigger Firestore persist
          }
        });
      }
    }
  };

  return (
    <div className="Notas">

      {props.currentTab !== 'Arquivadas' && <CriarNotaForm />}



      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredNotas.map((note) => note.ID)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl px-4 mt-6">
            {filteredNotas.map((Note) => {
              return (
                <Nota
                  key={Note.ID}
                  Note={Note}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

const ConnectedNotas = connect((state) => {
  const searchTerm = (state.LoggedUser.Search || '').toLowerCase()
  const currentTab = state.LoggedUser.CurrentSidebarTab || 'Notas';
  const expectedStatus = currentTab === 'Arquivadas' ? 'Arquivada' : 'Ativa';
  
  const usuario = state.Usuarios.find(u => u.email === state.LoggedUser.email) || {};
  const labels = usuario.labels || [];
  const activeTags = state.LoggedUser.ActiveTags || [];

  return {
    LoggedUser: state.LoggedUser,
    currentTab,
    labels,
    Notas: state.Notas.filter(Nota => {
      if (Nota.status !== expectedStatus) return false;
      
      // Tag filter
      if (activeTags.length > 0) {
        const hasMatchingTag = Nota.tags && Array.isArray(Nota.tags) 
          ? Nota.tags.some(tag => activeTags.includes(tag))
          : false;
        if (!hasMatchingTag) return false;
      }
      
      // Search term
      if (searchTerm) {
        const titleMatch = (Nota.titulo || '').toLowerCase().includes(searchTerm)
        const contentMatch = (Nota.conteudo || '').toLowerCase().includes(searchTerm)
        const tagsMatch = Nota.tags && Array.isArray(Nota.tags) 
          ? Nota.tags.some(tag => (tag || '').toLowerCase().includes(searchTerm))
          : false;
          
        if (!titleMatch && !contentMatch && !tagsMatch) return false;
      }
      
      return true;
    })
  }
})(Notas)

export default ConnectedNotas

