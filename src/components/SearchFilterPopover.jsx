import React from "react";
import { connect } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Filter, Check } from "lucide-react";
import { SetActiveTagsRedux, ClearActiveTagsRedux } from "./utils/Utilidades";

const SearchFilterPopover = ({ Usuario, ActiveTags = [], setActiveTags, clearActiveTags }) => {
  const labels = Usuario?.labels || [];
  const activeCount = ActiveTags?.length || 0;

  const handleToggleTag = (label) => {
    let newTags;
    if (ActiveTags.includes(label)) {
      newTags = ActiveTags.filter(t => t !== label);
    } else {
      newTags = [...ActiveTags, label];
    }
    setActiveTags(newTags);
  };

  const handleSelectAll = () => {
    setActiveTags([...labels]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`h-10 px-3 flex items-center gap-2 rounded-lg border-muted/80 bg-muted/30 hover:bg-muted/50 transition-colors ${activeCount > 0 ? "border-primary text-primary bg-primary/5 hover:bg-primary/10" : "text-muted-foreground"}`}
        >
          <Filter className="h-4 w-4" />
          <span className="text-xs font-medium">Filtro</span>
          {activeCount > 0 && (
            <span className="ml-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-3 w-56 border shadow-lg rounded-xl flex flex-col gap-2 bg-popover text-popover-foreground"
        align="end"
      >
        <span className="text-xs font-semibold text-muted-foreground px-1 py-0.5">
          Filtrar por marcadores
        </span>

        <div className="max-h-[180px] overflow-y-auto space-y-1 py-1">
          {labels.length === 0 ? (
            <span className="text-xs text-muted-foreground block text-center py-2">
              Nenhum marcador criado
            </span>
          ) : (
            labels.map((label, index) => {
              const isChecked = ActiveTags.includes(label);
              return (
                <div 
                  key={index} 
                  className="flex items-center gap-2 px-1.5 py-1 rounded hover:bg-muted/55 cursor-pointer transition-colors"
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

        {labels.length > 0 && (
          <div className="flex items-center justify-between border-t pt-2 mt-1">
            <button 
              onClick={handleSelectAll}
              className="text-[10px] font-semibold text-muted-foreground hover:text-primary hover:underline transition-colors"
            >
              Selecionar todas
            </button>
            <button 
              onClick={clearActiveTags}
              className="text-[10px] font-semibold text-destructive hover:underline transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

const ConnectedSearchFilterPopover = connect(
  (state) => {
    return {
      Usuario: state.Usuarios.find(u => u.email === state.LoggedUser.email) || {},
      ActiveTags: state.LoggedUser.ActiveTags || [],
    };
  },
  (dispatch) => {
    return {
      setActiveTags: (tags) => SetActiveTagsRedux(tags),
      clearActiveTags: () => ClearActiveTagsRedux(),
    };
  }
)(SearchFilterPopover);

export default ConnectedSearchFilterPopover;
