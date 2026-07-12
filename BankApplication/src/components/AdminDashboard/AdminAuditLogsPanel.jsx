import React from "react";
import DataTable from "../DataTable";

function AdminAuditLogsPanel({ auditLogs }) {
    return (
        <div className="panel animate-fade-in">
            <h2>Admin Audit Logs</h2>
            <DataTable
                rows={auditLogs}
                columns={["id", "action", "targetType", "targetId", "actor", "details", "createdAt"]}
            />
        </div>
    );
}

export default AdminAuditLogsPanel;
