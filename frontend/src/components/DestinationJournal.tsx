import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { Journal, UpdateJournal } from '../services/Visited';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {useState} from 'react'; 

const DestinationJournal = () => {
    const [journalContent, setJournalContent] = useState<string>('');
    const { name } = useParams<{ name: string }>();
    const [edit, setEdit] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
    const fetchJournal = async () => {
        try {
            if (!name) return;
            const content = await Journal(name);
            setJournalContent(content || ''); // Handle null/undefined
        } catch (error) {
            console.error('Error fetching journal:', error);
            setJournalContent('');
        }
    };
    fetchJournal();
}, [name]);

    const handleUpdateJournal = async () => {
        if (!name) return;
        try {
            await UpdateJournal(name, journalContent);
            setEdit(false);
        } catch (error) {
            console.error('Error updating journal:', error);
        }
    };

    return (
        <div className="min-h-screen bg-amber-50">
            <Navbar />
            <div className="flex justify-between items-start mx-10 mt-4">
                <button onClick={() => navigate('/map')} className="bg-amber-500 text-white px-4 py-2 rounded-md translate-x-[20%]">
                    Return to Map
                </button>
            </div>
            <div className="max-w-4xl mx-auto p-6">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-amber-800 mb-2">Travel Journal</h1>
                    <p className="text-amber-600 italic">Document your adventures and cherish the memories</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-amber-400">
                    <h2 className="text-2xl font-serif text-amber-900 mb-4">
                        Currently Exploring: <span className="font-bold underline">{name || 'Unknown Destination'}</span>
                    </h2>
                    
                    {edit ? (
                        <div className="relative">
                            <textarea 
                                value={journalContent}
                                onChange={(e) => setJournalContent(e.target.value)}
                                className='
                                    border-l-4 border-amber-200 
                                    bg-amber-50  
                                    text-gray-700 
                                    rounded-none 
                                    p-4 
                                    w-full 
                                    focus:outline-none 
                                    focus:ring-1 focus:ring-amber-300 
                                    focus:bg-amber-50
                                    resize-none
                                    placeholder-amber-400
                                    leading-relaxed
                                    overflow-y-auto
                                    max-h-64
                                    whitespace-pre-wrap
                                '
                                rows={5}
                                placeholder="Write about your journey!"
                            />
                        </div>
                    ) : (
                        <div className="max-h-64 overflow-y-auto">
                            <pre className="
                                font-sans
                                border-l-4 border-amber-200 
                                bg-amber-50  
                                text-gray-700 
                                rounded-none 
                                p-4 
                                w-full 
                                whitespace-pre-wrap
                                leading-relaxed
                            ">
                                {journalContent || "No entries yet. Click Edit to start writing!"}
                            </pre>
                        </div>
                    )}
                    <div className='flex justify-center mt-6'>
                        <button 
                            onClick={() => {
                                if (edit) {
                                    handleUpdateJournal();
                                } else {
                                    setEdit(true);
                                }
                            }} 
                            className="bg-amber-500 text-white px-4 py-2 rounded-md"
                        >
                            {edit ? 'Save' : 'Edit'}
                        </button>
                    </div>
                </div>

                <div className="bg-amber-100 rounded-lg p-4 text-center">
                    <p className="text-amber-800">"The world is a book, and those who do not travel read only a page." — Saint Augustine</p>
                </div>
            </div>
        </div>
    );
};

export default DestinationJournal;