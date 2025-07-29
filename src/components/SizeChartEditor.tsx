"use client";
import { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";

interface SizeChartData {
  sizes: { [key: string]: string }[];
  instructions: string;
  columns: string[];
}

interface SizeChartEditorProps {
  value: SizeChartData;
  onChange: (data: SizeChartData) => void;
}

const SizeChartEditor = ({ value, onChange }: SizeChartEditorProps) => {
  const [columns, setColumns] = useState<string[]>(["Size", "Chest", "Length"]);
  const [sizes, setSizes] = useState<{ [key: string]: string }[]>([]);
  const [instructions, setInstructions] = useState("");
  const [newColumn, setNewColumn] = useState("");
  const [csvInput, setCsvInput] = useState("");

  useEffect(() => {
    if (value) {
      setColumns(value.columns || ["Size", "Chest", "Length"]);
      setSizes(value.sizes || []);
      setInstructions(value.instructions || "");

      // Generate CSV string for display
      const csvString = sizes
        .map((row) => columns.map((col) => row[col] || "").join(","))
        .join("\n");
      setCsvInput(csvString);
    }
  }, [value]);

  const addColumn = () => {
    if (newColumn.trim() && !columns.includes(newColumn.trim())) {
      const updatedColumns = [...columns, newColumn.trim()];
      setColumns(updatedColumns);

      // Add the new column to all existing rows
      const updatedSizes = sizes.map((row) => ({
        ...row,
        [newColumn.trim()]: "",
      }));

      setSizes(updatedSizes);
      setNewColumn("");

      // Update parent
      onChange({
        sizes: updatedSizes,
        instructions,
        columns: updatedColumns,
      });
    }
  };

  const removeColumn = (columnToRemove: string) => {
    if (columns.length <= 1) return; // Keep at least one column

    const updatedColumns = columns.filter((col) => col !== columnToRemove);
    setColumns(updatedColumns);

    // Remove the column from all rows
    const updatedSizes = sizes.map((row) => {
      const newRow = { ...row };
      delete newRow[columnToRemove];
      return newRow;
    });

    setSizes(updatedSizes);

    // Update parent
    onChange({
      sizes: updatedSizes,
      instructions,
      columns: updatedColumns,
    });
  };

  const addRow = () => {
    const newRow: { [key: string]: string } = {};
    columns.forEach((col) => {
      newRow[col] = "";
    });

    const updatedSizes = [...sizes, newRow];
    setSizes(updatedSizes);

    // Update parent
    onChange({
      sizes: updatedSizes,
      instructions,
      columns,
    });
  };

  const removeRow = (index: number) => {
    const updatedSizes = sizes.filter((_, i) => i !== index);
    setSizes(updatedSizes);

    // Update parent
    onChange({
      sizes: updatedSizes,
      instructions,
      columns,
    });
  };

  const updateCell = (rowIndex: number, column: string, value: string) => {
    const updatedSizes = [...sizes];
    updatedSizes[rowIndex] = {
      ...updatedSizes[rowIndex],
      [column]: value,
    };

    setSizes(updatedSizes);

    // Update parent
    onChange({
      sizes: updatedSizes,
      instructions,
      columns,
    });
  };

  const handleCsvInput = (csvString: string) => {
    setCsvInput(csvString);

    const lines = csvString.split("\n").filter((line) => line.trim());
    if (lines.length === 0) return;

    // Parse CSV
    const parsedSizes: { [key: string]: string }[] = [];
    lines.forEach((line) => {
      const values = line.split(",").map((val) => val.trim());
      const row: { [key: string]: string } = {};
      columns.forEach((col, index) => {
        row[col] = values[index] || "";
      });
      parsedSizes.push(row);
    });

    setSizes(parsedSizes);

    // Update parent
    onChange({
      sizes: parsedSizes,
      instructions,
      columns,
    });
  };

  const handleInstructionsChange = (newInstructions: string) => {
    setInstructions(newInstructions);
    onChange({
      sizes,
      instructions: newInstructions,
      columns,
    });
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Size Chart Instructions
        </label>
        <input
          type="text"
          value={instructions}
          onChange={(e) => handleInstructionsChange(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          placeholder="For best fit, measure your favorite t-shirt and compare with the chart above"
        />
      </div>

      {/* Column Management */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Size Chart Columns
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {columns.map((column) => (
            <span
              key={column}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {column}
              {columns.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColumn(column)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newColumn}
            onChange={(e) => setNewColumn(e.target.value)}
            placeholder="Add new column (e.g., Shoulder, Waist)"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          />
          <button
            type="button"
            onClick={addColumn}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* CSV Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Size Chart Data (CSV format)
        </label>
        <textarea
          rows={6}
          value={csvInput}
          onChange={(e) => handleCsvInput(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          placeholder={`${columns.join(
            ","
          )}\nS,38,26\nM,40,27\nL,42,28\nXL,44,29`}
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter size chart data in CSV format. Each row represents a size, each
          column represents a measurement.
        </p>
      </div>

      {/* Table View */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Size Chart Table View
          </label>
          <button
            type="button"
            onClick={addRow}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            <Plus className="h-4 w-4 inline mr-1" />
            Add Row
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b"
                  >
                    {column}
                  </th>
                ))}
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b w-16">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column} className="px-4 py-2 border-b">
                      <input
                        type="text"
                        value={row[column] || ""}
                        onChange={(e) =>
                          updateCell(rowIndex, column, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        placeholder={`Enter ${column.toLowerCase()}`}
                      />
                    </td>
                  ))}
                  <td className="px-4 py-2 border-b">
                    <button
                      type="button"
                      onClick={() => removeRow(rowIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sizes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No size data yet. Add rows or enter CSV data above.
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeChartEditor;
