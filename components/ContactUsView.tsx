import React, { useState } from 'react';
import { SendIcon, StarIcon, ChatBubbleIcon, GlobeIcon } from '../constants';

interface ContactUsViewProps {
    onSuccess: (message: string) => void;
}

export const ContactUsView: React.FC<ContactUsViewProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'support',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            onSuccess("Thank you for reaching out to Music Station Radio! Our support team will get back to you within 24 hours.");
            setFormData({ name: '', email: '', subject: 'support', message: '' });
        }, 1500);
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in h-full overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-12 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--accent-color)]/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-4 relative z-10">
                        Network Inquiries
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto relative z-10">
                        Have a question, partnership proposal, or feedback for the Music Station Radio team? We're here to amplify your experience.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
                    {/* Left: Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white font-orbitron mb-6 flex items-center gap-3">
                                <span className="text-[var(--accent-color)]">01.</span> Reach Out
                            </h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 transition-all group-hover:scale-110">
                                        <ChatBubbleIcon className="w-6 h-6"/>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Email Our Team</p>
                                        <p className="text-white font-bold text-lg">ops@musicstationradio.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 transition-all group-hover:scale-110">
                                        <GlobeIcon className="w-6 h-6"/>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Network HQ</p>
                                        <p className="text-white font-bold text-lg">Innovation District, Global Hub</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 transition-all group-hover:scale-110">
                                        <StarIcon className="w-6 h-6"/>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Network Hours</p>
                                        <p className="text-white font-bold text-lg">Mon - Fri: 24/7 Global Ops</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gradient-to-br from-[var(--accent-color)]/10 to-transparent border border-white/5 rounded-3xl">
                            <h4 className="font-bold text-white mb-2">Network Status</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Our engineers are monitoring the network around the clock. Current Status: <span className="text-green-400 font-bold uppercase tracking-tighter">Operational</span>
                            </p>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
                        <h3 className="text-xl font-bold text-white font-orbitron mb-8 flex items-center gap-3">
                            <span className="text-[var(--accent-color)]">02.</span> Dispatch Ticket
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Identifier</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-black/40 border border-gray-700 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-all" 
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Return Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-black/40 border border-gray-700 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-all" 
                                        placeholder="Email Address"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Department</label>
                                <select 
                                    value={formData.subject}
                                    onChange={e => setFormData({...formData, subject: e.target.value})}
                                    className="w-full bg-black/40 border border-gray-700 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-[var(--accent-color)] appearance-none cursor-pointer transition-all"
                                >
                                    <option value="support" className="bg-gray-900">Platform Support</option>
                                    <option value="artist" className="bg-gray-900">Artist Relations</option>
                                    <option value="station" className="bg-gray-900">Network Management</option>
                                    <option value="advertising" className="bg-gray-900">Sponsorships</option>
                                    <option value="other" className="bg-gray-900">General Inquiry</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Message Payload</label>
                                <textarea 
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    className="w-full bg-black/40 border border-gray-700 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-all" 
                                    placeholder="Communicate your request to the Music Station Radio team..."
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-[var(--accent-color)] hover:brightness-110 text-black font-black py-5 rounded-2xl transition-all shadow-xl shadow-[var(--accent-color)]/20 uppercase tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <SendIcon className="w-5 h-5"/>
                                        Dispatch Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};