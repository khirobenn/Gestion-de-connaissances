// Sidebar.tsx
export interface Discussion {
  id: string;
  title: string;
}

interface SidebarProps {
  discussions: Discussion[];
  activeId: string | null;
  // onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
}

export function Sidebar({
  discussions,
  activeId,
  // onSelect, 
  onNew,
  onDelete,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <p className="sidebar__title">Discussions</p>
        <button className="sidebar__new-btn" onClick={onNew}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="#c8a96e" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          New chat
        </button>
      </div>

      <div className="sidebar__list">
        {discussions.map(d => (
          <div
            key={d.id}
            className={`sidebar__item${activeId === d.id ? " sidebar__item--active" : ""}`}
            // onClick={() => onSelect(d.id)}
          >
            <div className="sidebar__item-dot" />
            <div className="sidebar__item-title">{d.title}</div>
            <button
              className="sidebar__item-del"
              onClick={e => { e.stopPropagation(); onDelete(d.id); }}
              title="Delete"
            >✕</button>
          </div>
        ))}
      </div>

      <div className="sidebar__footer">
        <button className="sidebar__footer-btn" onClick={onLogout}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M5 2H2.5A1 1 0 001.5 3v7a1 1 0 001 1H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M8.5 9.5L11.5 6.5 8.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="4.5" y1="6.5" x2="11" y2="6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );
}