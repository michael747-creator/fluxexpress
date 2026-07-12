import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

const statusMeta = {
    in_transit: {
        label: "In Transit",
        colorClass: "text-emerald-400",
        badgeClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-200",
    },
    picked_up: {
        label: "Picked Up",
        colorClass: "text-teal-400",
        badgeClass: "bg-teal-500/10 border-teal-500/20 text-teal-200",
    },
    out_for_delivery: {
        label: "Out for Delivery",
        colorClass: "text-cyan-300",
        badgeClass: "bg-cyan-500/10 border-cyan-500/20 text-cyan-200",
    },
    delivered: {
        label: "Delivered",
        colorClass: "text-emerald-500",
        badgeClass: "bg-emerald-600/10 border-emerald-500/20 text-emerald-200",
    },
    delayed: {
        label: "Delayed",
        colorClass: "text-amber-400",
        badgeClass: "bg-amber-500/10 border-amber-500/20 text-amber-200",
    },
    issue: {
        label: "Issue",
        colorClass: "text-red-400",
        badgeClass: "bg-red-500/10 border-red-500/20 text-red-200",
    },
    exception: {
        label: "Exception",
        colorClass: "text-red-400",
        badgeClass: "bg-red-500/10 border-red-500/20 text-red-200",
    },
    custom_clearance: {
        label: "Customs Clearance",
        colorClass: "text-amber-400",
        badgeClass: "bg-amber-500/10 border-amber-500/20 text-amber-200",
    },
    on_hold: {
        label: "On Hold",
        colorClass: "text-amber-400",
        badgeClass: "bg-amber-500/10 border-amber-500/20 text-amber-200",
    },
    default: {
        label: "Active",
        colorClass: "text-teal-400",
        badgeClass: "bg-teal-500/10 border-teal-500/20 text-teal-200",
    },
};

const getStatusLabel = (status) => {
    return statusMeta[status]?.label || statusMeta.default.label;
};

const getStatusColor = (status) => {
    return statusMeta[status]?.colorClass || statusMeta.default.colorClass;
};

const getStatusBadge = (status) => {
    return statusMeta[status]?.badgeClass || statusMeta.default.badgeClass;
};

export default function TrackingDisplay({ trackingId, status, stages = [], description, consignment = {}, currentLocation, nextMilestone }) {

    const [copied, setCopied] = useState(false);

    const stageTimeline = useMemo(() => {
        if (!stages || stages.length === 0) {
            return [];
        }

        const normalizedStages = stages.map((stage, index) => ({
            id: stage.id ?? index + 1,
            status: stage.status || `step-${index}`,
            label: stage.label,
            icon: stage.icon || "📦",
            completed: Boolean(stage.completed),
            date: stage.date || stage.timestamp || null,
        }));

        const explicitLastCompletedIndex = normalizedStages.reduce((maxIndex, stage, index) => {
            return stage.completed ? Math.max(maxIndex, index) : maxIndex;
        }, -1);

        const currentStatusIndex = normalizedStages.findIndex((stage) => stage.status === status);
        const hasLaterCompleted = normalizedStages.some((stage, index) => index > currentStatusIndex && stage.completed);

        const inferredLastCompletedIndex = currentStatusIndex > -1 && !hasLaterCompleted
            ? Math.max(explicitLastCompletedIndex, currentStatusIndex - 1)
            : explicitLastCompletedIndex;

        const nextIncompleteIndex = normalizedStages.findIndex((stage, index) => {
            if (index <= inferredLastCompletedIndex) {
                return false;
            }
            if (status && index === currentStatusIndex && !stage.completed) {
                return true;
            }
            return !stage.completed;
        });

        return normalizedStages.map((stage, index) => ({
            ...stage,
            completed: index <= inferredLastCompletedIndex,
            current: index === nextIncompleteIndex && index > inferredLastCompletedIndex,
        }));
    }, [stages]);

    const copyToClipboard = async () => {
        if (!trackingId) {
            return;
        }

        try {
            await navigator.clipboard.writeText(trackingId);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    const statusLabel = getStatusLabel(status);
    const statusColor = getStatusColor(status);
    const statusBadge = getStatusBadge(status);

    return (
        <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
            <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 shadow-sm shadow-slate-950/20">
                    SHIPMENT TRACKING
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
                    <div className="space-y-6">
                        <div className="rounded-[28px] border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/30 transition-colors duration-300">
                            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                                <div className="space-y-4">
                                    <motion.div className={`text-2xl font-bold leading-tight ${statusColor} md:text-4xl`} transition={{ duration: 0.3 }}>
                                        {statusLabel}
                                    </motion.div>
                                    <p className="max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                                        {description || "Track the current shipment status, next milestone, and delivery details in real time."}
                                    </p>
                                </div>

                                <div className={`rounded-3xl border px-4 py-3 text-sm font-semibold ${statusBadge}`}>
                                    {statusLabel}
                                </div>
                            </div>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Tracking ID</p>
                                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <span className="font-mono text-lg font-semibold text-purple-400 sm:text-xl">{trackingId}</span>
                                        <button
                                            type="button"
                                            onClick={copyToClipboard}
                                            className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white"
                                        >
                                            {copied ? "✓ Copied" : "📋 Copy"}
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Estimated Delivery</p>
                                    <p className="mt-3 text-lg font-semibold text-slate-100">
                                        {consignment.estimatedDelivery || "TBD"}
                                    </p>
                                    {consignment.service && (
                                        <p className="mt-2 text-sm text-slate-400">{consignment.service}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/20">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Progress Timeline</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        Follow each stage from pickup to final delivery.
                                    </p>
                                </div>
                                <span className="inline-flex rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                                    {stageTimeline.filter((stage) => stage.completed).length}/{stageTimeline.length} complete
                                </span>
                            </div>

                            <div className="mt-8 space-y-4">
                                {stageTimeline.map((stage, index) => (
                                    <motion.div
                                        key={`${stage.label}-${index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
                                        className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className={`flex h-11 w-11 items-center justify-center rounded-full border-2 ${stage.completed ? "border-emerald-400 bg-emerald-500 text-slate-950" : "border-slate-700 bg-slate-900 text-slate-400"}`}>
                                                    {stage.completed ? "✓" : index + 1}
                                                </div>
                                                {index < stageTimeline.length - 1 && (
                                                    <span className="hidden md:block absolute right-[-100%] top-1/2 h-px w-[calc(100%+2rem)] -translate-y-1/2 bg-slate-700" aria-hidden="true" />
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-base font-semibold text-slate-100">{stage.label}</p>
                                                <p className="mt-1 text-sm text-slate-500">{stage.date || "Pending"}</p>
                                            </div>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${stage.completed ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
                                            {stage.completed ? "Completed" : "Pending"}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-[28px] border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/20">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Consignment Overview</p>
                                    <h2 className="mt-2 text-2xl font-bold text-slate-100">Shipment details</h2>
                                </div>
                                <div className={`rounded-3xl border px-3 py-1 text-xs font-semibold uppercase ${statusBadge}`}>
                                    {statusLabel}
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sender</p>
                                    <p className="mt-3 font-semibold text-slate-100">{consignment.sender?.name || "Unknown sender"}</p>
                                    {consignment.sender?.address && (
                                        <p className="mt-2 text-sm leading-6 text-slate-400">{consignment.sender.address}</p>
                                    )}
                                </div>
                                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Recipient</p>
                                    <p className="mt-3 font-semibold text-slate-100">{consignment.recipient?.name || "Unknown recipient"}</p>
                                    {consignment.recipient?.address && (
                                        <p className="mt-2 text-sm leading-6 text-slate-400">{consignment.recipient.address}</p>
                                    )}
                                </div>
                                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Package</p>
                                    <p className="mt-3 text-lg font-semibold text-slate-100">{consignment.weight || "N/A"}</p>
                                    {consignment.dimensions && (
                                        <p className="mt-2 text-sm text-slate-400">{consignment.dimensions}</p>
                                    )}
                                </div>
                                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Reference</p>
                                    <p className="mt-3 text-lg font-semibold text-slate-100">{consignment.reference || trackingId}</p>
                                    {consignment.contact && (
                                        <p className="mt-2 text-sm text-slate-400">{consignment.contact}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/20">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Checkpoint summary</p>
                            <div className="mt-4 space-y-4">
                                <div className="flex items-center justify-between rounded-3xl bg-slate-900/80 p-4">
                                    <span className="text-sm text-slate-400">Current location</span>
                                    <span className="text-sm font-semibold text-slate-100">{currentLocation || "Tracking data unavailable"}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-3xl bg-slate-900/80 p-4">
                                    <span className="text-sm text-slate-400">Next milestone</span>
                                    <span className="text-sm font-semibold text-slate-100">{nextMilestone || "Package Registered"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
