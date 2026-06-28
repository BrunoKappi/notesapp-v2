import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noteService } from '../services/NoteService';
import store from '../components/store/store';
import { editNotaAction } from '../components/store/actions/NotasActions';

export const useUpdateNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedNote) => {
            await noteService.updateNote(updatedNote.docID, updatedNote);
            return updatedNote;
        },
        onSuccess: (updatedNote) => {
            // Keep Redux in sync for now while we transition
            store.dispatch(editNotaAction(updatedNote.docID, updatedNote));
            
            // In a fully decoupled React Query setup, we would invalidate queries:
            // queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
        onError: (error) => {
            console.error("Failed to update note:", error);
            // Could dispatch error notification here
        }
    });
};
