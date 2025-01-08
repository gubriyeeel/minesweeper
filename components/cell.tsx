"use client";

interface CellProps {
  value: number;
  revealed: boolean;
  flagged: boolean;
  onReveal: () => void;
  onFlag: (e: React.MouseEvent) => void;
}

export function Cell({
  value,
  revealed,
  flagged,
  onReveal,
  onFlag,
}: CellProps) {
  const getCellContent = () => {
    if (flagged) return "🚩";
    if (!revealed) return "";
    if (value === -1) return "💣";
    return value === 0 ? "" : value;
  };

  const getCellColor = () => {
    if (!revealed) return "bg-gray-300 hover:bg-gray-400";
    if (value === -1) return "bg-red-500";
    return "bg-white";
  };

  const getTextColor = () => {
    switch (value) {
      case 1:
        return "text-blue-600";
      case 2:
        return "text-green-600";
      case 3:
        return "text-red-600";
      case 4:
        return "text-purple-600";
      case 5:
        return "text-yellow-600";
      case 6:
        return "text-cyan-600";
      case 7:
        return "text-black";
      case 8:
        return "text-gray-600";
      default:
        return "";
    }
  };

  return (
    <button
      className={`w-8 h-8 flex items-center justify-center font-bold ${getCellColor()} ${getTextColor()} transition-colors duration-200`}
      onClick={onReveal}
      onContextMenu={onFlag}
    >
      {getCellContent()}
    </button>
  );
}
