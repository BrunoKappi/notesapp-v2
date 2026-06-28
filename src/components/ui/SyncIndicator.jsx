import { useIsMutating } from '@tanstack/react-query';
import { Cloud, CloudOff, CloudLightning } from 'lucide-react';

const SyncIndicator = () => {
    const isMutating = useIsMutating();

    // isMutating returns the number of active mutations.
    const isSyncing = isMutating > 0;

    return (
        <div className="fixed bottom-4 right-6 flex items-center gap-2 bg-background/80 backdrop-blur border shadow-sm px-3 py-1.5 rounded-full z-50 text-xs font-medium text-muted-foreground transition-all duration-300">
            {isSyncing ? (
                <>
                    <CloudLightning className="h-4 w-4 text-amber-500 animate-pulse" />
                    <span>Sincronizando...</span>
                </>
            ) : (
                <>
                    <Cloud className="h-4 w-4 text-green-500" />
                    <span>Sincronizado</span>
                </>
            )}
        </div>
    );
};

export default SyncIndicator;
