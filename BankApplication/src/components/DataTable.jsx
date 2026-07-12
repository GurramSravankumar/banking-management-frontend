import React from "react";

function DataTable({ rows, columns, action, renderExtra, customRenderers = {}, className = "table-wrap", emptyText = "No records found." }) {
    if (!rows?.length) {
        return <p className="empty">{emptyText}</p>;
    }

    const formatValue = (column, value, row) => {
        if (customRenderers && customRenderers[column]) {
            return customRenderers[column](value, row);
        }
        if (value === null || value === undefined) {
            return "-";
        }
        if (typeof value === "object") {
            return value.fullName || value.email || value.accountNumber || JSON.stringify(value);
        }
        return String(value);
    };

    return (
        <div className={className}>
            <table>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column} style={{ textTransform: "capitalize" }}>
                                {column.replace(/([A-Z])/g, ' $1')}
                            </th>
                        ))}
                        {(action || renderExtra) && <th>actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={row.id || row.referenceNumber || index}>
                            {columns.map((column) => (
                                <td key={column}>{formatValue(column, row[column], row)}</td>
                            ))}
                            {(action || renderExtra) && (
                                <td className="action-buttons">
                                    {action && action(row)}
                                    {renderExtra && renderExtra(row)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;
