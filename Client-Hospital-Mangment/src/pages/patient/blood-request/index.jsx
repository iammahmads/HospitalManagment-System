import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplet, FileText, Send, CheckCircle, AlertCircle, Plus, Minus, Activity } from 'lucide-react'
import { BACKEND_URL } from '../../../services'

// Blood Groups Data
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodDonationRequestForm() {
    const [form, setForm] = useState({
        bloodGroup: 'A+',
        units: 1,
        notes: ''
    })
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)

    // Handle Note Change
    const handleNotesChange = (e) =>
        setForm((prev) => ({ ...prev, notes: e.target.value }))

    // Handle Blood Group Selection
    const selectBloodGroup = (group) => 
        setForm((prev) => ({ ...prev, bloodGroup: group }))

    // Handle Units Change
    const adjustUnits = (amount) => {
        setForm((prev) => ({
            ...prev,
            units: Math.max(1, prev.units + amount) // Prevent going below 1
        }))
    }

    const submit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        try {
            const res = await fetch(`${BACKEND_URL}/requests`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                credentials: "include",
                body: JSON.stringify(form)
            })
            if (!res.ok) throw new Error(res.statusText)
            
            setStatus({ type: 'success', msg: 'Donation request submitted successfully.' })
            setForm({ bloodGroup: 'A+', units: 1, notes: '' })
        } catch (err) {
            setStatus({ type: 'err', msg: 'Failed to submit request. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center w-full min-h-[60vh] p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
            >
                {/* Header */}
                <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Droplet className="w-6 h-6 text-red-600 fill-red-600" />
                            Donate Blood
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Donate blood to bank.</p>
                    </div>
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                        <Activity className="w-6 h-6 text-red-500" />
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                    
                    {/* Status Message */}
                    <AnimatePresence>
                        {status && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
                                    status.type === 'success' 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                    : 'bg-red-50 text-red-700 border border-red-100'
                                }`}
                            >
                                {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {status.msg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={submit} className="space-y-8">
                        
                        {/* 1. Blood Group Selection (Visual Grid) */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Select Blood Group</label>
                            <div className="grid grid-cols-4 gap-3">
                                {BLOOD_GROUPS.map((bg) => {
                                    const isSelected = form.bloodGroup === bg;
                                    return (
                                        <button
                                            key={bg}
                                            type="button"
                                            onClick={() => selectBloodGroup(bg)}
                                            className={`
                                                h-12 rounded-xl font-bold text-sm transition-all duration-200 border
                                                ${isSelected 
                                                    ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200 scale-105' 
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:bg-red-50'
                                                }
                                            `}
                                        >
                                            {bg}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 2. Units Counter (Stepper) */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Units</label>
                            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 w-fit">
                                <button
                                    type="button"
                                    onClick={() => adjustUnits(-1)}
                                    disabled={form.units <= 1}
                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600 hover:text-red-600 disabled:opacity-50 disabled:hover:text-slate-600 transition-colors"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="w-12 text-center text-xl font-bold text-slate-800">{form.units}</span>
                                <button
                                    type="button"
                                    onClick={() => adjustUnits(1)}
                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600 hover:text-red-600 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* 3. Notes (Textarea) */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                Additional Notes <span className="text-slate-400 font-normal normal-case">(Optional)</span>
                            </label>
                            <div className="relative">
                                <FileText className="absolute top-3 left-3 w-5 h-5 text-slate-400" />
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleNotesChange}
                                    placeholder="Enter patient condition, urgency, or specific requirements..."
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none h-28"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                                ${loading 
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                                    : 'bg-red-600 text-white hover:bg-red-700 shadow-red-200 hover:-translate-y-0.5'
                                }
                            `}
                        >
                            {loading ? (
                                <>Processing Request...</>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Request
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}