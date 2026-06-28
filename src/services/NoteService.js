import { FirebaseNoteRepository } from "../infrastructure/repositories/FirebaseNoteRepository";

class NoteService {
    constructor(repository) {
        this.repository = repository;
    }

    async getNotesByEmail(email) {
        return this.repository.getNotes(email);
    }

    async createNote(note) {
        return this.repository.createNote(note);
    }

    async updateNote(noteId, updatedData) {
        return this.repository.updateNote(noteId, updatedData);
    }
    
    async deleteNote(noteId) {
        return this.repository.deleteNote(noteId);
    }
}

// Default export uses Firebase implementation as requested
export const noteService = new NoteService(new FirebaseNoteRepository());
