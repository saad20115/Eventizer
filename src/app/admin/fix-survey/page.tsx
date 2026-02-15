"use client";

import { useState } from 'react';
import { repairVendorSurvey } from './actions';

export default function RepairSurveyPage() {
    const [status, setStatus] = useState<string>('Idle');
    const [logs, setLogs] = useState<string[]>([]);

    const handleRepair = async () => {
        setStatus('Running...');
        setLogs(prev => [...prev, 'Starting repair process...']);

        try {
            const result = await repairVendorSurvey();
            if (result.success) {
                setStatus('Success');
                setLogs(prev => [...prev, '✅ Success: ' + result.message]);
            } else {
                setStatus('Error');
                setLogs(prev => [...prev, '❌ Error: ' + result.message]);
            }
        } catch (e: any) {
            setStatus('Exception');
            setLogs(prev => [...prev, '❌ Exception: ' + e.toString()]);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Vendor Survey Repair Tool</h1>
            <p className="mb-4 text-gray-600">
                Click the button below to force-update the Vendor Survey questions.
                This will insert the missing conditional questions (Photography, Kosha, etc.).
            </p>

            <button
                onClick={handleRepair}
                disabled={status === 'Running'}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {status === 'Running' ? 'Repairing...' : 'Run Repair'}
            </button>

            <div className="mt-8 p-4 bg-gray-100 rounded border h-64 overflow-auto font-mono text-sm">
                {logs.map((log, i) => (
                    <div key={i} className="mb-1">{log}</div>
                ))}
            </div>
        </div>
    );
}
