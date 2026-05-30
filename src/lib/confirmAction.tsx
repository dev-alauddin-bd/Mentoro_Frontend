import toast from "react-hot-toast";
import React from "react";

export const confirmAction = (message: string, onConfirm: () => void) => {
  toast.custom((t_toast) => (
    <div className={`${t_toast.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-card border border-border shadow-2xl rounded-2xl pointer-events-auto flex flex-col p-4 gap-4`}>
      <p className="text-sm font-bold text-foreground text-center">
        {message}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => toast.dismiss(t_toast.id)}
          className="flex-1 bg-secondary text-foreground text-xs font-black uppercase tracking-widest py-2.5 rounded-xl hover:bg-secondary/80 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            toast.dismiss(t_toast.id);
            onConfirm();
          }}
          className="flex-1 bg-primary text-white text-xs font-black uppercase tracking-widest py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
        >
          Confirm
        </button>
      </div>
    </div>
  ), { duration: Infinity });
};
