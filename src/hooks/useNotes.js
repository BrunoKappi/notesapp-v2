import { useQuery } from '@tanstack/react-query';
import { noteService } from '../services/NoteService';
import store from '../components/store/store';
import { SetNotas } from '../components/utils/Utilidades';

export const useNotes = (email) => {
    return useQuery({
        queryKey: ['notes', email],
        queryFn: async () => {
            // Wait for existing firebase fetching mechanism to complete for now,
            // or migrate fully. Right now `getNotas` internally dispatches to Redux.
            await noteService.getNotesByEmail(email);
            
            // Temporary bridge to return Redux state
            return store.getState().Notas;
        },
        enabled: !!email,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
