"use client";

interface CellProps {
  value: number;
  revealed: boolean;
  flagged: boolean;
  onReveal: () => void;
  onFlag: (e: React.MouseEvent) => void;
  size?: number;
}

export function Cell({
  value,
  revealed,
  flagged,
  onReveal,
  onFlag,
  size = 10,
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

  // Adjust text size based on board size
  const getTextSize = () => {
    if (size <= 10) return "text-sm sm:text-base";
    if (size <= 12) return "text-xs sm:text-sm";
    return "text-xs";
  };

  return (
    <div className="pt-[100%] relative w-full">
      <button
        className={`absolute inset-0 flex items-center justify-center font-bold ${getCellColor()} ${getTextColor()} ${getTextSize()} transition-colors duration-200`}
        onClick={onReveal}
        onContextMenu={onFlag}
      >
        {getCellContent()}
      </button>
    </div>
  );
}
