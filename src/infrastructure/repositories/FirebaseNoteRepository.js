import { NoteRepository } from "../../domain/repositories/NoteRepository";
import { getNotas, createNota, updateNota } from "../../components/firebase/metodos";

export class FirebaseNoteRepository extends NoteRepository {
    // This is a simplified wrapper adapting the existing firebase methods
    async getNotes(email) {
        // getNotas currently uses a callback to store.dispatch internally inside metodos.js
        // We will adapt it later or assume it handles state for now.
        // Ideally this should return a promise with the notes.
        return getNotas(email);
    }
    async createNote(note) {
        return createNota(note);
    }
    async updateNote(noteId, updatedData) {
        // updateNota from metodos.js expects the full object
        return updateNota(updatedData);
    }
    async deleteNote(noteId) {
        // Soft delete mapped to update
        return updateNota({ docID: noteId, status: 'Deletada' });
    }
}
